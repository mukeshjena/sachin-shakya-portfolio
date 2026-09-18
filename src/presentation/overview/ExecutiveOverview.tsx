// presentation/overview/ExecutiveOverview.tsx
// Executive Overview and Architecture Impact Section.
// Preserves Sachin Shakya's verified identity, key operational telemetry, and résumé action.
// Strictly adheres to shadow-free surfaces, Cupertino outline icons, and zero emojis.

import { motion } from "framer-motion";
import { FaAws } from "react-icons/fa6";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { SiDatadog, SiKubernetes, SiTerraform } from "react-icons/si";
import { VscAzure } from "react-icons/vsc";
import {
  type InfraBadgeIconKey,
  OVERVIEW_ANIMATION_VARIANTS,
  OVERVIEW_INFRA_BADGES,
  OVERVIEW_KEY_METRICS,
} from "./constants/overview.constants";
import { useExecutiveOverviewLogic } from "./ExecutiveOverview.hooks";

function getStackBadgeIcon(iconKey: InfraBadgeIconKey) {
  switch (iconKey) {
    case "azure":
      return <VscAzure className="w-3.5 h-3.5 text-[#0078d4]" aria-hidden="true" />;
    case "aws":
      return <FaAws className="w-3.5 h-3.5 text-[var(--amber)]" aria-hidden="true" />;
    case "k8s":
      return <SiKubernetes className="w-3.5 h-3.5 text-[#326ce5]" aria-hidden="true" />;
    case "terraform":
      return <SiTerraform className="w-3.5 h-3.5 text-[#844fba]" aria-hidden="true" />;
    case "datadog":
      return <SiDatadog className="w-3.5 h-3.5 text-[#632ca6]" aria-hidden="true" />;
    case "finops":
      return (
        <IoShieldCheckmarkOutline className="w-3.5 h-3.5 text-[var(--live)]" aria-hidden="true" />
      );
    default:
      return null;
  }
}

export function ExecutiveOverview() {
  const { content } = useExecutiveOverviewLogic();

  return (
    <section
      id="impact"
      aria-label="Professional Architecture Impact"
      className="relative w-full py-16 md:py-24 scroll-mt-20 border-t border-[var(--line)] flex items-center justify-center overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <motion.div
          variants={OVERVIEW_ANIMATION_VARIANTS.container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center"
        >
          {/* Left Column (7 cols): Architecture Impact & Highlights */}
          <div className="lg:col-span-7 space-y-7">
            {/* Monumental Impact Headline */}
            <motion.div variants={OVERVIEW_ANIMATION_VARIANTS.item}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--paper)] leading-tight">
                {content.headline}
              </h2>
            </motion.div>

            {/* Technical Subheadline */}
            <motion.div variants={OVERVIEW_ANIMATION_VARIANTS.item}>
              <p className="text-sm sm:text-base text-[var(--mist)] leading-relaxed max-w-2xl">
                {content.subheadline}
              </p>
            </motion.div>

            {/* 3 Key Operational Telemetry Metric Cards */}
            <motion.div
              variants={OVERVIEW_ANIMATION_VARIANTS.item}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1"
            >
              {OVERVIEW_KEY_METRICS.map((metric) => (
                <div
                  key={metric.label}
                  className="p-3.5 rounded-xl bg-[var(--ink-850)]/85 backdrop-blur-md border border-[var(--line)] space-y-1 select-none"
                >
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--mist-dim)] block">
                    {metric.label}
                  </span>
                  <div className="text-xl sm:text-2xl font-mono font-bold text-[var(--paper)] tabular-nums">
                    <span
                      className={
                        metric.accent === "amber"
                          ? "text-[var(--amber)]"
                          : metric.accent === "cyan"
                            ? "text-[var(--cyan)]"
                            : "text-[var(--live)]"
                      }
                    >
                      {metric.value}
                    </span>
                  </div>
                  <span className="text-[11px] text-[var(--mist)] block leading-snug">
                    {metric.description}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Infrastructure Technology Badges */}
            <motion.div
              variants={OVERVIEW_ANIMATION_VARIANTS.item}
              className="pt-2 flex flex-wrap items-center gap-2 select-none"
            >
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--mist-dim)] mr-1">
                STACK:
              </span>
              {OVERVIEW_INFRA_BADGES.map((badge) => (
                <span
                  key={badge.name}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--ink-800)]/80 border border-[var(--line-soft)] text-xs font-mono text-[var(--mist)] hover:text-[var(--paper)] hover:border-[var(--line)] transition-colors"
                >
                  {getStackBadgeIcon(badge.iconKey)}
                  <span>{badge.name}</span>
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right Column (5 cols): Edge-to-Edge Portrait Frame */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div
              variants={OVERVIEW_ANIMATION_VARIANTS.item}
              className="relative w-full max-w-sm sm:max-w-md aspect-[4/5] rounded-2xl overflow-hidden bg-[#050508] border border-[var(--line)]"
            >
              <img
                src={content.heroPhotoUrl}
                alt="Sachin Shakya — Technical Lead CloudOps"
                className="w-full h-full object-cover object-top"
              />

              {/* Subtle Radial Vignette */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.65)_100%)] pointer-events-none"
              />

              {/* Bottom Overlay Pill (No Dot, Clean Identity) */}
              <div className="absolute bottom-3 inset-x-3 p-3 rounded-xl bg-black/85 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs select-none">
                <div>
                  <span className="text-xs font-bold text-white block uppercase tracking-tight">
                    Sachin Shakya
                  </span>
                  <span className="text-[10px] font-mono text-[var(--cyan)] block uppercase">
                    Technical Lead CloudOps
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-white/60 block uppercase">
                    EXPERIENCE
                  </span>
                  <span className="text-xs font-mono font-bold text-[var(--amber)] tabular-nums block">
                    ~9 YEARS
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
