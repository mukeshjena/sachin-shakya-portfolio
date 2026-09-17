// presentation/coming-soon/constants/ComingSoon.constants.ts
// Single source of truth for all content, copy text, aria-labels, stats, and links.
// RULE 7 & RULE 13: Zero hardcoded strings, numbers, or constants in .tsx or .hooks.ts.

export interface ImpactStat {
  readonly value: string;
  readonly unit: string;
}

export interface SocialLink {
  readonly href: string;
  readonly label: string;
  readonly icon: string;
}

export const LAUNCH_DATE_ISO = "2026-10-18T00:00:00+05:30";

export const COMING_SOON_CONTENT = {
  statusBadge: "Deploying soon",
  eyebrow: "CloudOps Technical Lead",
  name: "Sachin Shakya",
  taglinePart1: "AI-native cloud operations. Nine years keeping Azure & AWS platforms",
  taglinePart2: " fast, observable, and considerably cheaper.",
  countdownAriaLabel: "Countdown to launch",
  statsAriaLabel: "Key achievements",
  socialNavAriaLabel: "Contact and social links",
  stats: [
    { value: "$170K", unit: "/mo saved" },
    { value: "40%", unit: "MTTR cut" },
    { value: "2000+", unit: "resources managed" },
  ] as const satisfies readonly ImpactStat[],
  socialLinks: [
    {
      href: "https://www.linkedin.com/in/sachin-shakya",
      label: "LinkedIn",
      icon: "in",
    },
    {
      href: "mailto:sachin@example.com",
      label: "Email",
      icon: "@",
    },
    {
      href: "tel:+919876543210",
      label: "Call",
      icon: "tel",
    },
  ] as const satisfies readonly SocialLink[],
  footer: {
    author: "Sachin Shakya",
    location: "Faridabad, India",
  },
} as const;
