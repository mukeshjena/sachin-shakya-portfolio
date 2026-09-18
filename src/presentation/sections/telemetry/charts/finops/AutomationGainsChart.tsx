// presentation/sections/telemetry/charts/AutomationGainsChart.tsx
// DevOps Automation & Manual Effort Reduction Chart.
// Compares manual operational engineering hours with automated IaC/CI-CD execution.
// Strictly shadow-free, monospaced tabular numbers, and zero emojis.

import { AUTOMATION_METRICS } from "../../constants/telemetry.constants";

export function AutomationGainsChart() {
  return (
    <div className="w-full space-y-4 select-none">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[var(--ink-850)] border border-[var(--line)] text-xs">
        <div>
          <span className="text-[10px] font-mono text-[var(--mist-dim)] uppercase block">
            Productivity Impact
          </span>
          <span className="font-mono font-bold text-sm text-[var(--paper)]">
            Engineering Effort Reduction: 35h → 8h / week
          </span>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-[var(--ink-800)] border border-[var(--amber)]/30 font-mono text-xs text-[var(--amber)] font-bold">
          30–40% TOIL ELIMINATED
        </div>
      </div>

      {/* Grid of Automation Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {AUTOMATION_METRICS.map((metric) => {
          const maxCatHours = 14;
          const manualWidth = Math.round((metric.manualHours / maxCatHours) * 100);
          const autoWidth = Math.round((metric.automatedHours / maxCatHours) * 100);

          return (
            <div
              key={metric.category}
              className="p-4 rounded-xl bg-[var(--ink-850)]/90 border border-[var(--line)] space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-sm text-[var(--paper)]">{metric.category}</h4>
                  <span className="text-[10px] font-mono text-[var(--mist-dim)] uppercase">
                    Frequency: {metric.frequency}
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-[var(--live)] tabular-nums px-2 py-0.5 rounded bg-[var(--live)]/10 border border-[var(--live)]/20">
                  -{metric.reductionPercent}%
                </span>
              </div>

              {/* Comparative Dual Bars */}
              <div className="space-y-2 pt-1">
                {/* Manual Effort */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-[var(--mist-dim)]">
                    <span>MANUAL EXECUTION</span>
                    <span className="text-[var(--cyan)] font-medium tabular-nums">
                      {metric.manualHours} hrs
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--ink-900)] overflow-hidden">
                    <div
                      className="h-full bg-[var(--cyan)]/70 rounded-full"
                      style={{ width: `${manualWidth}%` }}
                    />
                  </div>
                </div>

                {/* Automated Execution */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-[var(--mist-dim)]">
                    <span>TERRAFORM & CI/CD</span>
                    <span className="text-[var(--amber)] font-bold tabular-nums">
                      {metric.automatedHours} hrs
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--ink-900)] overflow-hidden">
                    <div
                      className="h-full bg-[var(--amber)] rounded-full"
                      style={{ width: `${autoWidth}%` }}
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
