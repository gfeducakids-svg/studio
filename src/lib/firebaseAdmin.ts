
import "server-only"
import admin, { initializeApp, getApps, cert, type ServiceAccount } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

/**
 * Analisa a chave privada do Firebase, tratando quebras de linha escapadas.
 * @returns A chave privada formatada corretamente.
 */
function getPrivateKey(): string {
  const raw = process.env.FIREBASE_PRIVATE_KEY
  if (!raw) {
      // Se a chave completa estiver na nova variável, usamos essa.
      if(process.env.FIREBASE_SERVICE_ACCOUNT) {
          try {
              const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
              return sa.private_key;
          } catch(e) {
               throw new Error("FIREBASE_SERVICE_ACCOUNT é um JSON inválido.")
          }
      }
      throw new Error("Nenhuma variável de ambiente de chave privada do Firebase (FIREBASE_PRIVATE_KEY ou FIREBASE_SERVICE_ACCOUNT) foi definida.")
  }
  // Suporta a chave com quebras de linha escapadas (comum em Vercel)
  return raw.replace(/\\n/g, "\n")
}


/**
 * Obtém as credenciais da Service Account a partir de variáveis de ambiente individuais
 * ou da variável de ambiente `FIREBASE_SERVICE_ACCOUNT` que contém o JSON completo.
 * @returns O objeto da Service Account.
 */
function getServiceAccount(): ServiceAccount {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        try {
            return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        } catch (e) {
            console.error("FIREBASE_SERVICE_ACCOUNT contém um JSON inválido.");
            throw new Error("FIREBASE_SERVICE_ACCOUNT contém um JSON inválido.");
        }
    }
    // Fallback para variáveis individuais se a principal não estiver definida
    return {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: getPrivateKey(),
    };
}

// Inicializa o app admin apenas uma vez (padrão singleton)
function initializeAdminApp() {
    if (!getApps().length) {
        try {
            const serviceAccount = getServiceAccount();
            initializeApp({ credential: cert(serviceAccount) });
            console.log("Firebase Admin SDK initialized successfully.");
        } catch (e: any) {
            console.error("Firebase Admin SDK initialization error", e);
            throw new Error("Failed to initialize Firebase Admin SDK: " + e.message);
        }
    }
    return admin.app();
}

initializeAdminApp();

export const adminAuth = getAuth();
export const db = getFirestore();
