// presentation/coming-soon/ComingSoon.hooks.ts
// Logic for the ComingSoon component (agent rule #3 — no logic in .tsx).

import { useEffect, useState } from "react";

interface TimeLeft {
  label: string;
  value: string;
}

interface SocialLink {
  href: string;
  label: string;
  icon: string;
}

interface ComingSoonState {
  timeLeft: TimeLeft[];
  socialLinks: SocialLink[];
}

// Target launch date — approximately 30 days from project start
const LAUNCH_DATE = new Date("2026-10-18T00:00:00+05:30");

/** Pads a number to 2 digits */
function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

/** Computes the remaining time until LAUNCH_DATE */
function computeTimeLeft(): TimeLeft[] {
  const diff = LAUNCH_DATE.getTime() - Date.now();

  if (diff <= 0) {
    return [
      { label: "days", value: "00" },
      { label: "hours", value: "00" },
      { label: "mins", value: "00" },
      { label: "secs", value: "00" },
    ];
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  return [
    { label: "days", value: pad(days) },
    { label: "hours", value: pad(hours) },
    { label: "mins", value: pad(mins) },
    { label: "secs", value: pad(secs) },
  ];
}

/** Static social / contact links — content will be Firestore-driven from Step 16 onward */
const STATIC_SOCIAL_LINKS: SocialLink[] = [
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
];

export function useComingSoon(): ComingSoonState {
  const [timeLeft, setTimeLeft] = useState<TimeLeft[]>(computeTimeLeft());

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(computeTimeLeft());
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return {
    timeLeft,
    socialLinks: STATIC_SOCIAL_LINKS,
  };
}
