
'use server';

import { adminAuth, adminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

const initialProgress = {
    'grafismo-fonetico': { status: 'locked', submodules: { 'intro': { status: 'locked' } } },
    'desafio-21-dias': { status: 'locked', submodules: {} },
    'checklist-alfabetizacao': { status: 'locked', submodules: {} },
    'historias-curtas': { status: 'locked', submodules: {} },
};

// Esta função roda apenas no servidor, garantindo a segurança.
export async function simulateWebhook(formData: FormData) {
    const customerEmail = (formData.get('email') as string).toLowerCase();
    const customerName = formData.get('name') as string;
    const moduleId = formData.get('moduleId') as string;

    if (!customerEmail || !customerName || !moduleId) {
        return { success: false, message: 'Todos os campos são obrigatórios.' };
    }

    try {
        let userRecord;
        try {
            userRecord = await adminAuth.getUserByEmail(customerEmail);
        } catch (error: any) {
            if (error.code === 'auth/user-not-found') {
                // Cenário 1: Usuário NÃO existe - Salva a compra como pendente
                const pendingDocRef = adminDb.collection('pending_purchases').doc(customerEmail);
                await pendingDocRef.set({
                    email: customerEmail,
                    modules: FieldValue.arrayUnion(moduleId)
                }, { merge: true });
                
                return { success: true, message: `Usuário não encontrado. Compra pendente do módulo '${moduleId}' salva para ${customerEmail}.` };
            }
            throw error;
        }

        // Cenário 2: Usuário JÁ EXISTE - Libera o acesso diretamente
        const userDocRef = adminDb.collection('users').doc(userRecord.uid);
        const userDoc = await userDocRef.get();

        const updates: { [key: string]: any } = {
            [`progress.${moduleId}.status`]: 'active',
        };

        if (moduleId === 'grafismo-fonetico') {
            updates[`progress.grafismo-fonetico.submodules.intro.status`] = 'active';
        }

        if (!userDoc.exists) {
            // Caso de borda: usuário na Auth mas não no Firestore.
            await userDocRef.set({
               name: customerName,
               email: customerEmail,
               progress: initialProgress,
            });
        }
        
        await userDocRef.update(updates);
        return { success: true, message: `Módulo '${moduleId}' liberado com sucesso para o usuário existente ${customerEmail}.` };

    } catch (error: any) {
        console.error("Erro ao simular o webhook:", error);
        return { success: false, message: `Erro do servidor: ${error.message}` };
    }
}
