// presentation/sections/telemetry/charts/MttrBenchmarkChart.tsx
// Incident MTTR & APM Reliability Benchmark Grouped Bar Chart.
// Compares Pre vs Post Automation MTTR in minutes across P1, P2, P3, and Fleet Avg.
// Strictly shadow-free, monospaced tabular numbers, and zero emojis.

import { MTTR_BENCHMARKS } from "../constants/telemetry.constants";

export function MttrBenchmarkChart() {
  const maxTime = 200; // max minutes on axis

  return (
    <div className="w-full space-y-4 select-none">
      {/* Top Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[var(--ink-850)] border border-[var(--line)] text-xs">
        <div>
          <span className="text-[10px] font-mono text-[var(--mist-dim)] uppercase block">
            Fleet Metric
          </span>
          <span className="font-mono font-bold text-sm text-[var(--paper)]">
            Incident Mean Time to Resolution (MTTR)
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--mist)]">
            <span className="w-2.5 h-2.5 rounded-sm bg-[var(--cyan)]" />
            <span>Pre-Automation</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--amber)]">
            <span className="w-2.5 h-2.5 rounded-sm bg-[var(--amber)]" />
            <span>Post-Automation</span>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-[var(--ink-800)] border border-[var(--live)]/30 text-[var(--live)] font-mono font-semibold text-xs">
            -40% FLEETWIDE
          </div>
        </div>
      </div>

      {/* Grid of Severity Cards with Comparison Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MTTR_BENCHMARKS.map((item) => {
          const prePercent = Math.round((item.preMinutes / maxTime) * 100);
          const postPercent = Math.round((item.postMinutes / maxTime) * 100);

          return (
            <div
              key={item.tier}
              className="p-4 rounded-xl bg-[var(--ink-850)]/90 border border-[var(--line)] hover:border-[var(--line-soft)] transition-colors space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[var(--ink-800)] border border-[var(--line)] font-mono text-xs font-bold text-[var(--amber)]">
                    {item.tier}
                  </span>
                  <span className="font-semibold text-sm text-[var(--paper)]">{item.name}</span>
                </div>
                <span className="font-mono text-xs font-bold text-[var(--live)] tabular-nums">
                  -{item.reductionPercent}% MTTR
                </span>
              </div>

              <p className="text-xs text-[var(--mist)] leading-relaxed">{item.description}</p>

              {/* Visual Comparison Bars */}
              <div className="space-y-2 pt-1">
                {/* Pre-Automation Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-[var(--mist-dim)]">
                    <span>MANUAL TRIAGE & RUNBOOKS</span>
                    <span className="text-[var(--cyan)] font-semibold tabular-nums">
                      {item.preMinutes} mins
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--ink-900)] overflow-hidden">
                    <div
                      className="h-full bg-[var(--cyan)]/80 rounded-full transition-all duration-700"
                      style={{ width: `${prePercent}%` }}
                    />
                  </div>
                </div>

                {/* Post-Automation Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-[var(--mist-dim)]">
                    <span>DATADOG APM & SELF-HEALING</span>
                    <span className="text-[var(--amber)] font-bold tabular-nums">
                      {item.postMinutes} mins
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--ink-900)] overflow-hidden">
                    <div
                      className="h-full bg-[var(--amber)] rounded-full transition-all duration-700"
                      style={{ width: `${postPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
