import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  projectId: "pinyin-mastery",
  appId: "1:645262438081:web:b71adaca3b8bd38cfbee40",
  storageBucket: "pinyin-mastery.firebasestorage.app",
  apiKey: "AIzaSyASTgDrERdW9PdjbyD0egq8jc9leCCgw8o",
  authDomain: "pinyin-mastery.firebaseapp.com",
  messagingSenderId: "645262438081"
};

// Inicialize o Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
