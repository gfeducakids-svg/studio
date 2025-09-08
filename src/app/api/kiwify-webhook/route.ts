
import 'server-only';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, getApp, credential } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Inicialização do Firebase Admin SDK
try {
  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountString) {
    throw new Error('A variável de ambiente FIREBASE_SERVICE_ACCOUNT_KEY não está definida.');
  }
  const serviceAccount = JSON.parse(serviceAccountString);

  if (!getApps().length) {
    initializeApp({
      credential: credential.cert(serviceAccount),
    });
  }
} catch (error) {
  console.error('Falha ao inicializar o Firebase Admin SDK:', error);
}

const adminAuth = getAuth();
const adminDb = getFirestore();

// Mapeamento de produtos Kiwify para IDs de módulos no Firestore
const KIWIFY_PRODUCT_TO_MODULE_ID: { [key: string]: string } = {
  '4337283': 'grafismo-fonetico',
  '4344400': 'desafio-21-dias',
  '4344404': 'historias-curtas',
  '4344402': 'checklist-alfabetizacao',
};

const initialProgress = {
    'grafismo-fonetico': { status: 'locked', submodules: { 'intro': { status: 'locked' } } },
    'desafio-21-dias': { status: 'locked', submodules: {} },
    'checklist-alfabetizacao': { status: 'locked', submodules: {} },
    'historias-curtas': { status: 'locked', submodules: {} },
};


export async function POST(req: Request) {
  // 1. Validação do Token do Webhook via Parâmetro de URL
  const webhookToken = process.env.KIWIFY_WEBHOOK_TOKEN;
  if (!webhookToken) {
    console.error('KIWIFY_WEBHOOK_TOKEN não está configurado nas variáveis de ambiente.');
    return new NextResponse('Server misconfiguration: Webhook token is missing.', { status: 500 });
  }

  const url = new URL(req.url);
  const providedToken = url.searchParams.get("token");

  if (providedToken !== webhookToken) {
    console.warn(`Tentativa de acesso não autorizado ao webhook. Token fornecido: ${providedToken}`);
    return new NextResponse('Unauthorized.', { status: 401 });
  }

  // 2. Processamento do Evento
  let event: any;
  try {
    event = await req.json();
  } catch (e) {
    console.error('Body do webhook inválido (JSON parse falhou)', e);
    return new NextResponse('Bad Request: Invalid JSON body.', { status: 400 });
  }
  
  if (event.event === 'order.paid') {
      const customerEmail = event.customer.email.toLowerCase();
      const kiwifyProductId = event.product.id.toString();
      const moduleId = KIWIFY_PRODUCT_TO_MODULE_ID[kiwifyProductId];

      if (!moduleId) {
          console.log(`Produto com ID ${kiwifyProductId} não mapeado. Ignorando.`);
          return new NextResponse('OK: Product not mapped.', { status: 200 });
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
                  newUserProgress[moduleId as keyof typeof newUserProgress].status = 'active';
                   if (moduleId === 'grafismo-fonetico') {
                        newUserProgress[moduleId].submodules['intro' as keyof typeof newUserProgress['grafismo-fonetico']['submodules']] = { status: 'active' };
                   }

                  // Sintaxe correta do Admin SDK
                  await adminDb.collection('users').doc(userRecord.uid).set({
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
          const userDocRef = adminDb.collection('users').doc(userRecord.uid);
          const userDoc = await userDocRef.get();

          if (!userDoc.exists) {
              // Caso de borda: usuário existe na Auth mas não no Firestore.
              // Criar documento no Firestore para ele.
               const newUserProgress = { ...initialProgress };
              newUserProgress[moduleId as keyof typeof newUserProgress].status = 'active';
               if (moduleId === 'grafismo-fonetico') {
                    newUserProgress[moduleId].submodules['intro' as keyof typeof newUserProgress['grafismo-fonetico']['submodules']] = { status: 'active' };
               }
               await userDocRef.set({
                   name: event.customer.name,
                   email: customerEmail,
                   progress: newUserProgress,
               });
               console.log(`Documento do Firestore criado para usuário existente ${userRecord.uid} e módulo ${moduleId} liberado.`);

          } else {
              console.log(`Usuário ${userRecord.uid} já existe. Liberando módulo ${moduleId}.`);
              const updates: { [key: string]: any } = {
                  [`progress.${moduleId}.status`]: 'active',
              };

              // Libera o primeiro submódulo do curso principal
              if (moduleId === 'grafismo-fonetico') {
                  updates[`progress.${moduleId}.submodules.intro.status`] = 'active';
              }
              
              await userDocRef.update(updates);
              console.log(`Módulo ${moduleId} liberado para o usuário ${userRecord.uid}.`);
          }

      } catch (error) {
          console.error("Erro ao processar a compra no Firebase:", error);
          return new NextResponse('Internal Server Error while processing purchase', { status: 500 });
      }
  } else {
    console.log(`Evento recebido: ${event.event}. Ignorando.`);
  }

  return new NextResponse('OK', { status: 200 });
}
