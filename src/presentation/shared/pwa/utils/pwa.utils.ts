/**
 * PWA Utility Functions
 * Pure deterministic functions for platform detection and dismissal calculations.
 */

import { PWA_CONFIG } from "../constants/pwa.constants.ts";

export function checkIsStandalone(): boolean {
  if (typeof window === "undefined") return false;

  const matchMediaMatches = window.matchMedia("(display-mode: standalone)").matches;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  const navStandalone = Boolean(nav.standalone);

  return matchMediaMatches || navStandalone;
}

export function checkIsIosSafari(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;

  const ua = navigator.userAgent.toLowerCase();
  const isAppleMobile = /iphone|ipad|ipod/.test(ua);
  const isWebkit = /webkit/.test(ua);
  const isOtherBrowser = /crios|fxios|edgios/.test(ua);

  return isAppleMobile && isWebkit && !isOtherBrowser && !checkIsStandalone();
}

export function checkIsDismissed(storageKey: string = PWA_CONFIG.STORAGE_KEY): boolean {
  if (typeof window === "undefined") return false;

  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return false;
    const expiry = Number.parseInt(raw, 10);
    return Number.isFinite(expiry) && Date.now() < expiry;
  } catch {
    return false;
  }
}

export function persistDismissal(
  days: number = PWA_CONFIG.DISMISSAL_DAYS,
  storageKey: string = PWA_CONFIG.STORAGE_KEY
): void {
  if (typeof window === "undefined") return;

  try {
    const expiry = Date.now() + days * 24 * 60 * 60 * 1000;
    localStorage.setItem(storageKey, expiry.toString());
  } catch {
    // Non-critical if storage fails
  }
}
