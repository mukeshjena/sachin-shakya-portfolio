// presentation/sections/telemetry/charts/CostTrajectoryChart.tsx
// Signature Animated FinOps Cost Optimization Curve Console.
// Exact 1:1 visual parity with the canonical instrument panel console from Image 1.
// Strictly adheres to shadow-free surfaces, monospaced tabular figures, and zero emojis.

import { motion } from "framer-motion";
import type React from "react";
import { useMemo, useState } from "react";
import { MONTHLY_SPEND_SERIES } from "../../constants/telemetry.constants";
import {
  computeFinOpsCurveGeometry,
  type FinOpsPointData,
  formatAnnualSavings,
  formatMonthlySavingsDelta,
} from "./CostTrajectoryChart.utils";

export interface CostTrajectoryChartProps {
  readonly points?: readonly FinOpsPointData[];
  readonly annualSavingsHeadline?: string;
  readonly monthlyTarget?: string;
  readonly mttrReductionPercent?: number;
}

export function CostTrajectoryChart({
  points,
  annualSavingsHeadline,
  mttrReductionPercent = 40,
}: CostTrajectoryChartProps) {
  const pointsData = useMemo(() => {
    return points && points.length > 0 ? points : MONTHLY_SPEND_SERIES;
  }, [points]);

  const geometry = useMemo(() => computeFinOpsCurveGeometry(pointsData), [pointsData]);
  const annualSavingsDisplay = useMemo(
    () => formatAnnualSavings(annualSavingsHeadline, pointsData),
    [annualSavingsHeadline, pointsData]
  );
  const monthlyDeltaDisplay = useMemo(() => formatMonthlySavingsDelta(pointsData), [pointsData]);

  // Active hover point state for interactive cursor tracking (pinned to initial baseline by default)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(0);
  const activeCoord = hoveredIdx !== null ? geometry.coords[hoveredIdx] : null;
  const activePoint = hoveredIdx !== null ? pointsData[hoveredIdx] : null;

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width <= 0) return;
    const mouseX = ((e.clientX - rect.left) / rect.width) * 560;

    let closestIdx = 0;
    let minDiff = Number.POSITIVE_INFINITY;
    for (let i = 0; i < geometry.coords.length; i++) {
      const coord = geometry.coords[i];
      if (coord) {
        const diff = Math.abs(coord.x - mouseX);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = i;
        }
      }
    }
    setHoveredIdx(closestIdx);
  };

  return (
    <figure className="w-full rounded-2xl border border-[var(--line)] bg-[var(--ink-850)]/90 backdrop-blur-md overflow-hidden select-none m-0">
      {/* Console Top Header */}
      <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-[var(--line)] text-[11px] font-mono tracking-widest uppercase text-[var(--mist-dim)] bg-[var(--ink-800)]/60">
        <span className="font-semibold text-[var(--paper)]">Azure cost signal</span>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--live)] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--live)]" />
          </span>
          <span className="text-[var(--live)] font-bold">Optimised</span>
        </div>
      </div>

      {/* Main Chart Canvas */}
      <section
        aria-label="Interactive Cost Trajectory Canvas"
        className="relative p-4 sm:p-6 pb-2 cursor-crosshair bg-transparent"
      >
        {/* Top-Left Tag */}
        <span className="absolute left-6 top-5 text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[var(--mist-dim)] font-medium pointer-events-none">
          Monthly cloud spend
        </span>

        {/* Scalable SVG Curve with Interactive Cursor Tracking */}
        <svg
          viewBox="0 0 560 200"
          className="w-full h-auto overflow-visible"
          role="img"
          aria-label="Line chart showing monthly Azure cloud spend falling steeply after the cost-optimisation programme and holding at the lower level."
          onMouseMove={handleSvgMouseMove}
          onMouseLeave={() => setHoveredIdx(0)}
        >
          <defs>
            <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                className="cost-curve-gradient-start"
                stopColor="var(--amber)"
                stopOpacity="0.28"
              />
              <stop
                offset="100%"
                className="cost-curve-gradient-end"
                stopColor="var(--amber)"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <motion.path
            d={geometry.areaD}
            fill="url(#costGrad)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
          />

          {/* Cyan Dashed Milestone Line */}
          <motion.line
            x1={geometry.milestoneX}
            y1="14"
            x2={geometry.milestoneX}
            y2="192"
            stroke="var(--cyan)"
            strokeWidth="1.5"
            strokeDasharray="3 4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          />

          {/* Animated Curve Trace Line */}
          <motion.path
            d={geometry.lineD}
            fill="none"
            stroke="var(--amber)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
          />

          {/* Active Hover Crosshair and Dot */}
          {activeCoord && (
            <g className="pointer-events-none">
              <line
                x1={activeCoord.x}
                y1="14"
                x2={activeCoord.x}
                y2="192"
                stroke="var(--mist-dim)"
                strokeWidth="1"
                strokeDasharray="2 2"
                opacity="0.5"
              />
              <circle
                cx={activeCoord.x}
                cy={activeCoord.y}
                r="4"
                fill="var(--amber)"
                stroke="var(--ink-850)"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {/* Liquid-Glass Telemetry Tooltip on Hover */}
        {activeCoord && activePoint && (
          <div
            className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full px-3 py-2 rounded-lg bg-[var(--ink-800)]/95 backdrop-blur-xl border border-[var(--line)] text-left space-y-1 transition-all"
            style={{
              left: `${(activeCoord.x / 560) * 100}%`,
              top: `${Math.max(20, (activeCoord.y / 200) * 100 - 15)}%`,
            }}
          >
            <div className="flex items-center justify-between gap-3 text-[10px] font-mono text-[var(--mist-dim)] uppercase">
              <span className="font-bold text-[var(--paper)]">{activePoint.month}</span>
              {activePoint.milestone && (
                <span className="text-[var(--cyan)] truncate max-w-[140px]">
                  {activePoint.milestone}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs font-mono tabular-nums">
              <span className="text-[var(--amber)] font-bold">${activePoint.optimized}K</span>
              <span className="text-[var(--mist-dim)] line-through">${activePoint.baseline}K</span>
              <span className="text-[var(--live)] font-semibold text-[10px]">
                −${activePoint.baseline - activePoint.optimized}K
              </span>
            </div>
          </div>
        )}

        {/* Bottom-Right Tag (Image 1 Parity) */}
        <div className="absolute right-6 bottom-4 text-right pointer-events-none space-y-0.5">
          <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[var(--amber)] block">
            {monthlyDeltaDisplay}
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[var(--amber)] block font-semibold">
            AFTER OPTIMISATION
          </span>
        </div>
      </section>

      {/* Readout Telemetry Figures */}
      <figcaption className="grid grid-cols-2 border-t border-[var(--line)] bg-[var(--ink-800)]/40">
        <div className="p-4 sm:p-6 border-r border-[var(--line)]">
          <strong className="block font-mono text-2xl sm:text-4xl font-bold tracking-tight text-[var(--paper)] tabular-nums">
            {annualSavingsDisplay}
          </strong>
          <small className="block mt-1 text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-[var(--mist-dim)]">
            ANNUAL CLOUD SAVINGS
          </small>
        </div>

        <div className="p-4 sm:p-6">
          <strong className="block font-mono text-2xl sm:text-4xl font-bold tracking-tight text-[var(--paper)] tabular-nums">
            −{mttrReductionPercent}%
          </strong>
          <small className="block mt-1 text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-[var(--mist-dim)]">
            FASTER INCIDENT RESOLUTION
          </small>
        </div>
      </figcaption>
    </figure>
  );
}
