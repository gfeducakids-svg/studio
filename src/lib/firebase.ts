
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions, httpsCallable } from "firebase/functions";

// A configuração do Firebase agora usa consistentemente as variáveis de ambiente
// públicas (prefixadas com NEXT_PUBLIC_). Isso garante que as chaves estejam
// disponíveis tanto no cliente quanto no ambiente de servidor do Next.js (como em
// API Routes e Server Components), resolvendo erros de build na Vercel.
// A segurança é garantida pelas Regras de Segurança do Firestore, não pela
// ocultação dessas chaves de configuração.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicialize o Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Inicializa o Firebase Functions
const functions = getFunctions(app, 'us-central1');

// Cria uma referência para a Cloud Function callable
const applyPendingPurchases = httpsCallable(functions, 'applyPendingPurchases');

export { app, auth, db, storage, functions, applyPendingPurchases };
