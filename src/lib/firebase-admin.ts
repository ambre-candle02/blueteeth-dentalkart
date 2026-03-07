import { initializeApp, getApps, cert, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { serviceAccount } from './firebase-service-account';

export function getAdminApp() {
    if (getApps().length === 0) {
        const projectId = process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || serviceAccount.client_email;
        const privateKeyStr = process.env.FIREBASE_PRIVATE_KEY || serviceAccount.private_key;

        console.log("Initializing Firebase Admin with Email:", clientEmail);

        try {
            return initializeApp({
                credential: cert({
                    projectId: projectId,
                    clientEmail: clientEmail,
                    privateKey: privateKeyStr.replace(/\\n/g, '\n'),
                }),
            });
        } catch (error) {
            console.error("Firebase Admin initialization error:", error);
            throw error;
        }
    }
    const app = getApp();
    console.log("Using existing Firebase App:", app.options.projectId);
    return app;
}

// Lazy load db/auth to avoid top-level initialization errors
let firestoreInstance: any;
let authInstance: any;

const getDb = () => {
    if (!firestoreInstance) {
        firestoreInstance = getFirestore(getAdminApp());
    }
    return firestoreInstance;
};

const getAuthService = () => {
    if (!authInstance) {
        authInstance = getAuth(getAdminApp());
    }
    return authInstance;
};

export const db = {
    get collection() { return getDb().collection.bind(getDb()); },
    get batch() { return getDb().batch.bind(getDb()); },
    get doc() { return getDb().doc.bind(getDb()); }
} as unknown as ReturnType<typeof getFirestore>;

export const auth = {
    get createUser() { return getAuthService().createUser.bind(getAuthService()); },
    get getUser() { return getAuthService().getUser.bind(getAuthService()); }
} as unknown as ReturnType<typeof getAuth>;
