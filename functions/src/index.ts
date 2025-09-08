import {initializeApp} from "firebase-admin/app";
import {getFirestore, FieldPath} from "firebase-admin/firestore";
import {getAuth} from "firebase-admin/auth";
import {https, HttpsError} from "firebase-functions/v2";

// Inicializa o app Firebase Admin
initializeApp();
const db = getFirestore();
const auth = getAuth();

/**
 * Normaliza um endereço de e-mail para consulta, especialmente para o Gmail.
 * - Converte para minúsculas.
 * - Remove pontos (.) do nome do usuário.
 * - Remove a parte do alias (+...) do nome do usuário.
 * @param {string} email O e-mail a ser normalizado.
 * @return {string} O e-mail normalizado.
 */
function normalizeGmail(email: string): string {
  const lowerCaseEmail = email.toLowerCase().trim();
  const emailParts = lowerCaseEmail.split("@");

  if (emailParts.length !== 2 || emailParts[1] !== "gmail.com") {
    return lowerCaseEmail;
  }

  const username = emailParts[0].split("+")[0].replace(/\./g, "");
  return `${username}@gmail.com`;
}


export const applyPendingPurchases = https.onCall(
  {region: "us-central1"},
  async (request) => {
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "O usuário precisa estar autenticado para chamar esta função.",
      );
    }

    const uid = request.auth.uid;
    let userEmail: string;

    try {
      const userRecord = await auth.getUser(uid);
      if (!userRecord.email) {
        throw new HttpsError(
          "failed-precondition",
          "O usuário autenticado não possui um e-mail.",
        );
      }
      userEmail = userRecord.email;
    } catch (error) {
      console.error(`Erro ao buscar o usuário ${uid}:`, error);
      throw new HttpsError("internal", "Não foi possível buscar os dados do usuário.");
    }

    const normalizedEmail = normalizeGmail(userEmail);
    const pendingDocRef = db.collection("pending_purchases").doc(normalizedEmail);
    const userDocRef = db.collection("users").doc(uid);

    try {
      const pendingDoc = await pendingDocRef.get();

      if (!pendingDoc.exists) {
        return {ok: true, applied: false};
      }

      const pendingData = pendingDoc.data();
      const modulesToUnlock: string[] = pendingData?.modules || [];

      if (modulesToUnlock.length === 0) {
        // Limpa o documento pendente se estiver vazio
        await pendingDocRef.delete();
        return {ok: true, applied: false, reason: "No modules to unlock"};
      }

      await db.runTransaction(async (transaction) => {
        // Lê o documento do usuário dentro da transação para consistência
        const userDoc = await transaction.get(userDocRef);

        if (!userDoc.exists) {
          // Se o documento do usuário não existe, a transação falhará.
          // O cliente deve garantir a criação do doc antes de chamar a função.
          throw new Error(`Documento do usuário ${uid} não encontrado.`);
        }

        const updates: {[key: string]: string} = {};
        modulesToUnlock.forEach((moduleId) => {
          // Usa FieldPath para segurança e clareza
          const field = new FieldPath("progress", moduleId, "status");
          transaction.update(userDocRef, field, "unlocked");

          // Regra especial para o primeiro submódulo do grafismo
          if (moduleId === "grafismo-fonetico") {
            const introField = new FieldPath(
              "progress",
              moduleId,
              "submodules",
              "intro",
              "status",
            );
            transaction.update(userDocRef, introField, "unlocked");
          }
        });

        // Apaga o documento de compras pendentes na mesma transação
        transaction.delete(pendingDocRef);
      });

      return {ok: true, applied: true, modules: modulesToUnlock};
    } catch (error) {
      console.error(
        `Falha na transação para o usuário ${uid} (email: ${userEmail}):`,
        error,
      );
      throw new HttpsError(
        "internal",
        "Erro ao aplicar compras pendentes. Por favor, tente novamente.",
        error,
      );
    }
  },
);
