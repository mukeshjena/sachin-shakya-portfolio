// presentation/sections/telemetry/charts/finops/CostTrajectoryChart.utils.ts
// Pure mathematical curve interpolation and telemetry projection calculations.
// Universal Separation of Concerns (Rule 13) — Zero React hooks, zero JSX, zero side-effects.

export interface FinOpsPointData {
  readonly month: string;
  readonly baseline: number;
  readonly optimized: number;
  readonly milestone?: string;
}

export interface CurveGeometry {
  readonly lineD: string;
  readonly areaD: string;
  readonly milestoneX: number;
  readonly milestoneLabel: string;
  readonly coords: readonly { x: number; y: number; month: string; spend: number }[];
}

const CANONICAL_LINE_D =
  "M8,52 C60,44 96,70 132,62 S196,40 236,58 C268,74 288,124 330,136 S404,152 448,148 C492,144 524,152 552,150";

const CANONICAL_AREA_D =
  "M8,52 C60,44 96,70 132,62 S196,40 236,58 C268,74 288,124 330,136 S404,152 448,148 C492,144 524,152 552,150 L552,192 L8,192 Z";

/**
 * Computes smooth cubic Bézier SVG geometry for the FinOps Cost Trajectory.
 * Delivers exact parity with the canonical signature design from Image 1.
 */
export function computeFinOpsCurveGeometry(points: readonly FinOpsPointData[]): CurveGeometry {
  const milestoneX = 262;
  const milestoneLabel = "Storage & Workload Rightsizing";

  if (!points || points.length === 0) {
    return {
      lineD: CANONICAL_LINE_D,
      areaD: CANONICAL_AREA_D,
      milestoneX,
      milestoneLabel,
      coords: [],
    };
  }

  const firstPt = points[0];
  const lastPt = points[points.length - 1];
  const baseline = firstPt?.baseline ?? 450;
  const optimized = lastPt?.optimized ?? 280;

  // If points reflect the default 450 -> 280 values, use canonical path directly
  const isDefaultTrajectory = baseline === 450 && optimized === 280;

  let lineD = CANONICAL_LINE_D;
  let areaD = CANONICAL_AREA_D;

  if (!isDefaultTrajectory) {
    // Dynamically scale wave & plateau heights according to custom admin spend
    const yB = Math.max(25, Math.min(80, 52 - (baseline - 450) * 0.2));
    const yO = Math.max(110, Math.min(175, 150 - (optimized - 280) * 0.4));
    const drop = yO - yB;

    const y0 = yB.toFixed(1);
    const cp0 = (yB - 8).toFixed(1);
    const cp1 = (yB + 18).toFixed(1);
    const y1 = (yB + 10).toFixed(1);
    const cp2 = (yB - 12).toFixed(1);
    const y2 = (yB + 6).toFixed(1);
    const cp3 = (yB + drop * 0.22).toFixed(1);
    const cp4 = (yB + drop * 0.73).toFixed(1);
    const y3 = (yB + drop * 0.86).toFixed(1);
    const cp5 = (yO + 2).toFixed(1);
    const y4 = (yO - 2).toFixed(1);
    const cp6 = (yO - 6).toFixed(1);
    const cp7 = (yO + 2).toFixed(1);
    const y5 = yO.toFixed(1);

    lineD = `M8,${y0} C60,${cp0} 96,${cp1} 132,${y1} S196,${cp2} 236,${y2} C268,${cp3} 288,${cp4} 330,${y3} S404,${cp5} 448,${y4} C492,${cp6} 524,${cp7} 552,${y5}`;
    areaD = `${lineD} L552,192 L8,192 Z`;
  }

  // Generate 12 interactive hover anchor coordinates along the curve
  const coords = points.map((pt, i) => {
    const ratio = points.length > 1 ? i / (points.length - 1) : 0;
    const x = Math.round(8 + ratio * (552 - 8));
    // Sample y based on curve progress
    let y = 52;
    if (ratio < 0.25) {
      y = 52 + Math.sin(ratio * Math.PI * 4) * 8;
    } else if (ratio < 0.6) {
      const dropProgress = (ratio - 0.25) / 0.35;
      y = 52 + dropProgress * 96;
    } else {
      y = 148 + Math.sin(ratio * Math.PI * 2) * 2;
    }

    return { x, y: Math.round(y), month: pt.month, spend: pt.optimized };
  });

  return {
    lineD,
    areaD,
    milestoneX,
    milestoneLabel,
    coords,
  };
}

/**
 * Formats annual savings metric string.
 */
export function formatAnnualSavings(
  headline: string | undefined,
  points: readonly FinOpsPointData[]
): string {
  if (headline?.trim() && headline !== "$170K/mo") {
    if (headline.includes("M") || headline.includes("m")) {
      return headline;
    }
  }

  if (points.length > 0) {
    const lastPt = points[points.length - 1];
    if (lastPt) {
      const monthlySavings = lastPt.baseline - lastPt.optimized;
      if (monthlySavings > 0) {
        const annualK = monthlySavings * 12;
        if (annualK >= 1000) {
          const mVal = annualK / 1000;
          return Number.isInteger(mVal) ? `$${mVal}M` : `$${mVal.toFixed(1)}M`;
        }
        return `$${annualK}K`;
      }
    }
  }

  return "$2M";
}

/**
 * Formats monthly savings delta label for tag badge.
 */
export function formatMonthlySavingsDelta(
  points: readonly FinOpsPointData[],
  fallback = "−$170K / month"
): string {
  if (!points || points.length === 0) return fallback;
  const lastPt = points[points.length - 1];
  if (!lastPt) return fallback;

  const delta = lastPt.baseline - lastPt.optimized;
  if (delta > 0) {
    return `−$${delta}K / month`;
  }
  return fallback;
}
