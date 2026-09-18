// presentation/admin/dashboard/constants/dashboard.constants.ts
// Constants, static copy, and navigation definitions for the Admin Dashboard Shell.

export const DASHBOARD_COPY = {
  BADGE: "MISSION CONTROL // TELEMETRY",
  TITLE: "Executive Administration",
  SUBTITLE: "Real-time multi-cloud architecture, dynamic page engine, and CMS controls.",
  LIVE_SYNC_ACTIVE: "REALTIME SYNC ACTIVE",
  LIVE_SYNC_OFFLINE: "SYNC OFFLINE",
  RETURN_TO_SITE: "Return to Site",
  LOGOUT: "Logout",
  STATUS_ONLINE: "ONLINE",
  LAST_SYNC_LABEL: "Last Synced",
  SESSION_PREFIX: "AUTHENTICATED",
  KPI_PAGES_LABEL: "Dynamic Pages",
  KPI_INQUIRIES_LABEL: "Inbound Inquiries",
  KPI_ADMINS_LABEL: "Whitelisted Admins",
  KPI_FINOPS_LABEL: "Monthly Cloud Savings",
  FINOPS_AMOUNT: "$170K/mo",
  ACTIONS_LABEL: "Row Actions",
} as const;

export type DashboardTabId = "overview" | "pages" | "content" | "media" | "contacts" | "settings";

export interface NavTabItem {
  readonly id: DashboardTabId;
  readonly label: string;
  readonly description: string;
}

export const DASHBOARD_NAV_TABS: readonly NavTabItem[] = [
  {
    id: "overview",
    label: "Overview",
    description: "Telemetry, KPIs, and fleet health",
  },
  {
    id: "pages",
    label: "Pages",
    description: "Dynamic pages & section ordering",
  },
  {
    id: "content",
    label: "Content",
    description: "Experience, capabilities, and credentials",
  },
  {
    id: "media",
    label: "Media",
    description: "Cloudinary asset library & uploads",
  },
  {
    id: "contacts",
    label: "Inquiries",
    description: "Contact form & promo submissions",
  },
  {
    id: "settings",
    label: "Settings",
    description: "Admin whitelist & site configuration",
  },
] as const;
