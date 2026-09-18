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

/**
 * Computes smooth cubic Bézier SVG geometry for the FinOps Cost Trajectory.
 * Produces an executive instrument-panel curve conforming to the canonical design.
 */
export function computeFinOpsCurveGeometry(
  points: readonly FinOpsPointData[],
  width = 560,
  _height = 200
): CurveGeometry {
  if (!points || points.length === 0) {
    return {
      lineD: "M8,52 L552,150",
      areaD: "M8,52 L552,150 L552,192 L8,192 Z",
      milestoneX: 262,
      milestoneLabel: "Optimization Phase",
      coords: [],
    };
  }

  const xStart = 8;
  const xEnd = width - 8;
  const bottomY = 192;
  const yMin = 38;
  const yMax = 152;

  // Compute spend domain
  const allOptimized = points.map((p) => p.optimized);
  const allBaseline = points.map((p) => p.baseline);
  const minSpend = Math.min(...allOptimized, 250);
  const maxSpend = Math.max(...allBaseline, 480);
  const spendRange = maxSpend - minSpend || 1;

  // Map points to SVG coordinates
  const coords = points.map((pt, i) => {
    const ratio = points.length > 1 ? i / (points.length - 1) : 0;
    const x = xStart + ratio * (xEnd - xStart);
    // Higher spend = closer to top (lower y). Lower spend = closer to bottom (higher y).
    const normalized = (maxSpend - pt.optimized) / spendRange;
    const clamped = Math.max(0, Math.min(1, normalized));
    const y = yMin + clamped * (yMax - yMin);
    return { x, y, month: pt.month, spend: pt.optimized };
  });

  // Generate smooth cubic Bézier path via Catmull-Rom spline conversion
  let lineD = `M${coords[0]?.x.toFixed(1)},${coords[0]?.y.toFixed(1)}`;

  for (let i = 0; i < coords.length - 1; i++) {
    const p1 = coords[i];
    const p2 = coords[i + 1];
    if (!p1 || !p2) continue;

    const p0 = coords[Math.max(0, i - 1)] ?? p1;
    const p3 = coords[Math.min(coords.length - 1, i + 2)] ?? p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    lineD += ` C${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }

  const lastCoord = coords[coords.length - 1] ?? { x: xEnd, y: yMax };
  const firstCoord = coords[0] ?? { x: xStart, y: yMin };
  const areaD = `${lineD} L${lastCoord.x.toFixed(1)},${bottomY} L${firstCoord.x.toFixed(1)},${bottomY} Z`;

  // Milestone marker: locate milestone near middle or where explicitly declared
  let milestoneIdx = points.findIndex((p, idx) => idx > 2 && idx < 9 && Boolean(p.milestone));
  if (milestoneIdx === -1) {
    milestoneIdx = Math.floor(points.length * 0.48);
  }
  const milestoneCoord = coords[milestoneIdx] ?? { x: 262 };
  const milestoneLabel = points[milestoneIdx]?.milestone || "Storage & Workload Rightsizing";

  return {
    lineD,
    areaD,
    milestoneX: Math.round(milestoneCoord.x),
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
    // If admin explicitly wrote e.g. "$2M" or "$2.5M"
    if (headline.includes("M") || headline.includes("m")) {
      return headline;
    }
  }

  // Calculate annual aggregate from last month savings or average
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
