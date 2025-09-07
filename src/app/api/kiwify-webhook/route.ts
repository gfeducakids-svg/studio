
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

// --- Firebase Admin Initialization ---
// A inicialização agora ocorre de forma "lazy" dentro da própria função.

function initializeAdmin() {
    // Evita reinicializações se já houver uma instância
    if (admin.apps.length > 0) {
        return;
    }

    // A chave privada precisa de um tratamento especial para substituir `\\n` por `\n`
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
        throw new Error("Firebase Admin environment variables are not set.");
    }
    
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: privateKey,
        }),
    });
}


async function verifySignature(request: NextRequest, secret: string) {
    const signature = request.headers.get('X-Signature');
    if (!signature) {
        throw new Error('Signature not found.');
    }

    const body = await request.text();
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(body).digest('hex');

    if (digest !== signature) {
        throw new Error('Invalid signature.');
    }
    
    return JSON.parse(body);
}

export async function POST(request: NextRequest) {
    const secret = process.env.KIWIFY_WEBHOOK_SECRET;

    if (!secret) {
        console.error('KIWIFY_WEBHOOK_SECRET is not set in environment variables.');
        return NextResponse.json({ success: false, message: 'Server configuration error.' }, { status: 500 });
    }

    try {
        const payload = await verifySignature(request, secret);
        
        if (payload.order_status === 'paid') {
            const customerEmail = payload.Customer?.email;
            const productId = payload.Product?.product_id;

            if (!customerEmail || !productId) {
                 return NextResponse.json({ success: false, message: 'Invalid payload structure.' }, { status: 400 });
            }

            const moduleId = KIWIFY_PRODUCT_TO_MODULE_ID[productId];

            if (!moduleId) {
                console.warn(`Webhook received for an unmapped product ID: ${productId}`);
                return NextResponse.json({ success: true, message: `Product '${payload.Product?.product_name}' not mapped for ${customerEmail}.` });
            }
            
            // --- Unlock Logic moved here ---
            initializeAdmin();
            const db = getFirestore();
            const usersRef = db.collection('users');
            const q = usersRef.where('email', '==', customerEmail);
            const querySnapshot = await q.get();

            if (querySnapshot.empty) {
                console.warn(`User with email ${customerEmail} not found. Purchase cannot be assigned.`);
                return NextResponse.json({ success: true, message: `User with email ${customerEmail} not found.` });
            }

            for (const userDoc of querySnapshot.docs) {
                const userDocRef = db.collection('users').doc(userDoc.id);
                const userData = userDoc.data();
                
                const updates: { [key: string]: string } = {};
                updates[`progress.${moduleId}.status`] = 'active';

                if (moduleId === 'grafismo-fonetico' && userData.progress?.[moduleId]?.submodules) {
                    const submodules = userData.progress[moduleId].submodules;
                    const firstSubmoduleId = Object.keys(submodules).find(key => key === 'intro') || Object.keys(submodules)[0];
                    if (firstSubmoduleId && submodules[firstSubmoduleId]?.status === 'locked') {
                       updates[`progress.${moduleId}.submodules.${firstSubmoduleId}.status`] = 'active';
                    }
                }
                
                await userDocRef.update(updates);
                console.log(`Module '${moduleId}' unlocked successfully for user ${userDoc.id} (${customerEmail}).`);
            }
            // --- End of Unlock Logic ---

            return NextResponse.json({ success: true, message: `Module ${moduleId} unlocked for ${customerEmail}.` });
        }

        return NextResponse.json({ success: true, message: 'Webhook received, but no action taken for status: ' + payload.order_status });

    } catch (error: any) {
        if (error.message.includes('signature')) {
            return NextResponse.json({ success: false, message: error.message }, { status: 401 });
        }
        console.error('Error processing Kiwify webhook:', error);
        return NextResponse.json({ success: false, message: 'An error occurred.' }, { status: 500 });
    }
}
