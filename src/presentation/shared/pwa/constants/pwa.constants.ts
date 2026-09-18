/**
 * PWA Install Prompt Constants
 * Strict Rule 13 Separation of Concerns: zero hardcoded copy in JSX.
 * Strictly ZERO emojis. Outline iconography only.
 */

export const PWA_STRINGS = {
  BADGE: "OFFLINE METRICS",
  TITLE: "Install Executive App",
  SUBTITLE:
    "Install for instant dashboard access, offline metrics, and standalone workstation mode.",
  BUTTON_INSTALL: "Install App",
  BUTTON_DISMISS_ARIA: "Dismiss prompt",
  IOS_TITLE: "Install on iOS Safari",
  IOS_STEP_1: "Tap the Share icon in the Safari toolbar",
  IOS_STEP_2: "Scroll down and select 'Add to Home Screen'",
  INSTALLED_BADGE: "STANDALONE ACTIVE",
  OFFLINE_NOTICE: "Metrics cached for offline inspection.",
} as const;

export const PWA_CONFIG = {
  DISMISSAL_DAYS: 7,
  STORAGE_KEY: "sachin_pwa_prompt_dismissed_until",
  IOS_SHEET_MAX_AUTO_DISPLAY_SECS: 15,
} as const;
