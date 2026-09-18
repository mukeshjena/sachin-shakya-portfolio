// presentation/sections/telemetry/charts/CostTrajectoryChart.tsx
// Signature Animated FinOps Cost Optimization Curve Console (parity with original design).
// Strictly adheres to shadow-free surfaces, monospaced tabular figures, and zero emojis.

import { motion } from "framer-motion";

export function CostTrajectoryChart() {
  return (
    <figure className="w-full rounded-2xl border border-[var(--line)] bg-[var(--ink-850)] overflow-hidden select-none m-0">
      {/* Console Top Header */}
      <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-[var(--line)] text-[11px] font-mono tracking-widest uppercase text-[var(--mist-dim)] bg-[var(--ink-900)]/60">
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
      <div className="relative p-4 sm:p-6 pb-2">
        {/* Top-Left Tag */}
        <span className="absolute left-6 top-5 text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[var(--mist-dim)] font-medium">
          Monthly cloud spend
        </span>

        {/* Scalable SVG Curve */}
        <svg
          viewBox="0 0 560 200"
          className="w-full h-auto overflow-visible"
          role="img"
          aria-label="Line chart showing monthly Azure cloud spend falling steeply after the cost-optimisation programme and holding at the lower level."
        >
          <defs>
            <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffb020" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#ffb020" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <motion.path
            d="M8,52 C60,44 96,70 132,62 S196,40 236,58 C268,74 288,124 330,136 S404,152 448,148 C492,144 524,152 552,150 L552,192 L8,192 Z"
            fill="url(#costGrad)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.8 }}
          />

          {/* Cyan Dashed Milestone Line */}
          <motion.line
            x1="262"
            y1="14"
            x2="262"
            y2="192"
            stroke="var(--cyan)"
            strokeWidth="1.5"
            strokeDasharray="3 4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.75 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1.4 }}
          />

          {/* Animated Curve Trace Line */}
          <motion.path
            d="M8,52 C60,44 96,70 132,62 S196,40 236,58 C268,74 288,124 330,136 S404,152 448,148 C492,144 524,152 552,150"
            fill="none"
            stroke="var(--amber)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.2, ease: [0.4, 0, 0.2, 1] }}
          />
        </svg>

        {/* Bottom-Right Tag */}
        <div className="absolute right-6 bottom-4 text-right">
          <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--amber)] block">
            −$170K / month
          </span>
          <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-[var(--mist-dim)] block">
            after optimisation
          </span>
        </div>
      </div>

      {/* Readout Telemetry Figures */}
      <figcaption className="grid grid-cols-2 border-t border-[var(--line)] bg-[var(--ink-900)]/40">
        <div className="p-4 sm:p-6 border-r border-[var(--line)]">
          <strong className="block font-mono text-2xl sm:text-4xl font-bold tracking-tight text-[var(--paper)] tabular-nums">
            $2M
          </strong>
          <small className="block mt-1 text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-[var(--mist-dim)]">
            Annual cloud savings
          </small>
        </div>

        <div className="p-4 sm:p-6">
          <strong className="block font-mono text-2xl sm:text-4xl font-bold tracking-tight text-[var(--paper)] tabular-nums">
            −40%
          </strong>
          <small className="block mt-1 text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-[var(--mist-dim)]">
            Faster incident resolution
          </small>
        </div>
      </figcaption>
    </figure>
  );
}
