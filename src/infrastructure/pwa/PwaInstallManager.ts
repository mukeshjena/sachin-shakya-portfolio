/**
 * PWA Install Manager
 * Manages native install prompt events, iOS detection, standalone status, and dismissal persistence.
 */

const DISMISSAL_KEY = "sachin_pwa_prompt_dismissed_until";
const DEFAULT_DISMISS_DAYS = 7;

export function isStandaloneMode(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const isMatchMedia = window.matchMedia("(display-mode: standalone)").matches;
  const isNavigatorStandalone =
    "standalone" in navigator && Boolean((navigator as { standalone?: boolean }).standalone);

  return isMatchMedia || isNavigatorStandalone;
}

export function isIosDevice(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }

  const ua = navigator.userAgent.toLowerCase();
  const isIos = /iphone|ipad|ipod/.test(ua);
  const isStandalone = isStandaloneMode();

  return isIos && !isStandalone;
}

export function isPromptDismissed(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const raw = localStorage.getItem(DISMISSAL_KEY);
    if (!raw) return false;
    const dismissedUntil = Number.parseInt(raw, 10);
    return Number.isFinite(dismissedUntil) && Date.now() < dismissedUntil;
  } catch {
    return false;
  }
}

export function dismissPrompt(days = DEFAULT_DISMISS_DAYS): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const expiry = Date.now() + days * 24 * 60 * 60 * 1000;
    localStorage.setItem(DISMISSAL_KEY, expiry.toString());
  } catch {
    // Non-critical if localStorage is blocked
  }
}

export function resetDismissal(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(DISMISSAL_KEY);
  } catch {
    // Non-critical
  }
}

export const PwaInstallManager = {
  isStandalone: isStandaloneMode,
  isIos: isIosDevice,
  isDismissed: isPromptDismissed,
  dismiss: dismissPrompt,
  resetDismissal,
};
