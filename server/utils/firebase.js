import { cert, initializeApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert({
        projectId: credentials.project_id,
        clientEmail: credentials.client_email,
        privateKey: credentials.private_key,
      }),
    });

export const authAdmin = getAuth(app);
export const firestoreAdmin = getFirestore(app);
