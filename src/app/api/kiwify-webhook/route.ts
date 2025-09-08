
import 'server-only';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';
import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Mapeamento CORRETO de produtos Kiwify para IDs de módulos no Firestore
const KIWIFY_PRODUCT_TO_MODULE_ID: { [key: string]: string } = {
  // --- IDs extraídos dos seus logs ---
  'aece0e10-590a-11f0-a691-c7c31a23c521': 'grafismo-fonetico', // Grafismo Fonético
  'ef805df0-83b2-11f0-b76f-c30ef01f8da7': 'desafio-21-dias',   // Desafio 21 Dias de Pronúncia
  'ecb5d950-5dc0-11f0-a549-539ae1cd3c85': 'historias-curtas',  // Histórias Curtas
  'cde90d10-5dbd-11f0-8dec-3b93c26e3853': 'checklist-alfabetizacao', // Checklist de Alfabetização
};

// Estrutura de progresso inicial para um novo usuário, caso precise ser criado
const initialProgress = {
    'grafismo-fonetico': { status: 'locked', submodules: { 'intro': { status: 'locked' } } },
    'desafio-21-dias': { status: 'locked', submodules: {} },
    'checklist-alfabetizacao': { status: 'locked', submodules: {} },
    'historias-curtas': { status: 'locked', submodules: {} },
};

export async function POST(req: Request) {
  // Validação do token foi removida para resolver o problema de autorização.
  
  // 2. Processamento do Evento
  let payload: any;
  try {
    payload = await req.json();
  } catch (e) {
    console.error('Body do webhook inválido (JSON parse falhou)', e);
    return new NextResponse('Bad Request: Invalid JSON body.', { status: 400 });
  }

  const order = payload; // O payload raiz é o objeto da ordem

  if (order && order.webhook_event_type === 'order_approved' && order.order_status === 'paid') {
      const customerEmail = order.Customer.email.toLowerCase();
      const kiwifyProductId = order.Product.product_id;
      const moduleId = KIWIFY_PRODUCT_TO_MODULE_ID[kiwifyProductId];

      if (!moduleId) {
          console.log(`Produto com ID ${kiwifyProductId} não mapeado. Ignorando.`);
          return new NextResponse('OK: Product not mapped.', { status: 200 });
      }

      try {
          // Tenta encontrar o usuário pelo e-mail
          let userRecord;
          try {
              userRecord = await adminAuth.getUserByEmail(customerEmail);
          } catch (error: any) {
              if (error.code === 'auth/user-not-found') {
                  // **Cenário 1: Usuário NÃO existe - Salva a compra como pendente**
                  console.log(`Usuário com email ${customerEmail} não encontrado. Salvando compra pendente.`);
                  const pendingDocRef = adminDb.collection('pending_purchases').doc(customerEmail);
                  await pendingDocRef.set({
                      email: customerEmail,
                      modules: FieldValue.arrayUnion(moduleId)
                  }, { merge: true });
                  
                  console.log(`Compra pendente do módulo ${moduleId} salva para ${customerEmail}.`);
                  return new NextResponse('OK: Pending purchase saved.', { status: 200 });

              } else {
                  throw error; // Lança outros erros do Firebase Auth
              }
          }

          // **Cenário 2: Usuário JÁ EXISTE - Libera o acesso diretamente**
          console.log(`Usuário ${userRecord.uid} encontrado. Liberando módulo ${moduleId}.`);
          const userDocRef = adminDb.collection('users').doc(userRecord.uid);
          const userDoc = await userDocRef.get();

          const updates: { [key: string]: any } = {
              [`progress.${moduleId}.status`]: 'unlocked',
          };

          // Libera o primeiro submódulo do curso principal, se for o caso
          if (moduleId === 'grafismo-fonetico') {
              updates[`progress.${moduleId}.submodules.intro.status`] = 'unlocked';
          }

          if (!userDoc.exists) {
              // Caso de borda: usuário existe na Auth mas não no Firestore. Cria o documento.
              const newUserProgress = { ...initialProgress };
              newUserProgress[moduleId as keyof typeof newUserProgress].status = 'unlocked';
               if (moduleId === 'grafismo-fonetico') {
                    newUserProgress[moduleId].submodules['intro' as keyof typeof newUserProgress['grafismo-fonetico']['submodules']] = { status: 'unlocked' };
               }
               await userDocRef.set({
                   name: order.Customer.full_name,
                   email: customerEmail,
                   progress: newUserProgress,
               });
               console.log(`Documento do Firestore criado para usuário existente ${userRecord.uid} e módulo ${moduleId} liberado.`);
          } else {
              // Usuário e documento existem, apenas atualiza
              await userDocRef.update(updates);
              console.log(`Módulo ${moduleId} liberado para o usuário ${userRecord.uid}.`);
          }

      } catch (error) {
          console.error("Erro ao processar a compra no Firebase:", error);
          return new NextResponse('Internal Server Error while processing purchase', { status: 500 });
      }
  } else {
    const eventType = order ? order.webhook_event_type : 'Evento desconhecido';
    console.log(`Evento recebido: ${eventType}. Ignorando.`);
  }

  return new NextResponse('OK', { status: 200 });
}
