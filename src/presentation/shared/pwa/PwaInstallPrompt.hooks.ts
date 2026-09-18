/**
 * PWA Install Prompt Hook
 * Manages event subscription, deferred prompt capture, and iOS guidance state.
 */

import { useCallback, useEffect, useState } from "react";
import type { BeforeInstallPromptEvent } from "../../../infrastructure/pwa/pwa.types.ts";
import { PWA_CONFIG } from "./constants/pwa.constants.ts";
import type { PwaPromptViewMode, UsePwaInstallPromptReturn } from "./types/pwa-prompt.types.ts";
import {
  checkIsDismissed,
  checkIsIosSafari,
  checkIsStandalone,
  persistDismissal,
} from "./utils/pwa.utils.ts";

export function usePwaInstallPrompt(): UsePwaInstallPromptReturn {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [viewMode, setViewMode] = useState<PwaPromptViewMode>("hidden");
  const [isIos, setIsIos] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (checkIsStandalone() || checkIsDismissed()) {
      setIsVisible(false);
      setViewMode("hidden");
      return;
    }

    const ios = checkIsIosSafari();
    setIsIos(ios);

    if (ios) {
      setIsVisible(true);
      setViewMode("prompt");
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setIsVisible(true);
      setViewMode("prompt");
    };

    const handleAppInstalled = () => {
      setIsVisible(false);
      setViewMode("hidden");
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (isIos) {
      setViewMode("ios-guide");
      return;
    }

    if (!deferredPrompt) return;

    setIsInstalling(true);
    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setIsVisible(false);
        setViewMode("hidden");
      }
    } catch (err) {
      console.warn("[PWA] Installation prompt error:", err);
    } finally {
      setIsInstalling(false);
      setDeferredPrompt(null);
    }
  }, [deferredPrompt, isIos]);

  const handleDismiss = useCallback(() => {
    persistDismissal(PWA_CONFIG.DISMISSAL_DAYS);
    setIsVisible(false);
    setViewMode("hidden");
  }, []);

  const handleToggleIosGuide = useCallback(() => {
    setViewMode((prev) => (prev === "ios-guide" ? "prompt" : "ios-guide"));
  }, []);

  return {
    isVisible,
    viewMode,
    isIos,
    isInstalling,
    handleInstall,
    handleDismiss,
    handleToggleIosGuide,
  };
}
