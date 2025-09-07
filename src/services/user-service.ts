
'use server'

import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

/**
 * Encontra um usuário pelo e-mail e desbloqueia um módulo específico para ele.
 * O status do módulo principal é definido como 'active'.
 * O primeiro submódulo do 'grafismo-fonetico' (se houver) também é definido como 'active'.
 * @param email - O e-mail do usuário.
 * @param moduleId - O ID do módulo a ser desbloqueado.
 */
export async function unlockModuleForUserByEmail(email: string, moduleId: string): Promise<void> {
  // Importa o db dinamicamente para evitar problemas de build
  const { db } = await import('@/lib/firebase');

  if (!email || !moduleId) {
    throw new Error('Email and module ID are required.');
  }

  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('email', '==', email));

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    console.warn(`User with email ${email} not found. Purchase cannot be assigned.`);
    // Não lançamos um erro para não fazer a Kiwify reenviar o webhook.
    // Simplesmente registramos que o usuário não foi encontrado.
    return;
  }

  // Normalmente haverá apenas um, mas o snapshot retorna uma lista.
  for (const userDoc of querySnapshot.docs) {
    const userDocRef = doc(db, 'users', userDoc.id);
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
      await updateDoc(userDocRef, updates);
      console.log(`Module '${moduleId}' unlocked successfully for user ${userDoc.id} (${email}).`);
    } catch (error) {
      console.error(`Failed to unlock module for user ${email}:`, error);
      // Lança o erro para que possa ser tratado pelo chamador.
      throw new Error('Failed to update user progress.');
    }
  }
}
