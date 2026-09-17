// presentation/coming-soon/ComingSoon.hooks.ts
// React state and lifecycle orchestration for the ComingSoon view.
// RULE 3 & RULE 13: Zero computation math, zero hardcoded values, zero CSS.

import { useEffect, useState } from "react";
import { LAUNCH_DATE_ISO } from "./constants/ComingSoon.constants";
import { calculateTimeRemaining, type TimeLeftUnit } from "./utils/ComingSoon.utils";

const targetLaunchDate = new Date(LAUNCH_DATE_ISO);

export interface UseComingSoonResult {
  readonly timeLeft: readonly TimeLeftUnit[];
}

export function useComingSoon(): UseComingSoonResult {
  const [timeLeft, setTimeLeft] = useState<readonly TimeLeftUnit[]>(() =>
    calculateTimeRemaining(targetLaunchDate)
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(targetLaunchDate));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return { timeLeft };
}
