// presentation/hero/BlackholeHero.hooks.ts
// Lifecycle and engine management for the 21st.dev Blackhole Hero.
// Universal Separation of Concerns (Rule 13).

import { useEffect, useRef, useState } from "react";
import { useSiteConfig } from "../providers/site-config/useSiteConfig";
import type { BlackholeHeroState } from "./BlackholeHero.types";
import { DESKTOP_BLACKHOLE_SETTINGS, MOBILE_BLACKHOLE_SETTINGS } from "./constants/hero.constants";
import { BlackholeSceneController } from "./scene/BlackholeHero.scene";

function useNarrow(query = "(max-width: 767px)"): boolean {
  const [isNarrow, setIsNarrow] = useState<boolean>(() => {
    return typeof window !== "undefined" && window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    const sync = () => setIsNarrow(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [query]);

  return isNarrow;
}

export function useBlackholeHeroLogic(): BlackholeHeroState {
  const { siteSettings } = useSiteConfig();
  const isNarrow = useNarrow();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const controllerRef = useRef<BlackholeSceneController | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const controller = new BlackholeSceneController();
    controllerRef.current = controller;

    const initialSettings = isNarrow ? MOBILE_BLACKHOLE_SETTINGS : DESKTOP_BLACKHOLE_SETTINGS;

    controller.init(canvas, container, initialSettings);

    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, [isNarrow]);

  // Synchronize settings when crossing narrow/desktop breakpoint
  useEffect(() => {
    if (!controllerRef.current) return;
    const settings = isNarrow ? MOBILE_BLACKHOLE_SETTINGS : DESKTOP_BLACKHOLE_SETTINGS;
    controllerRef.current.updateConfig(settings);
  }, [isNarrow]);

  return {
    isNarrow,
    canvasRef,
    containerRef,
    resumePdfUrl: siteSettings.resumePdfUrl,
  };
}
