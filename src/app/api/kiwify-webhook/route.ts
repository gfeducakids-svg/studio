
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
  'cde90d10-5dbd-11f0-8dec-3b93c26e3853': 'Checklist de Alfabetização',
};

// Estrutura de progresso inicial para um novo usuário, caso precise ser criado
const initialProgress = {
    'grafismo-fonetico': { status: 'locked', submodules: { 'intro': { status: 'unlocked' } } },
    'desafio-21-dias': { status: 'locked', submodules: {} },
    'checklist-alfabetizacao': { status: 'locked', submodules: {} },
    'historias-curtas': { status: 'locked', submodules: {} },
};

async function sendPurchaseConfirmationEmail({ customerEmail }: { customerEmail: string; }) {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASS) {
        console.warn('As credenciais de e-mail (GMAIL_USER, GMAIL_APP_PASS) não estão configuradas. Pulando envio de e-mail para o cliente.');
        return;
    }

    const transporter = makeTransportGmail();
    const customerEmailHtml = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>✅ Garantindo seu acesso - EducaKids</title>
          <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
              
              body {
                  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                  line-height: 1.6;
                  color: #4a5568;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background: #f7f9fc;
              }
              .container {
                  background: white;
                  border-radius: 20px;
                  padding: 30px;
                  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                  border: 1px solid #e2e8f0;
              }
              .header {
                  text-align: center;
                  margin-bottom: 25px;
              }
              .logo {
                  font-size: 32px;
                  font-weight: 800;
                  color: #2d3748;
                  margin-bottom: 10px;
                  letter-spacing: -0.5px;
              }
              .preheader {
                  font-size: 15px;
                  color: #718096;
                  font-weight: 500;
              }
              .content {
                  font-size: 17px;
                  font-weight: 500;
                  margin-bottom: 25px;
                  letter-spacing: -0.2px;
              }
              .highlight {
                  background: #e6fffa;
                  color: #234e52;
                  padding: 4px 10px;
                  border-radius: 8px;
                  font-weight: 700;
                  letter-spacing: -0.2px;
              }
              .cta-button {
                  display: block;
                  background: #4299e1;
                  color: white;
                  text-decoration: none;
                  padding: 20px 40px;
                  border-radius: 30px;
                  font-weight: 700;
                  font-size: 17px;
                  text-align: center;
                  margin: 30px auto;
                  max-width: 300px;
                  transition: all 0.3s ease;
                  box-shadow: 0 6px 20px rgba(66, 153, 225, 0.25);
                  letter-spacing: -0.3px;
              }
              .cta-button:hover {
                  background: #3182ce;
                  transform: translateY(-1px);
                  box-shadow: 0 6px 20px rgba(66, 153, 225, 0.4);
              }
              .footer {
                  text-align: center;
                  font-size: 13px;
                  color: #a0aec0;
                  font-weight: 500;
                  margin-top: 25px;
                  letter-spacing: -0.1px;
              }
              .checkmark {
                  color: #48bb78;
                  margin-right: 8px;
              }
              @media (max-width: 480px) {
                  body { padding: 10px; }
                  .container { padding: 20px; }
                  .cta-button { font-size: 15px; padding: 15px 25px; }
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <div class="logo">🎓 EducaKids</div>
                  <div class="preheader">Acesso garantido e liberado para você</div>
              </div>
              
              <div class="content">
                  <p><strong>Oi!</strong></p>
                  
                  <p>Este e-mail é para <span class="highlight">garantir seu acesso</span> ao conteúdo exclusivo do <strong>EducaKids</strong>.</p>
                  
                  <p>Se você chegou até aqui, significa que sua compra foi processada com sucesso.</p>
                  
                  <p><strong>Seu acesso está 100% garantido e liberado.</strong></p>
                  
                  <p>Clique no botão abaixo para entrar na sua área de membros agora mesmo:</p>
              </div>
              
              <a href="https://areademembroseducakids.vercel.app/Obrigado-Tutorial" class="cta-button">
                  Começar a Aventura
              </a>
              
              <div class="footer">
                  <p>Problemas para acessar? Responda este e-mail que te ajudamos.<br>
                  Guarde este link em local seguro.</p>
              </div>
          </div>
      </body>
      </html>
    `;

    try {
        await transporter.sendMail({
            from: `"EducaKids" <${process.env.GMAIL_USER}>`,
            to: customerEmail,
            subject: `✅ Acesso Liberado! Seu conteúdo EducaKids está pronto.`,
            html: customerEmailHtml,
        });
        console.log(`E-mail de confirmação de compra enviado para ${customerEmail}`);
    } catch (error) {
        console.error("Falha ao enviar e-mail de confirmação para o cliente:", error);
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

  if (!moduleId) {
      console.log(`Produto com ID ${kiwifyProductId} não mapeado. Ignorando.`);
      return new NextResponse('OK: Product not mapped.', { status: 200 });
  }

  try {
    // Envia o e-mail de confirmação para o cliente assim que a compra é confirmada
    await sendPurchaseConfirmationEmail({ customerEmail });

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
