// App.hooks.ts — Logic for App.tsx.
// All state and hook resolution lives here, never in App.tsx (agent rule #3 / Rule 13).

import { useEffect, useState } from "react";
import type { IPingUseCase } from "./application/use-cases/ping/PingUseCase";
import { DI_TOKENS } from "./infrastructure/di/tokens";
import { useContainer } from "./presentation/shared/useContainer";

export interface AppState {
  readonly showPipelineTest: boolean;
  readonly pingMessage: string;
  readonly isDynamicRoute: boolean;
  readonly activeSlug: string;
}

function parseCurrentRoute(): { isDynamic: boolean; slug: string } {
  if (typeof window === "undefined") {
    return { isDynamic: false, slug: "home" };
  }

  // 1. Check query parameter ?page=slug
  const params = new URLSearchParams(window.location.search);
  const querySlug = params.get("page");
  if (querySlug && querySlug !== "home") {
    return { isDynamic: true, slug: querySlug.replace(/^\/+|\/+$/g, "") };
  }

  // 2. Check hash route #/slug or #/pages/slug
  const hash = window.location.hash;
  if (hash.startsWith("#/pages/")) {
    const slug = hash.slice(8).replace(/^\/+|\/+$/g, "");
    if (slug && slug !== "home") {
      return { isDynamic: true, slug };
    }
  }
  if (hash.startsWith("#/") && hash.length > 2) {
    const slug = hash.slice(2).replace(/^\/+|\/+$/g, "");
    if (
      slug &&
      slug !== "home" &&
      !slug.includes("#") &&
      !slug.startsWith("impact") &&
      !slug.startsWith("telemetry") &&
      !slug.startsWith("experience") &&
      !slug.startsWith("capabilities") &&
      !slug.startsWith("credentials") &&
      !slug.startsWith("contact")
    ) {
      return { isDynamic: true, slug };
    }
  }

  // 3. Check pathname /pages/slug or /slug
  const pathname = window.location.pathname.replace(/^\/+|\/+$/g, "");
  if (pathname.startsWith("pages/")) {
    const slug = pathname.slice(6);
    if (slug && slug !== "home") {
      return { isDynamic: true, slug };
    }
  }

  if (
    pathname.length > 0 &&
    pathname !== "home" &&
    pathname !== "index.html" &&
    !pathname.includes(".")
  ) {
    return { isDynamic: true, slug: pathname };
  }

  return { isDynamic: false, slug: "home" };
}

/**
 * App-level hook managing routing state and DI smoke tests.
 */
export function useAppState(): AppState {
  const pingUseCase = useContainer<IPingUseCase>(DI_TOKENS.PingUseCase);
  const pingMessage = pingUseCase.execute();

  const [showPipelineTest, setShowPipelineTest] = useState<boolean>(false);
  const [routeInfo, setRouteInfo] = useState<{ isDynamic: boolean; slug: string }>(() =>
    parseCurrentRoute()
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateRoute = () => {
      const params = new URLSearchParams(window.location.search);
      const isPipelineTestParam =
        params.get("test") === "pipeline" || window.location.hash === "#pipeline-test";
      setShowPipelineTest(isPipelineTestParam);

      setRouteInfo(parseCurrentRoute());
    };

    updateRoute();

    window.addEventListener("popstate", updateRoute);
    window.addEventListener("hashchange", updateRoute);

    // Intercept client-side relative link clicks for fast SPA navigation
    const handleDocumentClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Skip external links, mailto, tel, and PDF downloads
      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.endsWith(".pdf") ||
        target.target === "_blank"
      ) {
        return;
      }

      // Handle anchor links while on dynamic route: go back to / + anchor
      if (href.startsWith("#") && routeInfo.isDynamic) {
        e.preventDefault();
        window.history.pushState(null, "", `/${href}`);
        updateRoute();
        const elementId = href.slice(1);
        setTimeout(() => {
          document.getElementById(elementId)?.scrollIntoView({ behavior: "smooth" });
        }, 100);
        return;
      }

      // Handle path navigation e.g. /cloud-architecture or /
      if (href.startsWith("/") && !href.startsWith("//")) {
        e.preventDefault();
        window.history.pushState(null, "", href);
        updateRoute();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      window.removeEventListener("popstate", updateRoute);
      window.removeEventListener("hashchange", updateRoute);
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [routeInfo.isDynamic]);

  return {
    showPipelineTest,
    pingMessage,
    isDynamicRoute: routeInfo.isDynamic,
    activeSlug: routeInfo.slug,
  };
}
