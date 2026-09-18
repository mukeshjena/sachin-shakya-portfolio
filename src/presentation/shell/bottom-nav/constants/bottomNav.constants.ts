// presentation/shell/bottom-nav/constants/bottomNav.constants.ts
// Tab items and anchor definitions for the mobile floating liquid-glass dock.

import type { ComponentType } from "react";
import {
  IoBriefcaseOutline,
  IoCompassOutline,
  IoHardwareChipOutline,
  IoLayersOutline,
  IoMailOutline,
  IoShieldCheckmarkOutline,
  IoStatsChartOutline,
} from "react-icons/io5";

export interface MobileBottomNavTab {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly icon: ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
}

export const MOBILE_BOTTOM_NAV_TABS: readonly MobileBottomNavTab[] = [
  {
    id: "overview",
    label: "Overview",
    href: "#overview",
    icon: IoStatsChartOutline,
  },
  {
    id: "architecture",
    label: "Architecture",
    href: "/cloud-architecture",
    icon: IoCompassOutline,
  },
  {
    id: "metrics",
    label: "Metrics",
    href: "#metrics",
    icon: IoHardwareChipOutline,
  },
  {
    id: "experience",
    label: "Experience",
    href: "#experience",
    icon: IoBriefcaseOutline,
  },
  {
    id: "capabilities",
    label: "Capabilities",
    href: "#capabilities",
    icon: IoLayersOutline,
  },
  {
    id: "credentials",
    label: "Credentials",
    href: "#credentials",
    icon: IoShieldCheckmarkOutline,
  },
  {
    id: "contact",
    label: "Contact",
    href: "#contact",
    icon: IoMailOutline,
  },
];
