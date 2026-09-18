// infrastructure/repositories/telemetry/FirestoreTelemetryRepository.ts
// Concrete Firestore implementation of ITelemetryRepository.
// Persists and retrieves FinOps curves and infrastructure telemetry configurations.

import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import type { ITelemetryRepository } from "../../../domain/repositories/telemetry/ITelemetryRepository";
import { getDb } from "../../firebase/firebaseClient";

const COLLECTION = "telemetryMetrics";
const DOC_ID = "global";

export class FirestoreTelemetryRepository implements ITelemetryRepository {
  async saveFinOpsMetrics(data: Record<string, unknown>): Promise<void> {
    const db = getDb();
    const docRef = doc(db, COLLECTION, DOC_ID);

    await setDoc(
      docRef,
      {
        ...data,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  }

  async getFinOpsMetrics(): Promise<Record<string, unknown> | null> {
    const db = getDb();
    const docRef = doc(db, COLLECTION, DOC_ID);
    const snap = await getDoc(docRef);

    return snap.exists() ? (snap.data() as Record<string, unknown>) : null;
  }

  subscribeFinOpsMetrics(callback: (data: Record<string, unknown> | null) => void): () => void {
    const db = getDb();
    const docRef = doc(db, COLLECTION, DOC_ID);

    return onSnapshot(
      docRef,
      (snap) => {
        callback(snap.exists() ? (snap.data() as Record<string, unknown>) : null);
      },
      (error) => {
        console.warn("[FirestoreTelemetryRepository] subscribeFinOpsMetrics warning:", error);
        callback(null);
      }
    );
  }
}
