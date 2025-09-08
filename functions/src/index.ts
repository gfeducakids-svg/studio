// NOTA: Este arquivo pertence às Cloud Functions e não deve ser incluído no processo de build do Next.js.
// Certifique-se de que o diretório 'functions' está no 'exclude' do tsconfig.json principal.

import * as functions from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldPath } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// Inicializa o Firebase Admin SDK.
initializeApp();
const db = getFirestore();
const auth = getAuth();

/**
 * Normaliza um endereço de e-mail para consulta, especialmente para Gmail.
 * Converte para minúsculas, remove alias (+...) e pontos (.) do nome de usuário.
 * @param {string} email O e-mail a ser normalizado.
 * @return {string} O e-mail normalizado.
 */
function normalizeEmail(email: string): string {
  let e = (email || "").trim().toLowerCase();
  const [local, domain] = e.split("@");
  if (!local || !domain) return e;

  if (domain === "gmail.com" || domain === "googlemail.com") {
    const noPlus = local.split("+")[0];
    const noDots = noPlus.replace(/\./g, "");
    e = `${noDots}@gmail.com`;
  } else {
    e = `${local}@${domain}`;
  }
  return e;
}


exports.applyPendingPurchases = functions.https.onCall(async (data, context) => {
  // 1. Validação de Autenticação
  if (!context.auth?.uid) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "A função precisa ser chamada por um usuário autenticado."
    );
  }
  const uid = context.auth.uid;
  functions.logger.info(`Iniciando applyPendingPurchases para UID: ${uid}`);

  try {
    // 2. Obter e-mail real do usuário e normalizá-lo
    const userRecord = await auth.getUser(uid);
    const email = userRecord.email;
    if (!email) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "O usuário autenticado não possui um endereço de e-mail."
      );
    }
    const emailNorm = normalizeEmail(email);
    functions.logger.info(`UID: ${uid}, Email normalizado: ${emailNorm}`);

    // 3. Referências aos documentos do Firestore
    const pendingRef = db.collection("pending_purchases").doc(emailNorm);
    const userRef = db.collection("users").doc(uid);

    // 4. Executar a lógica de forma transacional e idempotente
    await db.runTransaction(async (tx) => {
      const pendingDoc = await tx.get(pendingRef);

      if (!pendingDoc.exists) {
        functions.logger.info(`Nenhuma compra pendente encontrada para ${emailNorm}.`);
        // Não é necessário retornar explicitamente aqui, a transação apenas será concluída.
        return;
      }

      functions.logger.info(`Compra pendente encontrada para ${emailNorm}.`, pendingDoc.data());
      
      const pendingData = pendingDoc.data() || {};
      // Sanear os módulos para garantir que é um array de strings
      const modules: string[] = (pendingData.modules || []).map(String).filter(Boolean);

      if (modules.length === 0) {
        functions.logger.warn(`Documento pendente para ${emailNorm} existe, mas não contém módulos válidos. Removendo...`);
        tx.delete(pendingRef);
        return;
      }
      
      const userDoc = await tx.get(userRef);
      if (!userDoc.exists) {
        // Se o documento do usuário não existe, cria um com a estrutura básica.
        // A lógica de progresso inicial detalhada fica no lado do cliente no registro.
        functions.logger.info(`Documento para UID ${uid} não existe. Criando um novo.`);
        tx.set(userRef, { email, progress: {} }, { merge: true });
      }

      // Aplica o desbloqueio para cada módulo pendente
      modules.forEach(moduleId => {
        functions.logger.info(`Desbloqueando módulo '${moduleId}' para UID: ${uid}`);
        // Usa FieldPath para segurança e para lidar com nomes de campos que contêm caracteres especiais.
        const field = new FieldPath("progress", moduleId, "status");
        tx.update(userRef, field, "unlocked");

        // Regra especial para o primeiro submódulo do grafismo
        if (moduleId === 'grafismo-fonetico') {
            const introField = new FieldPath("progress", moduleId, "submodules", "intro", "status");
            tx.update(userRef, introField, "unlocked");
        }
      });

      // Remove o documento de compras pendentes para que não seja processado novamente
      functions.logger.info(`Removendo documento pendente para ${emailNorm}.`);
      tx.delete(pendingRef);
    });

    return { ok: true, applied: true, modules };

  } catch (err) {
    functions.logger.error(`Erro em applyPendingPurchases para UID: ${uid}`, err);
    throw new functions.https.HttpsError(
      "internal",
      "Ocorreu um erro ao tentar aplicar suas compras pendentes."
    );
  }
});
