// presentation/sections/telemetry/charts/FleetDistributionChart.tsx
// Multi-Cloud Fleet & Workload Distribution Segmented Ring Chart.
// Visualizes 2,000+ managed cloud resources across Azure, AWS, and Hybrid links.
// Strictly shadow-free, monospaced tabular numbers, and zero emojis.

import { useState } from "react";
import { FLEET_DISTRIBUTION } from "../../constants/telemetry.constants";

export function FleetDistributionChart() {
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);

  // SVG Geometry for Donut Ring (viewBox: 0 0 260 260)
  const size = 260;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  return (
    <div className="w-full space-y-4 select-none">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[var(--ink-850)] border border-[var(--line)] text-xs">
        <div>
          <span className="text-[10px] font-mono text-[var(--mist-dim)] uppercase block">
            Cloud Infrastructure Scope
          </span>
          <span className="font-mono font-bold text-sm text-[var(--paper)]">
            Multi-Cloud Fleet: 2,000+ Managed Resources
          </span>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-[var(--ink-800)] border border-[var(--live)]/30 font-mono text-xs text-[var(--live)] font-bold">
          95%+ IAC COVERAGE
        </div>
      </div>

      {/* Grid: Donut Ring on Left/Center, Detailed Service Breakdown on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-4 sm:p-6 rounded-2xl bg-[var(--ink-850)]/90 border border-[var(--line)]">
        {/* Ring Graphic (5 cols) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-56 h-56 flex items-center justify-center">
            <svg
              viewBox={`0 0 ${size} ${size}`}
              className="w-full h-full -rotate-90 transform"
              aria-label="Multi-cloud resource distribution ring chart"
            >
              {/* Background Ring Track */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="var(--ink-900)"
                strokeWidth={strokeWidth}
              />

              {/* Segmented Donut Arcs */}
              {FLEET_DISTRIBUTION.map((item) => {
                const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -((cumulativePercent / 100) * circumference);
                cumulativePercent += item.percentage;

                const isHovered = hoveredPlatform === item.platform;

                return (
                  // biome-ignore lint/a11y/noStaticElementInteractions: SVG circle interaction
                  <circle
                    key={item.platform}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={item.colorToken}
                    strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-300 cursor-pointer focus:outline-none"
                    onMouseEnter={() => setHoveredPlatform(item.platform)}
                    onMouseLeave={() => setHoveredPlatform(null)}
                  />
                );
              })}
            </svg>

            {/* Centered Telemetry Readout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[10px] font-mono text-[var(--mist-dim)] uppercase tracking-wider">
                TOTAL FLEET
              </span>
              <span className="text-2xl font-mono font-bold text-[var(--paper)] tabular-nums">
                2,000+
              </span>
              <span className="text-[9px] font-mono text-[var(--live)] font-semibold uppercase">
                RESOURCES
              </span>
            </div>
          </div>
        </div>

        {/* Platform Breakdown Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {FLEET_DISTRIBUTION.map((item) => {
            const isHovered = hoveredPlatform === item.platform;

            return (
              <button
                type="button"
                key={item.platform}
                aria-label={`Select ${item.platform} resources`}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer focus:outline-none ${
                  isHovered
                    ? "bg-[var(--ink-800)] border-[var(--amber)]"
                    : "bg-[var(--ink-800)]/60 border-[var(--line-soft)] hover:border-[var(--line)]"
                }`}
                onMouseEnter={() => setHoveredPlatform(item.platform)}
                onMouseLeave={() => setHoveredPlatform(null)}
                onClick={() => setHoveredPlatform(item.platform)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.colorToken }}
                    />
                    <span className="font-semibold text-sm text-[var(--paper)]">
                      {item.platform}
                    </span>
                  </div>
                  <div className="font-mono text-xs tabular-nums text-right">
                    <span className="font-bold text-[var(--paper)]">{item.percentage}%</span>
                    <span className="text-[var(--mist-dim)] ml-1.5">({item.count} nodes)</span>
                  </div>
                </div>

                {/* Key Cloud Services Badges */}
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {item.keyServices.map((svc) => (
                    <span
                      key={svc}
                      className="px-2 py-0.5 rounded bg-[var(--ink-900)] border border-[var(--line-soft)] text-[10px] font-mono text-[var(--mist)]"
                    >
                      {svc}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
