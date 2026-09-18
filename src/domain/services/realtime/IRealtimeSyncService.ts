// domain/services/realtime/IRealtimeSyncService.ts
// Interface for real-time Firestore collection and document synchronization.
// Pure TypeScript domain contract with zero UI framework dependencies.

export interface RealtimeSubscriptionOptions {
  readonly orderByField?: string;
  readonly orderDirection?: "asc" | "desc";
  readonly limitCount?: number;
}

export interface IRealtimeSyncService {
  /**
   * Subscribes to real-time updates for a given Firestore collection.
   * Returns an unsubscribe function to terminate the listener.
   */
  subscribeCollection<T>(
    collectionName: string,
    onUpdate: (items: T[]) => void,
    onError?: (error: Error) => void,
    options?: RealtimeSubscriptionOptions
  ): () => void;

  /**
   * Subscribes to real-time updates for a single Firestore document.
   * Returns an unsubscribe function to terminate the listener.
   */
  subscribeDocument<T>(
    collectionName: string,
    docId: string,
    onUpdate: (data: T | null) => void,
    onError?: (error: Error) => void
  ): () => void;
}
