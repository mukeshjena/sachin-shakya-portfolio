// presentation/sections/telemetry/TelemetrySection.tsx
// State-of-the-art FinOps & Cloud Telemetry Command Center.
// Declarative view template composing KPI counters and interactive multi-graph suite.
// Strictly shadow-free, monospaced tabular figures, and zero emojis.

import { motion } from "framer-motion";
import { AutomationGainsChart } from "./charts/finops/AutomationGainsChart";
import { CostTrajectoryChart } from "./charts/finops/CostTrajectoryChart";
import { FleetDistributionChart } from "./charts/fleet/FleetDistributionChart";
import { MttrBenchmarkChart } from "./charts/fleet/MttrBenchmarkChart";
import {
  TELEMETRY_ANIMATION_VARIANTS,
  TELEMETRY_COPY,
  TELEMETRY_KPIS,
} from "./constants/telemetry.constants";
import { useTelemetrySectionLogic } from "./TelemetrySection.hooks";
import type { TelemetryTabKey } from "./TelemetrySection.types";

export function TelemetrySection() {
  const { activeTab, setActiveTab } = useTelemetrySectionLogic();

  const tabOptions: readonly { key: TelemetryTabKey; label: string }[] = [
    { key: "spend", label: TELEMETRY_COPY.tabs.spend },
    { key: "mttr", label: TELEMETRY_COPY.tabs.mttr },
    { key: "automation", label: TELEMETRY_COPY.tabs.automation },
    { key: "fleet", label: TELEMETRY_COPY.tabs.fleet },
  ];

  return (
    <section
      id="telemetry"
      aria-label="CloudOps and Infrastructure Telemetry Command Center"
      className="relative w-full py-16 md:py-24 scroll-mt-20 bg-[var(--ink-900)] border-t border-[var(--line)] flex items-center justify-center overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 space-y-12">
        {/* Section Header */}
        <motion.div
          variants={TELEMETRY_ANIMATION_VARIANTS.container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="space-y-4 max-w-3xl"
        >
          <motion.div variants={TELEMETRY_ANIMATION_VARIANTS.item}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--ink-850)] border border-[var(--line)] select-none">
              <span className="w-2 h-2 rounded-full bg-[var(--amber)]" aria-hidden="true" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--amber)] font-semibold">
                {TELEMETRY_COPY.eyebrow}
              </span>
            </div>
          </motion.div>

          <motion.div variants={TELEMETRY_ANIMATION_VARIANTS.item}>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--paper)] leading-[1.08]">
              {TELEMETRY_COPY.headline}
            </h2>
          </motion.div>

          <motion.div variants={TELEMETRY_ANIMATION_VARIANTS.item}>
            <p className="text-sm sm:text-base text-[var(--mist)] leading-relaxed font-sans">
              {TELEMETRY_COPY.subheadline}
            </p>
          </motion.div>
        </motion.div>

        {/* 4 Executive KPI Cards */}
        <motion.div
          variants={TELEMETRY_ANIMATION_VARIANTS.container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {TELEMETRY_KPIS.map((kpi) => (
            <motion.div
              key={kpi.label}
              variants={TELEMETRY_ANIMATION_VARIANTS.item}
              className="p-5 rounded-2xl bg-[var(--ink-850)]/90 border border-[var(--line)] hover:border-[var(--line-soft)] transition-colors space-y-2 select-none"
            >
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-[var(--mist-dim)] uppercase tracking-wider">{kpi.label}</span>
                <span
                  className={`font-semibold px-2 py-0.5 rounded ${
                    kpi.accent === "amber"
                      ? "bg-[var(--amber)]/10 text-[var(--amber)] border border-[var(--amber)]/20"
                      : kpi.accent === "cyan"
                        ? "bg-[var(--cyan)]/10 text-[var(--cyan)] border border-[var(--cyan)]/20"
                        : "bg-[var(--live)]/10 text-[var(--live)] border border-[var(--live)]/20"
                  }`}
                >
                  {kpi.change}
                </span>
              </div>

              <div className="text-3xl sm:text-4xl font-mono font-bold text-[var(--paper)] tracking-tight tabular-nums">
                <span
                  className={
                    kpi.accent === "amber"
                      ? "text-[var(--amber)]"
                      : kpi.accent === "cyan"
                        ? "text-[var(--cyan)]"
                        : "text-[var(--live)]"
                  }
                >
                  {kpi.value}
                </span>
              </div>

              <p className="text-xs text-[var(--mist)] leading-snug font-sans">{kpi.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Interactive Multi-Chart Suite Container */}
        <div className="space-y-6">
          {/* Tab Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[var(--ink-850)] border border-[var(--line)] max-w-fit select-none">
            {tabOptions.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3.5 py-1.5 rounded-lg text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? "bg-[var(--amber)] text-[#06121a] font-bold border border-[var(--amber)]"
                      : "text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--ink-800)]/70 border border-transparent"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Active Chart View */}
          <div className="w-full">
            {activeTab === "spend" && <CostTrajectoryChart />}
            {activeTab === "mttr" && <MttrBenchmarkChart />}
            {activeTab === "automation" && <AutomationGainsChart />}
            {activeTab === "fleet" && <FleetDistributionChart />}
          </div>
        </div>
      </div>
    </section>
  );
}
