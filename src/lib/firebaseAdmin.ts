
import "server-only"
import { initializeApp, getApps, cert, type ServiceAccount } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

function getPrivateKey(): string {
  const raw = process.env.FIREBASE_PRIVATE_KEY
  if (!raw) throw new Error("FIREBASE_PRIVATE_KEY environment variable not set.")
  // Suporta a chave com quebras de linha escapadas (comum em Vercel)
  return raw.replace(/\\n/g, "\n")
}

// Inicializa o app admin apenas uma vez (padrão singleton)
if (!getApps().length) {
  try {
    const serviceAccount: ServiceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: getPrivateKey(),
    }
    initializeApp({ credential: cert(serviceAccount) });
    console.log("Firebase Admin SDK initialized successfully.");
  } catch (e: any) {
    console.error("Firebase Admin SDK initialization error", e.stack);
  }
}

export const adminAuth = getAuth();
export const db = getFirestore();
