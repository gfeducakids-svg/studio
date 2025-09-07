
'use server'

import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Função para garantir que o Firebase Admin seja inicializado apenas uma vez.
const initializeAdmin = () => {
    if (admin.apps.length === 0) {
        // A chave privada precisa de um tratamento especial para substituir `\\n` por `\n`
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

        if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
            console.error("Firebase Admin environment variables are not set.");
            // Lança um erro para interromper a execução se as variáveis não estiverem definidas.
            throw new Error("Server configuration error: Firebase Admin environment variables are not set.");
        }

        try {
             admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: privateKey,
                }),
            });
             console.log("Firebase Admin SDK initialized successfully.");
        } catch (error) {
            console.error("Firebase Admin initialization error:", error);
            // Lança o erro para que o problema de inicialização seja visível.
            throw new Error("Failed to initialize Firebase Admin SDK.");
        }
    }
    return getFirestore();
};


/**
 * Encontra um usuário pelo e-mail e desbloqueia um módulo específico para ele.
 * O status do módulo principal é definido como 'active'.
 * O primeiro submódulo do 'grafismo-fonetico' (se houver) também é definido como 'active'.
 * @param email - O e-mail do usuário.
 * @param moduleId - O ID do módulo a ser desbloqueado.
 */
export async function unlockModuleForUserByEmail(email: string, moduleId: string): Promise<void> {
  if (!email || !moduleId) {
    throw new Error('Email and module ID are required.');
  }

  // Garante que o SDK admin esteja inicializado e obtém a instância do DB.
  const db = initializeAdmin();

  const usersRef = db.collection('users');
  const q = usersRef.where('email', '==', email);

  const querySnapshot = await q.get();

  if (querySnapshot.empty) {
    console.warn(`User with email ${email} not found. Purchase cannot be assigned.`);
    // Não lançamos um erro para não fazer a Kiwify reenviar o webhook.
    // Simplesmente registramos que o usuário não foi encontrado.
    return;
  }

  // Normalmente haverá apenas um, mas o snapshot retorna uma lista.
  for (const userDoc of querySnapshot.docs) {
    const userDocRef = db.collection('users').doc(userDoc.id);
    const userData = userDoc.data();
    
    const updates: { [key: string]: string } = {};
    updates[`progress.${moduleId}.status`] = 'active';

    // Se for o módulo de grafismo e houver submódulos, ativa o primeiro.
    if (moduleId === 'grafismo-fonetico' && userData.progress?.[moduleId]?.submodules) {
        const submodules = userData.progress[moduleId].submodules;
        // Encontra o primeiro submódulo (geralmente 'intro')
        const firstSubmoduleId = Object.keys(submodules).find(key => key === 'intro') || Object.keys(submodules)[0];
        if (firstSubmoduleId) {
            // Apenas ativa o primeiro submódulo se ele estiver 'locked'
            if (submodules[firstSubmoduleId]?.status === 'locked') {
               updates[`progress.${moduleId}.submodules.${firstSubmoduleId}.status`] = 'active';
            }
        }
    }

    try {
      await userDocRef.update(updates);
      console.log(`Module '${moduleId}' unlocked successfully for user ${userDoc.id} (${email}).`);
    } catch (error) {
      console.error(`Failed to unlock module for user ${email}:`, error);
      // Lança o erro para que possa ser tratado pelo chamador.
      throw new Error('Failed to update user progress.');
    }
  }
}
