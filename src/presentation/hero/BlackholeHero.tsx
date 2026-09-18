// presentation/hero/BlackholeHero.tsx
// Relativistic Kerr/Schwarzschild Raymarched Blackhole Hero Section.
// Direct 21st.dev code recreation with real-time gravitational lensing, Keplerian shear, and Doppler beaming.
// Full screen (100dvh) viewport coverage on mobile and desktop.
// Strictly adheres to shadow-free surfaces, Cupertino outline icons, and zero emojis.

import { motion } from "framer-motion";
import { IoArrowDownOutline, IoArrowForwardOutline, IoDocumentTextOutline } from "react-icons/io5";
import { useBlackholeHeroLogic } from "./BlackholeHero.hooks";
import { HERO_ANIMATION_VARIANTS, HERO_COPY } from "./constants/hero.constants";

export function BlackholeHero() {
  const { canvasRef, containerRef, resumePdfUrl } = useBlackholeHeroLogic();

  return (
    <section
      id="top"
      ref={containerRef}
      aria-label="Relativistic Black Hole Hero"
      className="relative min-h-[100dvh] h-[100dvh] w-full overflow-hidden bg-black flex flex-col justify-between"
    >
      {/* Three.js / WebGL Raymarching Accretion Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none z-0" />

      {/* Hero Foreground Content */}
      <div className="relative z-10 flex-1 flex items-start md:items-center px-6 pt-24 sm:px-10 md:pt-0 lg:px-20 max-w-7xl mx-auto w-full">
        <motion.div
          variants={HERO_ANIMATION_VARIANTS.container}
          initial="hidden"
          animate="visible"
          className="max-w-xl space-y-6 md:space-y-8"
        >
          {/* Eyebrow Telemetry Beacon */}
          <motion.div variants={HERO_ANIMATION_VARIANTS.item}>
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[var(--ink-900)]/80 backdrop-blur-md border border-[var(--line)] select-none">
              <span
                className="w-2 h-2 rounded-full bg-[var(--amber)] animate-pulse"
                aria-hidden="true"
              />
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[var(--amber)] font-semibold">
                {HERO_COPY.eyebrow}
              </span>
            </div>
          </motion.div>

          {/* Monumental Headline */}
          <motion.div variants={HERO_ANIMATION_VARIANTS.item}>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-[var(--paper)] leading-[1.04]">
              {HERO_COPY.titleLine1} <br />
              <span className="font-semibold text-white">{HERO_COPY.titleLine2}</span>
            </h1>
          </motion.div>

          {/* Physics & Infrastructure Subheadline */}
          <motion.div variants={HERO_ANIMATION_VARIANTS.item}>
            <p className="text-sm sm:text-base text-[var(--paper)]/75 leading-relaxed max-w-md font-sans">
              {HERO_COPY.subheadline}
            </p>
          </motion.div>

          {/* Dual Action CTA Controls */}
          <motion.div
            variants={HERO_ANIMATION_VARIANTS.item}
            className="flex flex-wrap items-center gap-3 pt-2"
          >
            <a
              href="#telemetry"
              className="px-6 py-3 rounded-full bg-[var(--paper)] text-[var(--ink-900)] font-semibold text-xs sm:text-sm uppercase tracking-wider hover:bg-white active:translate-y-px transition-all flex items-center justify-center gap-2 cursor-pointer select-none"
            >
              <span>{HERO_COPY.ctaPrimary}</span>
              <IoArrowForwardOutline className="w-4 h-4" aria-hidden="true" />
            </a>

            {resumePdfUrl ? (
              <a
                href={resumePdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full bg-[var(--ink-900)]/80 backdrop-blur-md text-[var(--paper)] border border-[var(--line)] hover:border-[var(--cyan)] hover:text-[var(--cyan)] text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer select-none"
              >
                <IoDocumentTextOutline className="w-4 h-4 text-[var(--cyan)]" aria-hidden="true" />
                <span>Executive Résumé</span>
              </a>
            ) : (
              <a
                href="#telemetry"
                className="px-6 py-3 rounded-full bg-[var(--ink-900)]/80 backdrop-blur-md text-[var(--paper)] border border-[var(--line)] hover:border-[var(--cyan)] hover:text-[var(--cyan)] text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer select-none"
              >
                <span>{HERO_COPY.ctaSecondary}</span>
              </a>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Scroll Indicator Cue */}
      <div className="relative z-10 pb-6 md:pb-8 flex justify-center pointer-events-none">
        <a
          href="#telemetry"
          aria-label="Scroll to telemetry"
          className="pointer-events-auto flex flex-col items-center gap-1.5 text-[var(--mist-dim)] hover:text-[var(--paper)] transition-colors select-none"
        >
          <span className="text-[10px] font-mono uppercase tracking-widest">
            {HERO_COPY.scrollPrompt}
          </span>
          <IoArrowDownOutline
            className="w-4 h-4 animate-bounce text-[var(--amber)]"
            aria-hidden="true"
          />
        </a>
      </div>
    </section>
  );
}
