/**
 * Service Worker Manager
 * Handles Service Worker registration, auto-updates, and network connectivity state.
 */

import { registerSW } from "virtual:pwa-register";
import type { ServiceWorkerState } from "./pwa.types.ts";

export type UpdateCallback = (reloadPage: (reloadPage?: boolean) => Promise<void>) => void;
export type OfflineCallback = (isOffline: boolean) => void;

let updateCallbackHandler: UpdateCallback | null = null;
let updateSWHandler: ((reloadPage?: boolean) => Promise<void>) | null = null;

export function registerServiceWorker(onNeedRefresh?: UpdateCallback): () => void {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return () => {};
  }

  if (onNeedRefresh) {
    updateCallbackHandler = onNeedRefresh;
  }

  try {
    const updateSW = registerSW({
      immediate: true,
      onNeedRefresh() {
        if (updateCallbackHandler && updateSWHandler) {
          updateCallbackHandler(updateSWHandler);
        }
      },
      onOfflineReady() {
        // App is ready to work offline
      },
      onRegisterError(error: unknown) {
        console.warn("[PWA] Service Worker registration failed:", error);
      },
    });

    updateSWHandler = updateSW;

    return () => {
      updateCallbackHandler = null;
    };
  } catch (err) {
    console.warn("[PWA] Registration error:", err);
    return () => {};
  }
}

export function subscribeNetworkStatus(callback: OfflineCallback): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleOnline = () => callback(false);
  const handleOffline = () => callback(true);

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
}

export function getServiceWorkerState(): ServiceWorkerState {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return {
      isRegistered: false,
      isUpdateAvailable: false,
      isOffline: false,
    };
  }

  return {
    isRegistered: Boolean(navigator.serviceWorker.controller),
    isUpdateAvailable: false,
    isOffline: !navigator.onLine,
  };
}

export const ServiceWorkerManager = {
  register: registerServiceWorker,
  subscribeNetworkStatus,
  getState: getServiceWorkerState,
};
