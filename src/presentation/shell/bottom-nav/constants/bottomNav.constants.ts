// presentation/shell/bottom-nav/constants/bottomNav.constants.ts
// Tab items and anchor definitions for the mobile floating liquid-glass dock.

import type { ComponentType } from "react";
import {
  IoBriefcaseOutline,
  IoCompassOutline,
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
    id: "top",
    label: "Mission",
    href: "#top",
    icon: IoCompassOutline,
  },
  {
    id: "telemetry",
    label: "Telemetry",
    href: "#telemetry",
    icon: IoStatsChartOutline,
  },
  {
    id: "experience",
    label: "Experience",
    href: "#experience",
    icon: IoBriefcaseOutline,
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
