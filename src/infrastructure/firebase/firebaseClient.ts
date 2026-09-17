import { getApp, getApps, initializeApp } from "firebase/app";
import {
  type Firestore,
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { env } from "../system/env";

const firebaseConfig = {
  apiKey: env.firebase.apiKey,
  authDomain: env.firebase.authDomain,
  projectId: env.firebase.projectId,
  storageBucket: env.firebase.storageBucket,
  messagingSenderId: env.firebase.messagingSenderId,
  appId: env.firebase.appId,
  measurementId: env.firebase.measurementId,
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

/**
 * Initialize Firestore with multi-tab persistent IndexedDB caching.
 * Dramatically reduces Firebase reads by serving repeated queries from local disk/IndexedDB cache.
 * Falls back to standard getFirestore in environments where IndexedDB is unavailable (e.g. Node.js scripts).
 */
let firestoreInstance: Firestore;
const isIndexedDbSupported =
  typeof window !== "undefined" && typeof window.indexedDB !== "undefined";

if (isIndexedDbSupported) {
  try {
    firestoreInstance = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
  } catch {
    firestoreInstance = getFirestore(app);
  }
} else {
  firestoreInstance = getFirestore(app);
}

export const db: Firestore = firestoreInstance;
