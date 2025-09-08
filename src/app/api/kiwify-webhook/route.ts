
import 'server-only';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase-admin/firestore';
import { initializeApp, getApps, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { credential } from 'firebase-admin';
import { db as clientDb } from '@/lib/firebase'; // Firestore do lado cliente

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Inicialização do Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);

const adminApp = !getApps().length
  ? initializeApp({
      credential: credential.cert(serviceAccount),
    })
  : getApp();

const adminAuth = getAuth(adminApp);
const adminDb = getFirestore(adminApp);

// Mapeamento de produtos Kiwify para IDs de módulos no Firestore
const KIWIFY_PRODUCT_TO_MODULE_ID: { [key: string]: string } = {
  '4337283': 'grafismo-fonetico', // Substitua pelo ID real do produto
  '4344400': 'desafio-21-dias',    // Substitua pelo ID real do produto
  '4344404': 'historias-curtas',     // Substitua pelo ID real do produto
  '4344402': 'checklist-alfabetizacao', // Substitua pelo ID real do produto
};

const initialProgress = {
    'grafismo-fonetico': { status: 'locked', submodules: { 'intro': { status: 'locked' } } },
    'desafio-21-dias': { status: 'locked', submodules: {} },
    'checklist-alfabetizacao': { status: 'locked', submodules: {} },
    'historias-curtas': { status: 'locked', submodules: {} },
};


export async function POST(req: Request) {
  // 1. Validação do Token
  const token = process.env.KIWIFY_WEBHOOK_TOKEN;
  if (!token) {
    console.error('KIWIFY_WEBHOOK_TOKEN não está configurado');
    return new Response('Server misconfiguration', { status: 500 });
  }

  const url = new URL(req.url);
  const providedToken = url.searchParams.get('token');

  if (providedToken !== token) {
    console.warn('Token do webhook inválido', { providedToken });
    return new Response('Unauthorized', { status: 401 });
  }

  // 2. Processamento do Evento
  let event: any;
  try {
    event = await req.json();
  } catch (e) {
    console.error('Body do webhook inválido', e);
    return new Response('Bad Request', { status: 400 });
  }
  
  if (event.event === 'order.paid') {
      const customerEmail = event.customer.email.toLowerCase();
      const kiwifyProductId = event.product.id.toString();
      const moduleId = KIWIFY_PRODUCT_TO_MODULE_ID[kiwifyProductId];

      if (!moduleId) {
          console.log(`Produto com ID ${kiwifyProductId} não mapeado. Ignorando.`);
          return new Response('OK', { status: 200 });
      }

      try {
          // Verifica se o usuário já existe no Firebase Auth
          let userRecord;
          try {
              userRecord = await adminAuth.getUserByEmail(customerEmail);
          } catch (error: any) {
              if (error.code === 'auth/user-not-found') {
                  // Cenário 1: Usuário não existe, cria a conta
                  console.log(`Usuário com email ${customerEmail} não encontrado. Criando novo usuário.`);
                  userRecord = await adminAuth.createUser({
                      email: customerEmail,
                      password: '123456', // Senha padrão
                      displayName: event.customer.name,
                  });
                  
                  // Cria o documento no Firestore
                  const newUserProgress = { ...initialProgress };
                  newUserProgress[moduleId] = { status: 'active', submodules: {} };
                   if (moduleId === 'grafismo-fonetico') {
                        newUserProgress[moduleId].submodules['intro'] = { status: 'active' };
                   }

                  await setDoc(doc(adminDb, 'users', userRecord.uid), {
                      name: event.customer.name,
                      email: customerEmail,
                      progress: newUserProgress,
                  });

                  console.log(`Usuário ${userRecord.uid} criado e módulo ${moduleId} liberado.`);
              } else {
                  throw error; // Lança outros erros do Firebase Auth
              }
          }

          // Cenário 2: Usuário já existe, apenas atualiza o progresso
          if (userRecord) {
              console.log(`Usuário ${userRecord.uid} já existe. Liberando módulo ${moduleId}.`);
              const userDocRef = doc(adminDb, 'users', userRecord.uid);
              const updates: { [key: string]: any } = {
                  [`progress.${moduleId}.status`]: 'active',
              };

              // Libera o primeiro submódulo do curso principal
              if (moduleId === 'grafismo-fonetico') {
                  updates[`progress.${moduleId}.submodules.intro.status`] = 'active';
              }
              
              await updateDoc(userDocRef, updates);
              console.log(`Módulo ${moduleId} liberado para o usuário ${userRecord.uid}.`);
          }

      } catch (error) {
          console.error("Erro ao processar a compra no Firebase:", error);
          return new Response('Internal Server Error while processing purchase', { status: 500 });
      }
  } else {
    console.log(`Evento recebido: ${event.event}. Ignorando.`);
  }

  return new Response('OK', { status: 200 });
}
