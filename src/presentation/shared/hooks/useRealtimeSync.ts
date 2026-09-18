// presentation/shared/hooks/useRealtimeSync.ts
// Reusable hook for real-time Firestore synchronization via DI container.
// Provides instant reactivity across browser tabs with multi-tab IndexedDB cache.

import { useEffect, useState } from "react";
import type {
  IRealtimeSyncService,
  RealtimeSubscriptionOptions,
} from "../../../domain/services/realtime/IRealtimeSyncService";
import { DI_TOKENS } from "../../../infrastructure/di/tokens";
import { useContainer } from "../useContainer";

export interface RealtimeSyncResult<T> {
  readonly data: T[];
  readonly isLoading: boolean;
  readonly error: Error | null;
  readonly lastSyncedAt: Date | null;
}

export function useRealtimeSync<T>(
  collectionName: string,
  options?: RealtimeSubscriptionOptions
): RealtimeSyncResult<T> {
  const syncService = useContainer<IRealtimeSyncService>(DI_TOKENS.RealtimeSyncService);

  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  const orderByField = options?.orderByField;
  const orderDirection = options?.orderDirection;
  const limitCount = options?.limitCount;

  useEffect(() => {
    setIsLoading(true);

    const subscriptionOptions = {
      orderByField,
      orderDirection,
      limitCount,
    };

    const unsubscribe = syncService.subscribeCollection<T>(
      collectionName,
      (items) => {
        setData(items);
        setIsLoading(false);
        setLastSyncedAt(new Date());
      },
      (err) => {
        setError(err);
        setIsLoading(false);
      },
      subscriptionOptions
    );

    return () => {
      unsubscribe();
    };
  }, [syncService, collectionName, orderByField, orderDirection, limitCount]);

  return {
    data,
    isLoading,
    error,
    lastSyncedAt,
  };
}
