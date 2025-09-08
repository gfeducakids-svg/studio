'use server';

import { createUserWithEmailAndPassword, deleteUser, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getInitialProgress } from "@/lib/course-data";
import { auth, db } from "@/lib/firebase";

type SignUpInput = {
  email: string;
  password: string;
  name: string;
};

// Ação de servidor para registrar um usuário com um perfil no Firestore.
// Inclui um mecanismo de rollback para deletar o usuário do Auth se a escrita no Firestore falhar.
export async function signUpWithProfile({ email, password, name }: SignUpInput) {
  let userCredential;
  
  // Passo 1: Criar o usuário no Firebase Authentication
  try {
    userCredential = await createUserWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    // Mapeia erros comuns do Firebase Auth para mensagens claras
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Este e-mail já está cadastrado. Tente fazer login.');
    }
    if (error.code === 'auth/weak-password') {
      throw new Error('A senha é muito fraca. Use pelo menos 6 caracteres.');
    }
    console.error("Auth creation error:", error);
    throw new Error('Não foi possível criar sua conta. Verifique os dados e tente novamente.');
  }

  const user = userCredential.user;

  // Passo 2: Tentar criar o documento de perfil no Firestore
  try {
    // Atualiza o 'displayName' no perfil do Auth
    await updateProfile(user, { displayName: name });

    const userDocRef = doc(db, "users", user.uid);
    
    // Usa setDoc para criar o documento. merge: true é uma segurança extra.
    await setDoc(userDocRef, {
      name: name,
      email: email.toLowerCase(),
      progress: getInitialProgress(),
    }, { merge: true });

    // Se tudo deu certo, retorna sucesso.
    return { success: true, uid: user.uid };

  } catch (dbError) {
    // Passo 3: Rollback - A escrita no Firestore falhou, então deletamos o usuário do Auth.
    console.error("Firestore write error, rolling back Auth user:", dbError);
    try {
      await deleteUser(user);
    } catch (deleteError) {
      // Se a deleção falhar, o usuário fica "órfão". Logamos isso para intervenção manual.
      console.error("CRITICAL: Failed to rollback Auth user.", deleteError);
    }
    
    // Lança um erro claro para o cliente.
    throw new Error('Falha ao salvar seu perfil. A criação da conta foi cancelada. Tente novamente.');
  }
}
