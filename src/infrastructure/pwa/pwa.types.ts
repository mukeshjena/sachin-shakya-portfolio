/**
 * PWA & Service Worker Types
 * Strict Clean Architecture contracts for PWA management
 */

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: readonly string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export interface PwaInstallState {
  readonly isInstallable: boolean;
  readonly isInstalled: boolean;
  readonly isIos: boolean;
  readonly isStandalone: boolean;
  readonly isDismissed: boolean;
}

export interface ServiceWorkerState {
  readonly isRegistered: boolean;
  readonly isUpdateAvailable: boolean;
  readonly isOffline: boolean;
}
