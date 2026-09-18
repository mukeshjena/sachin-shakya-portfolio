/**
 * PWA Install Prompt Component Types
 */

export type PwaPromptViewMode = "prompt" | "ios-guide" | "hidden";

export interface PwaInstallPromptProps {
  readonly className?: string;
}

export interface UsePwaInstallPromptReturn {
  readonly isVisible: boolean;
  readonly viewMode: PwaPromptViewMode;
  readonly isIos: boolean;
  readonly isInstalling: boolean;
  readonly handleInstall: () => Promise<void>;
  readonly handleDismiss: () => void;
  readonly handleToggleIosGuide: () => void;
}
