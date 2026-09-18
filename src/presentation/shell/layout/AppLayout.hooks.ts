// presentation/shell/layout/AppLayout.hooks.ts
// Lifecycle and smooth-scroll navigation handling for AppLayout.

import { useCallback } from "react";

export interface AppLayoutState {
  readonly handleNavigate: (href: string) => void;
}

export function useAppLayoutLogic(): AppLayoutState {
  const handleNavigate = useCallback((href: string) => {
    if (typeof window === "undefined") return;

    if (href.startsWith("#")) {
      const targetId = href.slice(1);
      if (!targetId || targetId === "top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return {
    handleNavigate,
  };
}
