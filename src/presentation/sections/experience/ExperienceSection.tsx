// presentation/sections/experience/ExperienceSection.tsx
// Interactive Enterprise Experience Timeline Section.
// Strictly adheres to shadow-free surfaces, monospaced tabular figures, and zero emojis.

import { motion } from "framer-motion";
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
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 space-y-12">
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
              <span
                className="w-2 h-2 rounded-full bg-[var(--amber)] animate-pulse"
                aria-hidden="true"
              />
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

        {/* Timeline Container */}
        <motion.div
          variants={EXPERIENCE_ANIMATION_VARIANTS.container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="relative pl-6 sm:pl-10 space-y-8"
        >
          {/* Vertical Timeline Spine */}
          <div
            aria-hidden="true"
            className="absolute left-2.5 sm:left-4 top-4 bottom-4 w-px bg-[var(--line)]"
          />

          {roles.map((role) => {
            const isHovered = activeRoleId === role.id;

            return (
              <motion.div
                key={role.id}
                variants={EXPERIENCE_ANIMATION_VARIANTS.item}
                className="relative space-y-3 group"
                onMouseEnter={() => setActiveRoleId(role.id)}
                onMouseLeave={() => setActiveRoleId(null)}
              >
                {/* Node Beacon on Timeline Spine */}
                <div
                  aria-hidden="true"
                  className={`absolute -left-6 sm:-left-10 top-5 w-3 h-3 rounded-full border-2 transition-all select-none ${
                    isHovered
                      ? "bg-[var(--amber)] border-[var(--amber)] ring-4 ring-[var(--amber)]/20"
                      : "bg-[var(--ink-900)] border-[var(--ink-600)] group-hover:border-[var(--amber)]"
                  }`}
                />

                {/* Role Card */}
                <div
                  className={`p-6 sm:p-7 rounded-2xl border transition-all ${
                    isHovered
                      ? "bg-[var(--ink-850)] border-[var(--amber)]/60"
                      : "bg-[var(--ink-850)]/80 border-[var(--line)] hover:border-[var(--line-soft)]"
                  }`}
                >
                  {/* Card Header: Role & Period */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2.5 pb-3 border-b border-[var(--line-soft)]">
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
                        <span className="px-2.5 py-1 rounded-lg bg-[var(--ink-800)] border border-[var(--amber)]/30 text-[var(--amber)] font-mono text-xs font-bold tabular-nums">
                          {role.headlineMetric}
                        </span>
                      )}
                      <span className="px-3 py-1 rounded-full bg-[var(--ink-800)] border border-[var(--line)] text-[11px] font-mono font-semibold text-[var(--mist)] uppercase tracking-wider tabular-nums">
                        {role.period}
                      </span>
                    </div>
                  </div>

                  {/* Bulleted Achievements */}
                  <ul className="pt-4 space-y-2.5 text-xs sm:text-sm text-[var(--mist)] leading-relaxed font-sans">
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

                  {/* Tech Stack Pills */}
                  <div className="pt-5 flex flex-wrap items-center gap-1.5 select-none">
                    <span className="text-[10px] font-mono uppercase text-[var(--mist-dim)] mr-1">
                      TECH:
                    </span>
                    {role.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-lg bg-[var(--ink-800)] border border-[var(--line-soft)] text-xs font-mono text-[var(--mist)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
