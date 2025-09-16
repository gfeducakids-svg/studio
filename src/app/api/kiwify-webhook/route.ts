
import 'server-only';
import { adminAuth, db } from '@/lib/firebaseAdmin';
import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { makeTransportGmail } from '@/lib/diag';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Mapeamento CORRETO de produtos Kiwify para IDs de módulos no Firestore
const KIWIFY_PRODUCT_TO_MODULE_ID: { [key: string]: string } = {
  'aa0ddef0-8a83-11f0-99b6-fd7db9e425f5': 'grafismo-fonetico', // Grafismo Fonético
  'ef805df0-83b2-11f0-b76f-c30ef01f8da7': 'desafio-21-dias',   // Desafio 21 Dias de Pronúncia
  'ecb5d950-5dc0-11f0-a549-539ae1cd3c85': 'historias-curtas',  // Histórias Curtas
  'cde90d10-5dbd-11f0-8dec-3b93c26e3853': 'checklist-alfabetizacao', // Checklist de Alfabetização
};

const KIWIFY_PRODUCT_NAME: { [key: string]: string } = {
  'aa0ddef0-8a83-11f0-99b6-fd7db9e425f5': 'Grafismo Fonético',
  'ef805df0-83b2-11f0-b76f-c30ef01f8da7': 'Desafio 21 Dias de Pronúncia',
  'ecb5d950-5dc0-11f0-a549-539ae1cd3c85': 'Histórias Curtas',
  'cde90d10-5dbd-11f0-8dec-3b93c26e3d853': 'Checklist de Alfabetização',
};

// Estrutura de progresso inicial para um novo usuário, caso precise ser criado
const initialProgress = {
    'grafismo-fonetico': { status: 'locked', submodules: { 'intro': { status: 'unlocked' } } },
    'desafio-21-dias': { status: 'locked', submodules: {} },
    'checklist-alfabetizacao': { status: 'locked', submodules: {} },
    'historias-curtas': { status: 'locked', submodules: {} },
};

