// infrastructure/services/realtime/FirestoreRealtimeSyncService.ts
// Realtime Firestore synchronization service wrapping onSnapshot.
// Uses multi-tab IndexedDB cache for zero duplicate network overhead.

import { collection, doc, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import type {
  IRealtimeSyncService,
  RealtimeSubscriptionOptions,
} from "../../../domain/services/realtime/IRealtimeSyncService";
import { getDb } from "../../firebase/firebaseClient";

export class FirestoreRealtimeSyncService implements IRealtimeSyncService {
  subscribeCollection<T>(
    collectionName: string,
    onUpdate: (items: T[]) => void,
    onError?: (error: Error) => void,
    options?: RealtimeSubscriptionOptions
  ): () => void {
    const db = getDb();
    const colRef = collection(db, collectionName);

    const queryConstraints = [];
    if (options?.orderByField) {
      queryConstraints.push(orderBy(options.orderByField, options.orderDirection || "asc"));
    }
    if (options?.limitCount && options.limitCount > 0) {
      queryConstraints.push(limit(options.limitCount));
    }

    const targetQuery = queryConstraints.length > 0 ? query(colRef, ...queryConstraints) : colRef;

    return onSnapshot(
      targetQuery,
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
        onUpdate(items);
      },
      (error) => {
        if (onError) onError(error);
      }
    );
  }

  subscribeDocument<T>(
    collectionName: string,
    docId: string,
    onUpdate: (data: T | null) => void,
    onError?: (error: Error) => void
  ): () => void {
    const db = getDb();
    const docRef = doc(db, collectionName, docId);

    return onSnapshot(
      docRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          onUpdate(null);
          return;
        }
        onUpdate({ id: snapshot.id, ...snapshot.data() } as T);
      },
      (error) => {
        if (onError) onError(error);
      }
    );
  }
}
