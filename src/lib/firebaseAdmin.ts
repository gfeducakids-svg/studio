import "server-only"
import { initializeApp, getApps, cert, type ServiceAccount } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

function getPrivateKey(): string {
  const raw = process.env.FIREBASE_PRIVATE_KEY
  if (!raw) throw new Error("FIREBASE_PRIVATE_KEY missing")
  // suporta chave com \n escapados no Vercel
  return raw.replace(/\\n/g, "\n")
}

if (!getApps().length) {
  const sa: ServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: getPrivateKey(),
  }
  initializeApp({ credential: cert(sa) })
}

export const adminAuth = getAuth()
export const adminDb = getFirestore()
