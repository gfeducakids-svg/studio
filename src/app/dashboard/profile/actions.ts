'use server';

import { db } from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';

interface UpdateProfileArgs {
    uid: string;
    newName: string;
}

export async function updateUserProfile({ uid, newName }: UpdateProfileArgs): Promise<{ success: boolean; message?: string }> {
    if (!uid || !newName || newName.length < 2) {
        return { success: false, message: 'Dados inválidos fornecidos.' };
    }

    try {
        const userDocRef = db.collection('users').doc(uid);
        await userDocRef.update({ name: newName });
        
        // Revalida o layout do dashboard para que o user-nav busque os novos dados
        revalidatePath('/dashboard', 'layout');

        return { success: true };
    } catch (error) {
        console.error('Erro ao atualizar o perfil do usuário:', error);
        return { success: false, message: 'Ocorreu um erro no servidor ao tentar atualizar o nome.' };
    }
}
