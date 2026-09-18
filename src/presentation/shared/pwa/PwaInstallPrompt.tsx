/**
 * PWA Install Prompt Component
 * Liquid-glass instrument-panel floating prompt with iOS Safari guide & Android/Desktop installation.
 * Strict Clean Architecture & shadow-free aesthetics.
 */

import type React from "react";
import {
  PiDeviceMobile,
  PiDownloadSimple,
  PiPlusSquare,
  PiShareNetwork,
  PiX,
} from "react-icons/pi";
import { PWA_STRINGS } from "./constants/pwa.constants.ts";
import { usePwaInstallPrompt } from "./PwaInstallPrompt.hooks.ts";
import type { PwaInstallPromptProps } from "./types/pwa-prompt.types.ts";
import "./PwaInstallPrompt.css";

export const PwaInstallPrompt: React.FC<PwaInstallPromptProps> = ({ className }) => {
  const {
    isVisible,
    viewMode,
    isIos,
    isInstalling,
    handleInstall,
    handleDismiss,
    handleToggleIosGuide,
  } = usePwaInstallPrompt();

  if (!isVisible || viewMode === "hidden") {
    return null;
  }

  const containerClasses = className ? `pwa-prompt-container ${className}` : "pwa-prompt-container";

  return (
    <aside className={containerClasses} aria-label={PWA_STRINGS.TITLE}>
      <div className="pwa-prompt-header">
        <span className="pwa-prompt-badge">
          <PiDeviceMobile aria-hidden="true" />
          <span>{PWA_STRINGS.BADGE}</span>
        </span>
        <button
          type="button"
          className="pwa-prompt-dismiss"
          onClick={handleDismiss}
          aria-label={PWA_STRINGS.BUTTON_DISMISS_ARIA}
        >
          <PiX aria-hidden="true" />
        </button>
      </div>

      <h3 className="pwa-prompt-title">
        {viewMode === "ios-guide" ? PWA_STRINGS.IOS_TITLE : PWA_STRINGS.TITLE}
      </h3>

      {viewMode === "ios-guide" ? (
        <div className="pwa-ios-steps">
          <div className="pwa-ios-step-item">
            <PiShareNetwork className="pwa-ios-icon" aria-hidden="true" />
            <span>{PWA_STRINGS.IOS_STEP_1}</span>
          </div>
          <div className="pwa-ios-step-item">
            <PiPlusSquare className="pwa-ios-icon" aria-hidden="true" />
            <span>{PWA_STRINGS.IOS_STEP_2}</span>
          </div>
        </div>
      ) : (
        <p className="pwa-prompt-desc">{PWA_STRINGS.SUBTITLE}</p>
      )}

      <div className="pwa-prompt-actions">
        {isIos ? (
          <button type="button" className="pwa-btn-primary" onClick={handleToggleIosGuide}>
            <PiShareNetwork aria-hidden="true" />
            <span>{PWA_STRINGS.BUTTON_INSTALL}</span>
          </button>
        ) : (
          <button
            type="button"
            className="pwa-btn-primary"
            onClick={handleInstall}
            disabled={isInstalling}
          >
            <PiDownloadSimple aria-hidden="true" />
            <span>{PWA_STRINGS.BUTTON_INSTALL}</span>
          </button>
        )}
      </div>
    </aside>
  );
};
