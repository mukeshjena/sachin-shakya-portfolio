// presentation/shell/bottom-nav/MobileBottomNav.hooks.ts
// Hook managing active tab selection and intersection-observer scroll-spying for mobile bottom nav.

import { useEffect, useState } from "react";
import { MOBILE_BOTTOM_NAV_TABS } from "./constants/bottomNav.constants";
import type { MobileBottomNavState } from "./MobileBottomNav.types";

export function useMobileBottomNavLogic(): MobileBottomNavState {
  const [activeTabId, setActiveTabId] = useState<string>("top");

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const sectionIds = MOBILE_BOTTOM_NAV_TABS.map((t) => t.id);
    const elements: HTMLElement[] = [];

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) elements.push(el);
    }

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveTabId(entry.target.id);
          }
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0.1,
      }
    );

    for (const el of elements) {
      observer.observe(el);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return {
    activeTabId,
    tabs: MOBILE_BOTTOM_NAV_TABS,
    setActiveTabId,
  };
}
