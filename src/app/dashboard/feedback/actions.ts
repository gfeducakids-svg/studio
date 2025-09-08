
'use server';

import { db } from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';
import { FieldValue } from 'firebase-admin/firestore';

interface SubmitFeedbackArgs {
    text: string;
    userId: string;
    userName: string;
    userAvatar: string; // Placeholder for now
}

export async function submitFeedback({ text, userId, userName, userAvatar }: SubmitFeedbackArgs): Promise<{ success: boolean; message?: string }> {
    if (!text || !userId || !userName) {
        return { success: false, message: 'Dados inválidos fornecidos.' };
    }

    try {
        await db.collection('feedback').add({
            text,
            userId,
            userName,
            userAvatar,
            createdAt: FieldValue.serverTimestamp(),
        });
        
        // Revalida a página de feedback para que a lista seja atualizada
        revalidatePath('/dashboard/feedback');

        return { success: true };
    } catch (error: any) {
        console.error('Erro ao salvar o feedback:', error);
        return { success: false, message: 'Ocorreu um erro no servidor ao tentar salvar o comentário.' };
    }
}
