// presentation/pages/hooks/usePage.ts
// Hook for fetching a published page by slug through Clean Architecture use-case.
// ZERO direct Firebase or infrastructure imports — relies strictly on useContainer().

import { useCallback, useEffect, useState } from "react";
import type { PageDTO } from "../../../application/dto/PageDTO";
import type { GetPublishedPageBySlugUseCase } from "../../../application/use-cases/pages/GetPublishedPageBySlugUseCase";
import { DI_TOKENS } from "../../../infrastructure/di/tokens";
import { useContainer } from "../../shared/useContainer";

export interface UsePageResult {
  readonly page: PageDTO | null;
  readonly loading: boolean;
  readonly error: string | null;
  readonly reload: () => void;
}

/**
 * Custom presentation hook that fetches and manages published page state.
 *
 * @param slug - The URL slug of the page to load (e.g. "home")
 * @returns State object with page data, loading status, error message, and reload function.
 */
export function usePage(slug: string): UsePageResult {
  const getPageUseCase = useContainer<GetPublishedPageBySlugUseCase>(
    DI_TOKENS.GetPublishedPageBySlug
  );

  const [page, setPage] = useState<PageDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState<number>(0);

  const reload = useCallback(() => {
    setReloadKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let isCancelled = false;
    // Track reload attempt key to satisfy effect dependency lifecycle
    const _attempt = reloadKey;
    if (_attempt < 0) return;

    setLoading(true);
    setError(null);

    getPageUseCase
      .execute(slug)
      .then((result) => {
        if (!isCancelled) {
          setPage(result);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          const message = err instanceof Error ? err.message : "Failed to load page";
          setError(message);
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [slug, reloadKey, getPageUseCase]);

  return { page, loading, error, reload };
}
