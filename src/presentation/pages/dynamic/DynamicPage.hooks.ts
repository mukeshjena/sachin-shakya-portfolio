// presentation/pages/dynamic/DynamicPage.hooks.ts
// State, lifecycle, DI use-case orchestration, and dynamic route resolution.
// Universal Separation of Concerns (Rule 13) — zero JSX markup or styling in this file.

import { useCallback, useEffect, useState } from "react";
import type { PageDTO } from "../../../application/dto/PageDTO";
import type { SectionDTO } from "../../../application/dto/SectionDTO";
import type { GetPageSectionsUseCase } from "../../../application/use-cases/pages/query/GetPageSectionsUseCase";
import type { GetPublishedPageBySlugUseCase } from "../../../application/use-cases/pages/query/GetPublishedPageBySlugUseCase";
import { DI_TOKENS } from "../../../infrastructure/di/tokens";
import { useContainer } from "../../shared/useContainer";
import type { DynamicPageState } from "./DynamicPage.types";

function resolveSlugFromLocation(): string {
  if (typeof window === "undefined") {
    return "home";
  }

  // 1. Check query parameter e.g. ?page=cloud-architecture
  const params = new URLSearchParams(window.location.search);
  const queryPage = params.get("page");
  if (queryPage) {
    return queryPage.replace(/^\/+|\/+$/g, "");
  }

  // 2. Check hash route e.g. #/cloud-architecture or #/pages/cloud-architecture
  const hash = window.location.hash;
  if (hash.startsWith("#/pages/")) {
    return hash.slice(8).replace(/^\/+|\/+$/g, "");
  }
  if (hash.startsWith("#/") && hash.length > 2) {
    const raw = hash.slice(2).replace(/^\/+|\/+$/g, "");
    // Ignore section anchors like #telemetry, #experience
    if (
      !raw.includes("#") &&
      !raw.startsWith("impact") &&
      !raw.startsWith("telemetry") &&
      !raw.startsWith("experience") &&
      !raw.startsWith("capabilities") &&
      !raw.startsWith("credentials") &&
      !raw.startsWith("contact")
    ) {
      return raw;
    }
  }

  // 3. Check HTML5 pathname e.g. /cloud-architecture or /pages/cloud-architecture
  const pathname = window.location.pathname.replace(/^\/+|\/+$/g, "");
  if (pathname.startsWith("pages/")) {
    return pathname.slice(6);
  }
  if (pathname.length > 0 && pathname !== "index.html") {
    return pathname;
  }

  return "home";
}

export function useDynamicPageLogic(explicitSlug?: string): DynamicPageState {
  const getPageUseCase = useContainer<GetPublishedPageBySlugUseCase>(
    DI_TOKENS.GetPublishedPageBySlug
  );
  const getSectionsUseCase = useContainer<GetPageSectionsUseCase>(DI_TOKENS.GetPageSections);

  const [currentSlug, setCurrentSlug] = useState<string>(explicitSlug || resolveSlugFromLocation());
  const [page, setPage] = useState<PageDTO | null>(null);
  const [sections, setSections] = useState<SectionDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Sync with location changes (popstate / hashchange)
  useEffect(() => {
    if (explicitSlug) {
      setCurrentSlug(explicitSlug);
      return;
    }

    const handleLocationChange = () => {
      const detected = resolveSlugFromLocation();
      setCurrentSlug(detected);
    };

    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("hashchange", handleLocationChange);
    };
  }, [explicitSlug]);

  // Load page and its sections whenever currentSlug or refreshKey changes
  useEffect(() => {
    let isCancelled = false;

    // Track refresh attempt key to satisfy effect dependency lifecycle
    const _attempt = refreshKey;
    if (_attempt < 0) return;

    setIsLoading(true);
    setIsNotFound(false);
    setError(null);

    async function loadPageData() {
      try {
        const pageData = await getPageUseCase.execute(currentSlug);

        if (isCancelled) return;

        if (!pageData) {
          setIsNotFound(true);
          setPage(null);
          setSections([]);
          setIsLoading(false);
          return;
        }

        setPage(pageData);

        // Fetch visible sections ordered by page.sectionOrder
        const sectionsData = await getSectionsUseCase.execute(pageData.id, pageData.sectionOrder);

        if (isCancelled) return;

        setSections(sectionsData);
        setIsLoading(false);

        // Dynamically update SEO document title and description
        if (typeof document !== "undefined") {
          document.title = pageData.seoTitle
            ? `${pageData.seoTitle} — Sachin Shakya`
            : `${pageData.title} — Sachin Shakya`;

          if (pageData.seoDescription) {
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
              metaDesc.setAttribute("content", pageData.seoDescription);
            }
          }
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          const message = err instanceof Error ? err.message : "Failed to load dynamic page";
          setError(message);
          setIsLoading(false);
        }
      }
    }

    loadPageData();

    return () => {
      isCancelled = true;
    };
  }, [currentSlug, refreshKey, getPageUseCase, getSectionsUseCase]);

  const handleReload = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const handleReturnHome = useCallback(() => {
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", "/");
      setCurrentSlug("home");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  }, []);

  return {
    slug: currentSlug,
    page,
    sections,
    isLoading,
    isNotFound,
    error,
    handleReload,
    handleReturnHome,
  };
}
