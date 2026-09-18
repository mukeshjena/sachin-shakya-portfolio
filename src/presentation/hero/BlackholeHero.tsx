// presentation/hero/BlackholeHero.tsx
// Sci-Fi Mission Control Hero Component.
// Composes Three.js Blackhole canvas, Framer Motion entrance choreographies, and executive telemetry.
// Strictly adheres to shadow-free surfaces, Cupertino outline icons, and zero emojis.

import { motion } from "framer-motion";
import {
  IoArrowForwardOutline,
  IoDocumentTextOutline,
  IoPulseOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import { useBlackholeHeroLogic } from "./BlackholeHero.hooks";
import {
  HERO_ANIMATION_VARIANTS,
  HERO_FALLBACK_CONTENT,
  HERO_INFRA_BADGES,
  HERO_KEY_METRICS,
} from "./constants/hero.constants";

export function BlackholeHero() {
  const { content, isReducedMotion, canvasRef, containerRef } = useBlackholeHeroLogic();

  return (
    <section
      id="top"
      ref={containerRef}
      aria-label="Mission Control Hero"
      className="relative min-h-[90vh] md:min-h-screen w-full flex items-center justify-center overflow-hidden pt-6 pb-20 md:py-24"
    >
      {/* Three.js Accretion Particle Field Canvas (or static fallback for reduced-motion) */}
      {!isReducedMotion ? (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none -z-10"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_30%,rgba(73,199,232,0.12),transparent_70%)]"
        />
      )}

      {/* Subtle Hairline Grid Overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(130,180,200,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(130,180,200,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-6 w-full">
        <motion.div
          variants={HERO_ANIMATION_VARIANTS.container}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center"
        >
          {/* Left Column (7 cols): Executive Command & Telemetry */}
          <div className="lg:col-span-7 space-y-7">
            {/* Mission Eyebrow Telemetry Beacon */}
            <motion.div variants={HERO_ANIMATION_VARIANTS.item}>
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[var(--ink-850)]/90 border border-[var(--line)] select-none">
                <span
                  className="w-2 h-2 rounded-full bg-[var(--amber)] animate-pulse"
                  aria-hidden="true"
                />
                <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--amber)] font-semibold">
                  {content.eyebrow}
                </span>
                <span className="text-[11px] text-[var(--line)]">|</span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--mist-dim)] hidden sm:inline">
                  {HERO_FALLBACK_CONTENT.statusTag}
                </span>
              </div>
            </motion.div>

            {/* Monumental Headline */}
            <motion.div variants={HERO_ANIMATION_VARIANTS.item}>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--paper)] leading-[1.08]">
                {content.headline}
              </h1>
            </motion.div>

            {/* Technical Subheadline */}
            <motion.div variants={HERO_ANIMATION_VARIANTS.item}>
              <p className="text-sm sm:text-base text-[var(--mist)] leading-relaxed max-w-2xl">
                {content.subheadline}
              </p>
            </motion.div>

            {/* 3 Key Operational Telemetry Metric Cards */}
            <motion.div
              variants={HERO_ANIMATION_VARIANTS.item}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1"
            >
              {HERO_KEY_METRICS.map((metric) => (
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

            {/* Dual CTA Action Controls */}
            <motion.div
              variants={HERO_ANIMATION_VARIANTS.item}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2"
            >
              <a
                href="#telemetry"
                className="px-5 py-3 rounded-xl bg-[var(--amber)] text-[var(--ink-900)] font-semibold text-xs sm:text-sm uppercase tracking-wider hover:bg-[var(--amber-deep)] active:translate-y-px transition-all flex items-center justify-center gap-2 cursor-pointer select-none whitespace-nowrap"
              >
                <span>{content.ctaPrimary}</span>
                <IoArrowForwardOutline className="w-4 h-4" aria-hidden="true" />
              </a>

              <a
                href={content.resumePdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-[var(--ink-800)] text-[var(--paper)] border border-[var(--line)] hover:border-[var(--cyan)] text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer select-none whitespace-nowrap"
              >
                <IoDocumentTextOutline className="w-4 h-4 text-[var(--cyan)]" aria-hidden="true" />
                <span>{content.ctaSecondary}</span>
              </a>
            </motion.div>

            {/* Infrastructure Technology Badges */}
            <motion.div
              variants={HERO_ANIMATION_VARIANTS.item}
              className="pt-2 flex flex-wrap items-center gap-2 select-none"
            >
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--mist-dim)] mr-1">
                STACK:
              </span>
              {HERO_INFRA_BADGES.map((badge) => (
                <span
                  key={badge}
                  className="px-2.5 py-1 rounded-lg bg-[var(--ink-800)]/80 border border-[var(--line-soft)] text-[11px] font-mono text-[var(--mist)]"
                >
                  {badge}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right Column (5 cols): Precision Telemetry Portrait Frame */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div
              variants={HERO_ANIMATION_VARIANTS.item}
              className="relative w-full max-w-sm sm:max-w-md p-3.5 rounded-2xl bg-[var(--ink-850)]/80 backdrop-blur-xl border border-[var(--line)] space-y-3"
            >
              {/* Header Status Beacon */}
              <div className="flex items-center justify-between px-1 border-b border-[var(--line-soft)] pb-2.5 text-[10px] font-mono text-[var(--mist-dim)]">
                <div className="flex items-center gap-2">
                  <IoShieldCheckmarkOutline
                    className="w-4 h-4 text-[var(--live)]"
                    aria-hidden="true"
                  />
                  <span className="text-[var(--paper)] font-semibold">VERIFIED IDENTITY</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <IoPulseOutline
                    className="w-3.5 h-3.5 text-[var(--cyan)] animate-pulse"
                    aria-hidden="true"
                  />
                  <span>ONLINE {"//"} CLOUD OPS</span>
                </div>
              </div>

              {/* Portrait Image Container */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[var(--ink-900)] border border-[var(--line)]">
                <img
                  src={content.heroPhotoUrl}
                  alt="Sachin Shakya — Lead Cloud Architect"
                  className="w-full h-full object-cover object-top"
                />

                {/* Subtle Radial Vignette */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(6,18,26,0.6)_100%)] pointer-events-none"
                />

                {/* Bottom Overlay Pill */}
                <div className="absolute bottom-3 inset-x-3 p-2.5 rounded-xl bg-[var(--ink-900)]/90 backdrop-blur-md border border-[var(--line)] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-xs font-bold text-[var(--paper)] block uppercase tracking-tight">
                      Sachin Shakya
                    </span>
                    <span className="text-[10px] font-mono text-[var(--cyan)] block uppercase">
                      FinOps &bull; Multi-Cloud
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-[var(--mist-dim)] block uppercase">
                      EXPERIENCE
                    </span>
                    <span className="text-xs font-mono font-bold text-[var(--amber)] tabular-nums block">
                      8+ YEARS
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Telemetry Footer */}
              <div className="px-1 pt-1 flex items-center justify-between text-[10px] font-mono text-[var(--mist-dim)] select-none">
                <span>FARIDABAD {"//"} GLOBAL DELIVERY</span>
                <span className="text-[var(--live)] font-semibold">ACTIVE STATUS</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