async function sendPurchaseNotificationEmail({ customerName, customerEmail, productName }: { customerName: string; customerEmail: string; productName: string; }) {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASS) {
        console.warn('As credenciais de e-mail (GMAIL_USER, GMAIL_APP_PASS) não estão configuradas. Pulando notificação.');
        return;
    }

    const transporter = makeTransportGmail();
    const notificationEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
            h1 { color: #24A9F4; }
            strong { color: #04123C; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🎉 Nova Venda Realizada!</h1>
            <p>Parabéns! Você acaba de receber um novo aluno na plataforma EducaKids.</p>
            <ul>
              <li><strong>Cliente:</strong> ${customerName}</li>
              <li><strong>Email:</strong> ${customerEmail}</li>
              <li><strong>Produto Comprado:</strong> ${productName}</li>
            </ul>
            <p>O acesso ao curso já foi liberado (ou está pendente, caso o usuário não exista).</p>
            <p>Continue o ótimo trabalho!</p>
            <p><em>- Seu sistema de notificação automática.</em></p>
          </div>
        </body>
      </html>
    `;

    try {
        await transporter.sendMail({
            from: `"Notificações EducaKids" <${process.env.GMAIL_USER}>`,
            to: process.env.GMAIL_USER, // Envia para você mesmo
            subject: `🎉 Nova Venda! - ${productName}`,
            html: notificationEmailHtml,
        });
        console.log(`E-mail de notificação de venda enviado para ${process.env.GMAIL_USER}`);
    } catch (error) {
        console.error("Falha ao enviar e-mail de notificação de venda:", error);
    }
}


export async function POST(req: Request) {
  let payload: any;
  try {
    payload = await req.json();
  } catch (e) {
    console.error('Body do webhook inválido (JSON parse falhou)', e);
    return new NextResponse('Bad Request: Invalid JSON body.', { status: 400 });
  }

  const order = payload;

  if (order?.webhook_event_type !== 'order_approved' || order?.order_status !== 'paid') {
    const eventType = order?.webhook_event_type || 'Evento desconhecido';
    console.log(`Evento recebido: ${eventType}. Ignorando.`);
    return new NextResponse('OK: Event ignored.', { status: 200 });
  }
  
  const customerEmail = order.Customer.email.toLowerCase();
  const customerName = order.Customer.full_name;
  const kiwifyProductId = order.Product.product_id;
  const moduleId = KIWIFY_PRODUCT_TO_MODULE_ID[kiwifyProductId];
  const productName = KIWIFY_PRODUCT_NAME[kiwifyProductId] || 'Produto Desconhecido';

  if (!moduleId) {
      console.log(`Produto com ID ${kiwifyProductId} não mapeado. Ignorando.`);
      return new NextResponse('OK: Product not mapped.', { status: 200 });
  }

  try {
    // Envia o e-mail de notificação assim que a compra é confirmada
    await sendPurchaseNotificationEmail({ customerName, customerEmail, productName });

    let userRecord;
    try {
        userRecord = await adminAuth.getUserByEmail(customerEmail);
    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            // **Cenário 1: Usuário NÃO existe - Salva a compra como pendente**
            console.log(`Usuário com email ${customerEmail} não encontrado. Salvando compra pendente.`);
            const pendingDocRef = db.collection('pending_purchases').doc(customerEmail);
            await pendingDocRef.set({
                email: customerEmail,
                modules: FieldValue.arrayUnion(moduleId)
            }, { merge: true });
            
            console.log(`Compra pendente do módulo ${moduleId} salva para ${customerEmail}.`);
            return new NextResponse('OK: Pending purchase saved.', { status: 200 });
        }
        // Para outros erros de autenticação, lançamos o erro para ser pego pelo bloco catch externo.
        throw error;
    }

    // **Cenário 2: Usuário JÁ EXISTE - Libera o acesso diretamente**
    console.log(`Usuário ${userRecord.uid} encontrado. Liberando módulo ${moduleId}.`);
    const userDocRef = db.collection('users').doc(userRecord.uid);
    const userDoc = await userDocRef.get();

    const updates: { [key: string]: any } = {
        [`progress.${moduleId}.status`]: 'unlocked',
    };

    // Libera o primeiro submódulo do curso principal, se for o caso
    if (moduleId === 'grafismo-fonetico') {
        updates[`progress.${moduleId}.submodules.intro.status`] = 'unlocked';
    }

    if (!userDoc.exists) {
        // Caso raro: usuário existe no Auth mas não no Firestore. Cria o documento.
        const newUserProgress = { ...initialProgress };
        
        // Aplica o desbloqueio no objeto de progresso antes de criar
        if (newUserProgress[moduleId as keyof typeof newUserProgress]) {
            newUserProgress[moduleId as keyof typeof newUserProgress].status = 'unlocked';
            if (moduleId === 'grafismo-fonetico') {
                newUserProgress[moduleId].submodules['intro' as keyof typeof newUserProgress['grafismo-fonetico']['submodules']] = { status: 'unlocked' };
            }
        }
       
       await userDocRef.set({
           name: order.Customer.full_name,
           email: customerEmail,
           progress: newUserProgress,
       });
       console.log(`Documento do Firestore criado para usuário existente ${userRecord.uid} e módulo ${moduleId} liberado.`);
    } else {
        // Usuário e documento existem, apenas atualiza o progresso.
        await userDocRef.update(updates);
        console.log(`Módulo ${moduleId} liberado para o usuário ${userRecord.uid}.`);
    }

  } catch (error) {
      console.error("Erro ao processar a compra no Firebase:", error);
      return new NextResponse('Internal Server Error while processing purchase', { status: 500 });
  }

  return new NextResponse('OK: Purchase processed.', { status: 200 });
}
