
import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// --- Mapeamento e Estrutura de Progresso ---

const KIWIFY_PRODUCT_TO_MODULE_ID: { [key: string]: string } = {
  'aece0e10-590a-11f0-a691-c7c31a23c521': 'grafismo-fonetico',
  'ef805df0-83b2-11f0-b76f-c30ef01f8da7': 'desafio-21-dias',
  'ecb5d950-5dc0-11f0-a549-539ae1cd3c85': 'historias-curtas',
  'cde90d10-5dbd-11f0-8dec-3b93c26e3853': 'checklist-alfabetizacao',
};

const initialProgress = {
    'grafismo-fonetico': { status: 'locked', submodules: { 'intro': { status: 'locked' }, 'pre-alf': { status: 'locked' }, 'alfabeto': { status: 'locked' }, 'silabas': { status: 'locked' }, 'fonico': { status: 'locked' }, 'palavras': { status: 'locked' }, 'escrita': { status: 'locked' }, 'bonus': { status: 'locked' }}},
    'desafio-21-dias': { status: 'locked', submodules: {} },
    'checklist-alfabetizacao': { status: 'locked', submodules: {} },
    'historias-curtas': { status: 'locked', submodules: {} },
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

async function verifySignatureAndGetPayload(request: NextRequest, secret: string) {
    const signature = request.nextUrl.searchParams.get('signature');
    const payload = await request.json();

    if (!signature) {
        throw new Error('Assinatura do webhook ausente.');
    }

    // A Kiwify não usa um HMAC padrão. A verificação é comparar o segredo
    // (o "Token" da Kiwify) com a "signature" enviada como parâmetro na URL.
    if (signature !== secret) {
        throw new Error('Assinatura do webhook inválida.');
    }
    
    return payload;
}


export async function POST(request: NextRequest) {
    // Esta variável DEVE conter o "Token" da Kiwify, que atua como o segredo.
    const kiwifySecret = process.env.KIWIFY_TOKEN;

    if (!kiwifySecret) {
        console.error('KIWIFY_TOKEN (o Token do webhook da Kiwify) não está configurado.');
        return NextResponse.json({ success: false, message: 'Erro de configuração do servidor.' }, { status: 500 });
    }

    try {
        initializeAdmin();
        const db = getFirestore();
        const auth = getAuth();

        const payload = await verifySignatureAndGetPayload(request, kiwifySecret);
        
        if (payload.order_status !== 'paid') {
             return NextResponse.json({ success: true, message: 'Webhook recebido, mas nenhuma ação tomada para o status: ' + payload.order_status });
        }

        const customerEmail = payload.Customer?.email?.toLowerCase();
        const customerName = payload.Customer?.full_name || 'Novo Aluno';
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
            // **Cenário 1: Novo Cliente**
            console.log(`Novo cliente detectado: ${customerEmail}. Criando conta...`);
            
            // 1. Criar usuário no Firebase Authentication
            const newUserRecord = await auth.createUser({
                email: customerEmail,
                emailVerified: true,
                password: '123456', // Senha padrão
                displayName: customerName,
            });

            // 2. Preparar progresso e desbloquear o módulo
            const userProgress = JSON.parse(JSON.stringify(initialProgress)); // Deep copy
            userProgress[moduleId].status = 'active';
            if (moduleId === 'grafismo-fonetico') {
                userProgress[moduleId].submodules.intro.status = 'active';
            }

            // 3. Criar documento no Firestore
            await db.collection('users').doc(newUserRecord.uid).set({
                name: customerName,
                email: customerEmail,
                progress: userProgress,
            });
            
            console.log(`Conta criada e módulo '${moduleId}' desbloqueado para ${customerEmail}.`);
            return NextResponse.json({ success: true, message: `Conta criada e módulo desbloqueado para ${customerEmail}.` });

        } else {
            // **Cenário 2: Cliente Existente**
            console.log(`Cliente existente detectado: ${customerEmail}. Desbloqueando módulo...`);

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

    } catch (error: any) {
        if (error.message.includes('Assinatura')) {
            return NextResponse.json({ success: false, message: error.message }, { status: 401 });
        }
        console.error('Erro fatal ao processar o webhook da Kiwify:', error);
        return NextResponse.json({ success: false, message: 'Ocorreu um erro interno.' }, { status: 500 });
    }
}
