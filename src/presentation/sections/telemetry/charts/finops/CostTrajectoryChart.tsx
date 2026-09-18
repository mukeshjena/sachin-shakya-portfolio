// presentation/sections/telemetry/charts/CostTrajectoryChart.tsx
// 12-Month FinOps Monthly Cloud Spend & Savings Trajectory Chart.
// Pure SVG area & dual-line chart with interactive scrubber and milestone tags.
// Strictly adheres to shadow-free surfaces, monospaced tabular figures, and zero emojis.

import { useMemo, useState } from "react";
import { MONTHLY_SPEND_SERIES } from "../../constants/telemetry.constants";

export function CostTrajectoryChart() {
  const [activeIndex, setActiveIndex] = useState<number>(MONTHLY_SPEND_SERIES.length - 1);

  // SVG Coordinate Geometry (viewBox: 0 0 800 320)
  const width = 800;
  const height = 320;
  const padding = { top: 30, right: 30, bottom: 50, left: 60 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const minVal = 200;
  const maxVal = 500;

  const points = useMemo(() => {
    return MONTHLY_SPEND_SERIES.map((pt, i) => {
      const x = padding.left + (i / (MONTHLY_SPEND_SERIES.length - 1)) * chartWidth;
      const yBaseline =
        padding.top + chartHeight - ((pt.baseline - minVal) / (maxVal - minVal)) * chartHeight;
      const yOptimized =
        padding.top + chartHeight - ((pt.optimized - minVal) / (maxVal - minVal)) * chartHeight;
      return { ...pt, x, yBaseline, yOptimized };
    });
  }, [chartWidth, chartHeight, padding.left, padding.top]);

  const baselinePath = useMemo(() => {
    return points.reduce(
      (acc, pt, i) => `${acc} ${i === 0 ? "M" : "L"} ${pt.x},${pt.yBaseline}`,
      ""
    );
  }, [points]);

  const optimizedPath = useMemo(() => {
    return points.reduce(
      (acc, pt, i) => `${acc} ${i === 0 ? "M" : "L"} ${pt.x},${pt.yOptimized}`,
      ""
    );
  }, [points]);

  const areaPath = useMemo(() => {
    if (points.length === 0) return "";
    const topForward = points.reduce(
      (acc, pt, i) => `${acc} ${i === 0 ? "M" : "L"} ${pt.x},${pt.yBaseline}`,
      ""
    );
    const bottomBackward = points
      .slice()
      .reverse()
      .reduce((acc, pt) => `${acc} L ${pt.x},${pt.yOptimized}`, "");
    return `${topForward} ${bottomBackward} Z`;
  }, [points]);

  const activePoint = points[activeIndex] || points[points.length - 1];

  return (
    <div className="w-full space-y-4 select-none">
      {/* Chart Top Metrics Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[var(--ink-850)] border border-[var(--line)] text-xs">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-[10px] font-mono text-[var(--mist-dim)] uppercase block">
              Active Timeline
            </span>
            <span className="font-mono font-bold text-sm text-[var(--paper)]">
              Month {activeIndex + 1} ({activePoint.month})
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-[var(--mist-dim)] uppercase block">
              Baseline Run-Rate
            </span>
            <span className="font-mono font-semibold text-sm text-[var(--cyan)] tabular-nums">
              ${activePoint.baseline}K/mo
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-[var(--mist-dim)] uppercase block">
              Optimized Spend
            </span>
            <span className="font-mono font-bold text-sm text-[var(--amber)] tabular-nums">
              ${activePoint.optimized}K/mo
            </span>
          </div>
        </div>

        <div className="px-3.5 py-1.5 rounded-lg bg-[var(--ink-800)] border border-[var(--amber)]/30 flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase text-[var(--mist-dim)]">
            SAVINGS DELTA:
          </span>
          <span className="font-mono font-bold text-sm text-[var(--amber)] tabular-nums">
            -${activePoint.savings}K/mo
          </span>
          {activePoint.milestone && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--amber)]/10 text-[var(--amber)] border border-[var(--amber)]/20 hidden sm:inline-block">
              {activePoint.milestone}
            </span>
          )}
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full rounded-2xl bg-[var(--ink-850)]/90 border border-[var(--line)] p-2 sm:p-4 overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
          aria-label="FinOps Monthly Cloud Spend and Savings Trajectory Chart"
        >
          <defs>
            {/* Savings Delta Gradient */}
            <linearGradient id="savingsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--amber)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--amber)" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Horizontal Hairline Gridlines & Y-Axis Ticks */}
          {[200, 300, 400, 500].map((val) => {
            const y =
              padding.top + chartHeight - ((val - minVal) / (maxVal - minVal)) * chartHeight;
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="var(--line-soft)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 12}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-[var(--mist-dim)] text-[10px] font-mono tabular-nums"
                >
                  ${val}K
                </text>
              </g>
            );
          })}

          {/* Shaded Area between Baseline and Optimized */}
          <path d={areaPath} fill="url(#savingsFill)" />

          {/* Baseline Curve (Cyan Dashed) */}
          <path
            d={baselinePath}
            fill="none"
            stroke="var(--cyan)"
            strokeWidth="2"
            strokeDasharray="5 5"
            strokeLinecap="round"
            strokeOpacity="0.85"
          />

          {/* Optimized Spend Curve (Solid Amber) */}
          <path
            d={optimizedPath}
            fill="none"
            stroke="var(--amber)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points and Interaction Bars */}
          {points.map((pt, i) => {
            const isHovered = i === activeIndex;
            return (
              // biome-ignore lint/a11y/noStaticElementInteractions: SVG element interactive scrubber
              <g
                key={pt.month}
                className="cursor-pointer focus:outline-none"
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => setActiveIndex(i)}
              >
                {/* Invisible Hover Hitbox */}
                <rect
                  x={pt.x - chartWidth / (points.length * 2)}
                  y={padding.top}
                  width={chartWidth / points.length}
                  height={chartHeight}
                  fill="transparent"
                />

                {/* Vertical Scrubber Crosshair Line on Active */}
                {isHovered && (
                  <line
                    x1={pt.x}
                    y1={padding.top}
                    x2={pt.x}
                    y2={height - padding.bottom}
                    stroke="var(--line)"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Optimized Point Ring */}
                <circle
                  cx={pt.x}
                  cy={pt.yOptimized}
                  r={isHovered ? 6 : 3.5}
                  className={`transition-all ${
                    isHovered
                      ? "fill-[var(--amber)] stroke-[var(--ink-900)] stroke-2"
                      : "fill-[var(--amber)] stroke-none"
                  }`}
                />

                {/* X-Axis Month Label */}
                <text
                  x={pt.x}
                  y={height - padding.bottom + 22}
                  textAnchor="middle"
                  className={`text-[11px] font-mono uppercase transition-colors ${
                    isHovered
                      ? "fill-[var(--amber)] font-bold"
                      : "fill-[var(--mist-dim)] font-medium"
                  }`}
                >
                  {pt.month}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="pt-2 flex flex-wrap items-center justify-between border-t border-[var(--line-soft)] text-[11px] font-mono text-[var(--mist-dim)] px-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[var(--cyan)] inline-block border-b border-dashed border-[var(--cyan)]" />
              <span>Unoptimized Baseline ($450K/mo)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 rounded-full bg-[var(--amber)] inline-block" />
              <span className="text-[var(--paper)]">Post-Optimization Trajectory ($280K/mo)</span>
            </div>
          </div>
          <div className="text-[10px] text-[var(--amber)] font-semibold">
            VERIFIED $170,000 / MONTH SAVINGS
          </div>
        </div>
      </div>
    </div>
  );
}
