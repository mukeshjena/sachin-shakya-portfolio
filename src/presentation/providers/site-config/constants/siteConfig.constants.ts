// presentation/providers/site-config/constants/siteConfig.constants.ts
// Fallback defaults for SiteSettings when offline or uninitialized.

import type { SiteSettings } from "../../../../domain/entities/admin/SiteSettings";

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: "global",
  fullName: "Sachin Shakya",
  headline: "Lead Cloud Architect & DevOps Consultant",
  shortBio:
    "Results-driven Cloud Architect with 8+ years architecting enterprise multi-cloud platforms, FinOps governance, and automated CI/CD pipelines. Documented $170K/month cloud cost reduction and 40% MTTR improvement across mission-critical systems.",
  email: "sachin.shakya@live.com",
  phone: "+91 99112 00473",
  location: "Faridabad, Haryana, India",
  logoUrl: "/assets/sachin-logo.png",
  avatarUrl: "/assets/sachin-one.png",
  resumePdfUrl: "/Sachin_Shakya_Resume.pdf",
  socialLinks: [
    {
      platform: "linkedin",
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/sachin-shakya/",
      isVisible: true,
      order: 1,
    },
    {
      platform: "github",
      label: "GitHub",
      url: "https://github.com/mukeshjena",
      isVisible: true,
      order: 2,
    },
    {
      platform: "email",
      label: "Direct Email",
      url: "mailto:sachin.shakya@live.com",
      isVisible: true,
      order: 3,
    },
  ],
  availabilityStatus: "available",
  availabilityNote: "Available for Lead Cloud Architecture & Advisory Roles",
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
};
