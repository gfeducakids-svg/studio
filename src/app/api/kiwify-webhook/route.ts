
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Mapeia o ID do produto da Kiwify para o ID do módulo no nosso sistema.
const KIWIFY_PRODUCT_TO_MODULE_ID: { [key: string]: string } = {
  'aece0e10-590a-11f0-a691-c7c31a23c521': 'grafismo-fonetico',
  'ef805df0-83b2-11f0-b76f-c30ef01f8da7': 'desafio-21-dias',
  'ecb5d950-5dc0-11f0-a549-539ae1cd3c85': 'historias-curtas',
  'cde90d10-5dbd-11f0-8dec-3b93c26e3853': 'checklist-alfabetizacao',
};

// --- Inicialização segura do Firebase Admin ---
function initializeAdmin() {
    // Garante que a inicialização só aconteça uma vez.
    if (admin.apps.length > 0) {
        return;
    }

    // A Vercel pode não interpretar corretamente as quebras de linha nas variáveis de ambiente.
    // Substituir '\\n' por '\n' garante que a chave privada seja lida corretamente.
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
        console.error("As variáveis de ambiente do Firebase Admin não estão configuradas.");
        throw new Error("Erro de configuração do servidor: Faltam credenciais do Firebase Admin.");
    }
    
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: privateKey,
        }),
    });
}

// --- Lógica do Webhook ---

// Esta função lê o corpo da requisição UMA VEZ, verifica a assinatura, e retorna o payload já parseado.
async function verifySignatureAndGetPayload(request: NextRequest, secret: string) {
    const signature = request.headers.get('X-Signature');
    if (!signature) {
        throw new Error('Assinatura não encontrada.');
    }

    const body = await request.text();
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(body).digest('hex');

    if (digest !== signature) {
        throw new Error('Assinatura inválida.');
    }
    
    return JSON.parse(body);
}

export async function POST(request: NextRequest) {
    const secret = process.env.KIWIFY_WEBHOOK_SECRET;

    if (!secret) {
        console.error('KIWIFY_WEBHOOK_SECRET não está configurado nas variáveis de ambiente.');
        return NextResponse.json({ success: false, message: 'Erro de configuração do servidor.' }, { status: 500 });
    }

    try {
        // A função de verificação agora retorna o payload, evitando a leitura dupla do corpo.
        const payload = await verifySignatureAndGetPayload(request, secret);
        
        if (payload.order_status === 'paid') {
            const customerEmail = payload.Customer?.email;
            const productId = payload.Product?.product_id;

            if (!customerEmail || !productId) {
                 return NextResponse.json({ success: false, message: 'Estrutura de payload inválida.' }, { status: 400 });
            }

            const moduleId = KIWIFY_PRODUCT_TO_MODULE_ID[productId];

            if (!moduleId) {
                console.warn(`Webhook recebido para um ID de produto não mapeado: ${productId}`);
                return NextResponse.json({ success: true, message: `Produto '${payload.Product?.product_name}' não mapeado para ${customerEmail}.` });
            }
            
            // Inicializa o Firebase Admin de forma segura.
            initializeAdmin();
            const db = getFirestore();
            const usersRef = db.collection('users');
            const q = usersRef.where('email', '==', customerEmail);
            const querySnapshot = await q.get();

            if (querySnapshot.empty) {
                console.warn(`Usuário com email ${customerEmail} não encontrado. A compra não pode ser atribuída.`);
                return NextResponse.json({ success: true, message: `Usuário com email ${customerEmail} não encontrado.` });
            }

            for (const userDoc of querySnapshot.docs) {
                const userDocRef = db.collection('users').doc(userDoc.id);
                const userData = userDoc.data();
                
                const updates: { [key: string]: any } = {};
                updates[`progress.${moduleId}.status`] = 'active';

                // Caso especial para o módulo principal, desbloqueia também o primeiro submódulo.
                if (moduleId === 'grafismo-fonetico' && userData.progress?.[moduleId]?.submodules) {
                    const submodules = userData.progress[moduleId].submodules;
                    const firstSubmoduleId = Object.keys(submodules).find(key => key === 'intro') || Object.keys(submodules)[0];
                    if (firstSubmoduleId && submodules[firstSubmoduleId]?.status === 'locked') {
                       updates[`progress.grafismo-fonetico.submodules.${firstSubmoduleId}.status`] = 'active';
                    }
                }
                
                await userDocRef.update(updates);
                console.log(`Módulo '${moduleId}' desbloqueado com sucesso para o usuário ${userDoc.id} (${customerEmail}).`);
            }

            return NextResponse.json({ success: true, message: `Módulo ${moduleId} desbloqueado para ${customerEmail}.` });
        }

        return NextResponse.json({ success: true, message: 'Webhook recebido, mas nenhuma ação tomada para o status: ' + payload.order_status });

    } catch (error: any) {
        if (error.message.includes('Assinatura')) {
            return NextResponse.json({ success: false, message: error.message }, { status: 401 });
        }
        console.error('Erro ao processar o webhook da Kiwify:', error);
        return NextResponse.json({ success: false, message: 'Ocorreu um erro interno.' }, { status: 500 });
    }
}
