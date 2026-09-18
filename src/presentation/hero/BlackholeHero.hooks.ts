// presentation/hero/BlackholeHero.hooks.ts
// Lifecycle and engine management for the 21st.dev Blackhole Hero.
// Universal Separation of Concerns (Rule 13).

import { useEffect, useMemo, useRef, useState } from "react";
import type { GetPublishedPageBySlugUseCase } from "../../application/use-cases/pages/GetPublishedPageBySlugUseCase";
import { DI_TOKENS } from "../../infrastructure/di/tokens";
import { useSiteConfig } from "../providers/site-config/useSiteConfig";
import { useContainer } from "../shared/useContainer";
import type { BlackholeHeroState, HeroContentData } from "./BlackholeHero.types";
import {
  DESKTOP_BLACKHOLE_SETTINGS,
  HERO_COPY,
  MOBILE_BLACKHOLE_SETTINGS,
} from "./constants/hero.constants";
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
  const getPageUseCase = useContainer<GetPublishedPageBySlugUseCase>(
    DI_TOKENS.GetPublishedPageBySlug
  );

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const controllerRef = useRef<BlackholeSceneController | null>(null);

  const [dynamicContent, setDynamicContent] = useState<Partial<HeroContentData> | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadHeroContent() {
      try {
        const homePage = await getPageUseCase.execute("home");
        if (isMounted && homePage) {
          setDynamicContent({
            eyebrow: HERO_COPY.eyebrow,
            titleLine1: homePage.title || HERO_COPY.titleLine1,
            titleLine2: HERO_COPY.titleLine2,
            subheadline: homePage.seoDescription || HERO_COPY.subheadline,
            ctaPrimary: HERO_COPY.ctaPrimary,
            ctaSecondary: HERO_COPY.ctaSecondary,
          });
        }
      } catch (err) {
        console.error("[useBlackholeHeroLogic] Failed to fetch dynamic hero content:", err);
      }
    }

    loadHeroContent();

    return () => {
      isMounted = false;
    };
  }, [getPageUseCase]);

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

  const content = useMemo<HeroContentData>(() => {
    return {
      eyebrow: dynamicContent?.eyebrow ?? HERO_COPY.eyebrow,
      titleLine1: dynamicContent?.titleLine1 ?? HERO_COPY.titleLine1,
      titleLine2: dynamicContent?.titleLine2 ?? HERO_COPY.titleLine2,
      subheadline: dynamicContent?.subheadline ?? HERO_COPY.subheadline,
      ctaPrimary: dynamicContent?.ctaPrimary ?? HERO_COPY.ctaPrimary,
      ctaSecondary: dynamicContent?.ctaSecondary ?? HERO_COPY.ctaSecondary,
      scrollPrompt: dynamicContent?.scrollPrompt ?? HERO_COPY.scrollPrompt,
    };
  }, [dynamicContent]);

  return {
    isNarrow,
    canvasRef,
    containerRef,
    resumePdfUrl: siteSettings.resumePdfUrl,
    content,
  };
}
