// presentation/coming-soon/utils/ComingSoon.utils.ts
// Pure countdown and formatting logic.
// RULE 3 & RULE 13: Computation logic lives in dedicated utility files, not in .tsx or .hooks.ts.

export interface TimeLeftUnit {
  readonly label: string;
  readonly value: string;
}

/**
 * Pads a number to 2 digits with a leading zero.
 */
export function padZero(n: number): string {
  return n.toString().padStart(2, "0");
}

/**
 * Computes remaining days, hours, mins, secs until the target date.
 * Returns zeros if target date has passed.
 */
export function calculateTimeRemaining(targetDate: Date, now: number = Date.now()): TimeLeftUnit[] {
  const diff = targetDate.getTime() - now;

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
    { label: "days", value: padZero(days) },
    { label: "hours", value: padZero(hours) },
    { label: "mins", value: padZero(mins) },
    { label: "secs", value: padZero(secs) },
  ];
}
