// presentation/sections/experience/ExperienceSection.tsx
// Alternating Enterprise Experience Timeline Section (DIIRA reference layout).
// Strictly adheres to shadow-free surfaces, monospaced tabular figures, and zero emojis.

import { motion } from "framer-motion";
import { TechIcon } from "../../shared/tech-icons/TechIcon";
import { EXPERIENCE_ANIMATION_VARIANTS, EXPERIENCE_COPY } from "./constants/experience.constants";
import { useExperienceSectionLogic } from "./ExperienceSection.hooks";

export function ExperienceSection() {
  const { roles, activeRoleId, setActiveRoleId } = useExperienceSectionLogic();

  return (
    <section
      id="experience"
      aria-label="Enterprise Experience Timeline"
      className="relative w-full py-16 md:py-24 scroll-mt-20 bg-[var(--ink-900)] border-t border-[var(--line)] flex items-center justify-center overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 space-y-16">
        {/* Section Header */}
        <motion.div
          variants={EXPERIENCE_ANIMATION_VARIANTS.container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="space-y-4 max-w-3xl"
        >
          <motion.div variants={EXPERIENCE_ANIMATION_VARIANTS.item}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--ink-850)] border border-[var(--line)] select-none">
              <span className="w-2 h-2 rounded-full bg-[var(--amber)]" aria-hidden="true" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--amber)] font-semibold">
                {EXPERIENCE_COPY.eyebrow}
              </span>
            </div>
          </motion.div>

          <motion.div variants={EXPERIENCE_ANIMATION_VARIANTS.item}>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--paper)] leading-[1.08]">
              {EXPERIENCE_COPY.headline}
            </h2>
          </motion.div>

          <motion.div variants={EXPERIENCE_ANIMATION_VARIANTS.item}>
            <p className="text-sm sm:text-base text-[var(--mist)] leading-relaxed font-sans">
              {EXPERIENCE_COPY.subheadline}
            </p>
          </motion.div>
        </motion.div>

        {/* Alternating Timeline Container */}
        <div className="relative">
          {/* Central Timeline Spine (Desktop) */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute left-1/2 top-4 bottom-4 w-px bg-[var(--line)] -translate-x-1/2"
          />

          {/* Left Timeline Spine (Mobile) */}
          <div
            aria-hidden="true"
            className="md:hidden absolute left-4 top-4 bottom-4 w-px bg-[var(--line)]"
          />

          <motion.div
            variants={EXPERIENCE_ANIMATION_VARIANTS.container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="space-y-12 md:space-y-16"
          >
            {roles.map((role, index) => {
              const isEven = index % 2 === 0;
              const isHovered = activeRoleId === role.id;
              const stepNumber = String(index + 1).padStart(2, "0");

              return (
                <motion.div
                  key={role.id}
                  variants={EXPERIENCE_ANIMATION_VARIANTS.item}
                  className="relative group"
                  onMouseEnter={() => setActiveRoleId(role.id)}
                  onMouseLeave={() => setActiveRoleId(null)}
                >
                  {/* Central Node Marker (Desktop) */}
                  <div
                    aria-hidden="true"
                    className={`hidden md:flex absolute left-1/2 top-8 -translate-x-1/2 z-10 w-9 h-9 rounded-full border transition-all items-center justify-center font-mono text-xs font-bold select-none ${
                      isHovered
                        ? "bg-[var(--amber)] text-[#06121a] border-[var(--amber)] ring-4 ring-[var(--amber)]/20"
                        : "bg-[var(--ink-850)] text-[var(--mist)] border-[var(--line)] group-hover:border-[var(--amber)] group-hover:text-[var(--amber)]"
                    }`}
                  >
                    {stepNumber}
                  </div>

                  {/* Mobile Node Marker */}
                  <div
                    aria-hidden="true"
                    className={`md:hidden absolute left-2.5 top-6 z-10 w-3 h-3 rounded-full border-2 transition-all select-none ${
                      isHovered
                        ? "bg-[var(--amber)] border-[var(--amber)]"
                        : "bg-[var(--ink-900)] border-[var(--amber)]"
                    }`}
                  />

                  {/* 2-Column Alternating Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pl-10 md:pl-0 items-start">
                    {/* Left Slot */}
                    {isEven ? (
                      <div className="md:pr-12">
                        <div
                          className={`p-6 sm:p-7 rounded-2xl border transition-all ${
                            isHovered
                              ? "bg-[var(--ink-850)] border-[var(--amber)]/60"
                              : "bg-[var(--ink-850)]/90 border-[var(--line)] hover:border-[var(--line-soft)]"
                          }`}
                        >
                          {/* Role Header */}
                          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 border-b border-[var(--line-soft)]">
                            <div>
                              <h3 className="text-lg sm:text-xl font-bold text-[var(--paper)] tracking-tight">
                                {role.company}
                              </h3>
                              <div className="text-sm font-semibold text-[var(--cyan)] pt-0.5">
                                {role.roleTitle}
                              </div>
                              <div className="text-[11px] font-mono text-[var(--mist-dim)] pt-0.5">
                                {role.location}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 select-none self-start sm:self-auto">
                              {role.headlineMetric && (
                                <span className="px-2.5 py-1 rounded-lg bg-[var(--ink-800)] border border-[var(--amber)]/30 text-[var(--amber)] font-mono text-[11px] font-bold tabular-nums">
                                  {role.headlineMetric}
                                </span>
                              )}
                              <span className="px-2.5 py-1 rounded-full bg-[var(--ink-800)] border border-[var(--line)] text-[10px] font-mono font-semibold text-[var(--mist)] uppercase tracking-wider tabular-nums">
                                {role.period}
                              </span>
                            </div>
                          </div>

                          {/* Bullets */}
                          <ul className="pt-4 space-y-2 text-xs sm:text-sm text-[var(--mist)] leading-relaxed font-sans">
                            {role.bullets.map((bullet) => (
                              <li key={bullet} className="flex items-start gap-2.5">
                                <span
                                  className="w-1.5 h-1.5 rounded-full bg-[var(--amber)] mt-2 flex-shrink-0"
                                  aria-hidden="true"
                                />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>

                          {/* Tech Stack Pills with Icons */}
                          <div className="pt-4 border-t border-[var(--line-soft)] mt-4 flex flex-wrap items-center gap-1.5 select-none">
                            {role.techStack.map((tech) => (
                              <span
                                key={tech}
                                className="px-2 py-0.5 rounded bg-[var(--ink-800)] border border-[var(--line)] text-[11px] font-mono text-[var(--mist)] flex items-center gap-1.5"
                              >
                                <TechIcon name={tech} className="w-3 h-3 text-[var(--cyan)]" />
                                <span>{tech}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="hidden md:flex flex-col items-end justify-center pr-12 pt-8 select-none">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--mist-dim)]">
                          DEPLOYMENT TIMELINE
                        </span>
                        <span className="text-xl font-mono font-bold text-[var(--paper)] mt-1">
                          {role.period}
                        </span>
                        {role.headlineMetric && (
                          <span className="mt-2 text-xs font-mono text-[var(--amber)] font-semibold px-2.5 py-1 rounded-full bg-[var(--ink-850)] border border-[var(--amber)]/20">
                            {role.headlineMetric}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Right Slot */}
                    {!isEven ? (
                      <div className="md:pl-12">
                        <div
                          className={`p-6 sm:p-7 rounded-2xl border transition-all ${
                            isHovered
                              ? "bg-[var(--ink-850)] border-[var(--amber)]/60"
                              : "bg-[var(--ink-850)]/90 border-[var(--line)] hover:border-[var(--line-soft)]"
                          }`}
                        >
                          {/* Role Header */}
                          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 border-b border-[var(--line-soft)]">
                            <div>
                              <h3 className="text-lg sm:text-xl font-bold text-[var(--paper)] tracking-tight">
                                {role.company}
                              </h3>
                              <div className="text-sm font-semibold text-[var(--cyan)] pt-0.5">
                                {role.roleTitle}
                              </div>
                              <div className="text-[11px] font-mono text-[var(--mist-dim)] pt-0.5">
                                {role.location}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 select-none self-start sm:self-auto">
                              {role.headlineMetric && (
                                <span className="px-2.5 py-1 rounded-lg bg-[var(--ink-800)] border border-[var(--amber)]/30 text-[var(--amber)] font-mono text-[11px] font-bold tabular-nums">
                                  {role.headlineMetric}
                                </span>
                              )}
                              <span className="px-2.5 py-1 rounded-full bg-[var(--ink-800)] border border-[var(--line)] text-[10px] font-mono font-semibold text-[var(--mist)] uppercase tracking-wider tabular-nums">
                                {role.period}
                              </span>
                            </div>
                          </div>

                          {/* Bullets */}
                          <ul className="pt-4 space-y-2 text-xs sm:text-sm text-[var(--mist)] leading-relaxed font-sans">
                            {role.bullets.map((bullet) => (
                              <li key={bullet} className="flex items-start gap-2.5">
                                <span
                                  className="w-1.5 h-1.5 rounded-full bg-[var(--amber)] mt-2 flex-shrink-0"
                                  aria-hidden="true"
                                />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>

                          {/* Tech Stack Pills with Icons */}
                          <div className="pt-4 border-t border-[var(--line-soft)] mt-4 flex flex-wrap items-center gap-1.5 select-none">
                            {role.techStack.map((tech) => (
                              <span
                                key={tech}
                                className="px-2 py-0.5 rounded bg-[var(--ink-800)] border border-[var(--line)] text-[11px] font-mono text-[var(--mist)] flex items-center gap-1.5"
                              >
                                <TechIcon name={tech} className="w-3 h-3 text-[var(--cyan)]" />
                                <span>{tech}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="hidden md:flex flex-col items-start justify-center pl-12 pt-8 select-none">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--mist-dim)]">
                          DEPLOYMENT TIMELINE
                        </span>
                        <span className="text-xl font-mono font-bold text-[var(--paper)] mt-1">
                          {role.period}
                        </span>
                        {role.headlineMetric && (
                          <span className="mt-2 text-xs font-mono text-[var(--amber)] font-semibold px-2.5 py-1 rounded-full bg-[var(--ink-850)] border border-[var(--amber)]/20">
                            {role.headlineMetric}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
