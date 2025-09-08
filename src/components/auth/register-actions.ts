
'use server';

import { adminAuth, db } from "@/lib/firebaseAdmin";
import { getInitialProgress } from "@/lib/course-data";
import type { UserRecord } from "firebase-admin/auth";

type SignUpInput = {
  email: string;
  password: string;
  name: string;
};

// Ação de servidor para registrar um usuário com um perfil no Firestore.
// Inclui um mecanismo de rollback para deletar o usuário do Auth se a escrita no Firestore falhar.
export async function signUpWithProfile({ email, password, name }: SignUpInput) {
  let userRecord: UserRecord;
  
  // Passo 1: Criar o usuário no Firebase Authentication via Admin SDK
  try {
    userRecord = await adminAuth.createUser({
        email: email,
        password: password,
        displayName: name,
    });
  } catch (error: any) {
    // Mapeia erros comuns do Firebase Auth para mensagens claras
    if (error.code === 'auth/email-already-exists') {
      throw new Error('Este e-mail já está cadastrado. Tente fazer login.');
    }
    if (error.code === 'auth/weak-password') {
      throw new Error('A senha é muito fraca. Use pelo menos 6 caracteres.');
    }
    console.error("Admin Auth creation error:", error);
    throw new Error('Não foi possível criar sua conta. Verifique os dados e tente novamente.');
  }

  // Passo 2: Tentar criar o documento de perfil no Firestore
  try {
    const userDocRef = db.collection("users").doc(userRecord.uid);
    
    // Usa set para criar o documento.
    await userDocRef.set({
      name: name,
      email: email.toLowerCase(),
      progress: getInitialProgress(),
    });

    // Se tudo deu certo, retorna sucesso.
    return { success: true, uid: userRecord.uid };

  } catch (dbError) {
    // Passo 3: Rollback - A escrita no Firestore falhou, então deletamos o usuário do Auth.
    console.error("Firestore write error, rolling back Auth user:", dbError);
    try {
      await adminAuth.deleteUser(userRecord.uid);
    } catch (deleteError) {
      // Se a deleção falhar, o usuário fica "órfão". Logamos isso para intervenção manual.
      console.error("CRITICAL: Failed to rollback Auth user.", deleteError);
    }
    
    // Lança um erro claro para o cliente.
    throw new Error('Falha ao salvar seu perfil. A criação da conta foi cancelada. Tente novamente.');
  }
}
