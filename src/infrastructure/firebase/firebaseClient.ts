import { type FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import {
  type Firestore,
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { getEnv } from "../system/env";

let appInstance: FirebaseApp | null = null;
let firestoreInstance: Firestore | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (!appInstance) {
    if (getApps().length > 0) {
      appInstance = getApp();
    } else {
      const currentEnv = getEnv();
      const firebaseConfig = {
        apiKey: currentEnv.firebase.apiKey,
        authDomain: currentEnv.firebase.authDomain,
        projectId: currentEnv.firebase.projectId,
        storageBucket: currentEnv.firebase.storageBucket,
        messagingSenderId: currentEnv.firebase.messagingSenderId,
        appId: currentEnv.firebase.appId,
        measurementId: currentEnv.firebase.measurementId,
      };
      appInstance = initializeApp(firebaseConfig);
    }
  }
  return appInstance;
}

/**
 * Initialize Firestore with multi-tab persistent IndexedDB caching.
 * Dramatically reduces Firebase reads by serving repeated queries from local disk/IndexedDB cache.
 * Falls back to standard getFirestore in environments where IndexedDB is unavailable (e.g. Node.js scripts).
 */
export function getDb(): Firestore {
  if (!firestoreInstance) {
    const firebaseApp = getFirebaseApp();
    const isIndexedDbSupported =
      typeof window !== "undefined" && typeof window.indexedDB !== "undefined";

    if (isIndexedDbSupported) {
      try {
        firestoreInstance = initializeFirestore(firebaseApp, {
          localCache: persistentLocalCache({
            tabManager: persistentMultipleTabManager(),
          }),
        });
      } catch {
        firestoreInstance = getFirestore(firebaseApp);
      }
    } else {
      firestoreInstance = getFirestore(firebaseApp);
    }
  }
  return firestoreInstance;
}

// Direct db instance for Node.js scripts and CLI utilities
export const db: Firestore =
  typeof window === "undefined" ? getDb() : (null as unknown as Firestore);

export const app: FirebaseApp =
  typeof window === "undefined" ? getFirebaseApp() : (null as unknown as FirebaseApp);
