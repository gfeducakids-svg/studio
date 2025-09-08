
import { NextRequest, NextResponse } from 'next/server';
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
    if (admin.apps.length > 0) {
        return admin.app();
    }

    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
        console.error("As variáveis de ambiente do Firebase Admin não estão configuradas.");
        throw new Error("Erro de configuração do servidor: Faltam credenciais do Firebase Admin.");
    }
    
    return admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: privateKey,
        }),
    });
}

// --- Lógica do Webhook ---

// Esta função verifica o token de autorização e retorna o payload da requisição.
async function verifyTokenAndGetPayload(request: NextRequest, secretToken: string) {
    const payload = await request.json();

    // A Kiwify envia o token que configuramos no painel.
    // Verificamos se o token recebido é o mesmo que o nosso segredo.
    if (payload.token !== secretToken) {
        throw new Error('Token de autorização inválido.');
    }
    
    return payload;
}

export async function POST(request: NextRequest) {
    // Agora usamos o TOKEN que você configurou na Kiwify.
    const kiwifyToken = process.env.KIWIFY_TOKEN;

    if (!kiwifyToken) {
        console.error('KIWIFY_TOKEN não está configurado nas variáveis de ambiente.');
        return NextResponse.json({ success: false, message: 'Erro de configuração do servidor.' }, { status: 500 });
    }

    try {
        initializeAdmin();
        const db = getFirestore();

        // Usamos a nova função de verificação.
        const payload = await verifyTokenAndGetPayload(request, kiwifyToken);
        
        if (payload.order_status === 'paid') {
            const customerEmail = payload.Customer?.email?.toLowerCase();
            const productId = payload.Product?.product_id;

            if (!customerEmail || !productId) {
                 return NextResponse.json({ success: false, message: 'Estrutura de payload inválida.' }, { status: 400 });
            }

            const moduleId = KIWIFY_PRODUCT_TO_MODULE_ID[productId];

            if (!moduleId) {
                console.warn(`Webhook recebido para um ID de produto não mapeado: ${productId}`);
                return NextResponse.json({ success: true, message: `Produto '${payload.Product?.product_name}' não mapeado.` });
            }
            
            const usersRef = db.collection('users');
            const q = usersRef.where('email', '==', customerEmail);
            const querySnapshot = await q.get();

            if (querySnapshot.empty) {
                const pendingRef = db.collection('pending_purchases').doc(customerEmail);
                const pendingDoc = await pendingRef.get();
                
                const newModules = pendingDoc.exists ? pendingDoc.data()?.modules || [] : [];
                if (!newModules.includes(moduleId)) {
                    newModules.push(moduleId);
                }

                await pendingRef.set({
                    email: customerEmail,
                    modules: newModules,
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                }, { merge: true });
                
                console.log(`Compra pendente para o email ${customerEmail} salva com sucesso.`);
                return NextResponse.json({ success: true, message: `Compra pendente para ${customerEmail} registrada.` });
            }

            for (const userDoc of querySnapshot.docs) {
                const userDocRef = db.collection('users').doc(userDoc.id);
                
                const updates: { [key: string]: any } = {};
                updates[`progress.${moduleId}.status`] = 'active';

                if (moduleId === 'grafismo-fonetico') {
                    updates[`progress.grafismo-fonetico.submodules.intro.status`] = 'active';
                }
                
                await userDocRef.update(updates);
                console.log(`Módulo '${moduleId}' desbloqueado com sucesso para o usuário ${userDoc.id} (${customerEmail}).`);
            }

            return NextResponse.json({ success: true, message: `Módulo ${moduleId} desbloqueado para ${customerEmail}.` });
        }

        return NextResponse.json({ success: true, message: 'Webhook recebido, mas nenhuma ação tomada para o status: ' + payload.order_status });

    } catch (error: any) {
        if (error.message.includes('Token')) {
            return NextResponse.json({ success: false, message: error.message }, { status: 401 });
        }
        console.error('Erro ao processar o webhook da Kiwify:', error);
        return NextResponse.json({ success: false, message: 'Ocorreu um erro interno.' }, { status: 500 });
    }
}
