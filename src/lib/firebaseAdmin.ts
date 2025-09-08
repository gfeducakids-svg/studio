
import "server-only"
import { initializeApp, getApps, cert, type App, getApp } from "firebase-admin/app"
import { getAuth, type Auth } from "firebase-admin/auth"
import { getFirestore, type Firestore } from "firebase-admin/firestore"

interface FirebaseAdminSDK {
    app: App;
    auth: Auth;
    db: Firestore;
}

// Padrão Singleton para garantir uma única inicialização
let adminSDKInstance: FirebaseAdminSDK | null = null;

function initializeAdminSDK(): FirebaseAdminSDK {
    if (adminSDKInstance) {
        return adminSDKInstance;
    }

    if (getApps().length > 0) {
        const defaultApp = getApp(); // CORREÇÃO: Usar getApp() em vez de admin.app()
        adminSDKInstance = {
            app: defaultApp,
            auth: getAuth(defaultApp),
            db: getFirestore(defaultApp),
        };
        return adminSDKInstance;
    }

    try {
        const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT;
        if (!serviceAccountRaw) {
            throw new Error("A variável de ambiente FIREBASE_SERVICE_ACCOUNT não está definida.");
        }
        
        const serviceAccount = JSON.parse(serviceAccountRaw);
        
        const newApp = initializeApp({
            credential: cert(serviceAccount),
        });
        
        console.log("Firebase Admin SDK inicializado com sucesso.");
        
        adminSDKInstance = {
            app: newApp,
            auth: getAuth(newApp),
            db: getFirestore(newApp),
        };
        return adminSDKInstance;

    } catch (e: any) {
        console.error("Falha na inicialização do Firebase Admin SDK:", e.message);
        // Lança o erro para que a Server Action possa capturá-lo e reportá-lo.
        throw new Error(`Falha ao inicializar o Firebase Admin SDK: ${e.message}`);
    }
}

// Inicializa e exporta as instâncias
const { auth: adminAuth, db } = initializeAdminSDK();

export { adminAuth, db };
