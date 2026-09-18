// presentation/sections/credentials/CredentialsSection.tsx
// Industry Certifications, Academic Education & Enterprise Honors Section.
// Strictly adheres to shadow-free surfaces, monospaced tabular figures, and zero emojis.

import { motion } from "framer-motion";
import { useCredentialsSectionLogic } from "./CredentialsSection.hooks";
import {
  CREDENTIALS_ANIMATION_VARIANTS,
  CREDENTIALS_COPY,
} from "./constants/credentials.constants";

export function CredentialsSection() {
  const { certifications, education, awards } = useCredentialsSectionLogic();

  return (
    <section
      id="credentials"
      aria-label="Industry Certifications and Academic Credentials"
      className="relative w-full py-16 md:py-24 scroll-mt-20 bg-[var(--ink-900)] border-t border-[var(--line)] flex items-center justify-center overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 space-y-12">
        {/* Section Header */}
        <motion.div
          variants={CREDENTIALS_ANIMATION_VARIANTS.container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="space-y-4 max-w-3xl"
        >
          <motion.div variants={CREDENTIALS_ANIMATION_VARIANTS.item}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--ink-850)] border border-[var(--line)] select-none">
              <span
                className="w-2 h-2 rounded-full bg-[var(--amber)] animate-pulse"
                aria-hidden="true"
              />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--amber)] font-semibold">
                {CREDENTIALS_COPY.eyebrow}
              </span>
            </div>
          </motion.div>

          <motion.div variants={CREDENTIALS_ANIMATION_VARIANTS.item}>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--paper)] leading-[1.08]">
              {CREDENTIALS_COPY.headline}
            </h2>
          </motion.div>

          <motion.div variants={CREDENTIALS_ANIMATION_VARIANTS.item}>
            <p className="text-sm sm:text-base text-[var(--mist)] leading-relaxed font-sans">
              {CREDENTIALS_COPY.subheadline}
            </p>
          </motion.div>
        </motion.div>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column (7 cols): Industry Certifications */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--mist-dim)] font-semibold pb-1 border-b border-[var(--line-soft)] select-none">
              {CREDENTIALS_COPY.certificationsHeading}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {certifications.map((cert) => (
                <div
                  key={cert.code}
                  className="p-4 rounded-xl bg-[var(--ink-850)]/90 border border-[var(--line)] hover:border-[var(--line-soft)] transition-colors space-y-2 select-none flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="px-2.5 py-1 rounded-md font-mono text-xs font-bold border"
                      style={{
                        borderColor: cert.badgeColor,
                        color: cert.badgeColor,
                        backgroundColor: "var(--ink-800)",
                      }}
                    >
                      {cert.code}
                    </span>
                    <span className="text-[11px] font-mono text-[var(--mist-dim)] tabular-nums">
                      {cert.year}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-[var(--paper)] leading-snug">
                      {cert.title}
                    </h4>
                    <span className="text-[11px] font-mono text-[var(--mist-dim)] block pt-1">
                      {cert.issuer}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (5 cols): Education & Recognition */}
          <div className="lg:col-span-5 space-y-8">
            {/* Academic Education */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--mist-dim)] font-semibold pb-1 border-b border-[var(--line-soft)] select-none">
                {CREDENTIALS_COPY.educationHeading}
              </h3>

              {education.map((edu) => (
                <div
                  key={edu.degree}
                  className="p-4 rounded-xl bg-[var(--ink-850)]/90 border border-[var(--line)] space-y-1.5 select-none"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[var(--paper)] text-sm">{edu.degree}</span>
                    <span className="font-mono text-[var(--amber)] text-xs tabular-nums">
                      {edu.period}
                    </span>
                  </div>
                  <div className="text-xs text-[var(--cyan)] font-medium">{edu.field}</div>
                  <div className="text-xs font-mono text-[var(--mist-dim)] pt-0.5">
                    {edu.institution}
                  </div>
                </div>
              ))}
            </div>

            {/* Corporate Honors & Awards */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--mist-dim)] font-semibold pb-1 border-b border-[var(--line-soft)] select-none">
                {CREDENTIALS_COPY.awardsHeading}
              </h3>

              <div className="space-y-3">
                {awards.map((award) => (
                  <div
                    key={award.title}
                    className="p-4 rounded-xl bg-[var(--ink-850)]/90 border border-[var(--line)] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-[var(--paper)]">{award.title}</h4>
                      <span className="font-mono text-xs text-[var(--amber)] font-bold tabular-nums">
                        {award.year}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-[var(--mist-dim)]">
                      {award.organization}
                    </div>
                    <p className="text-xs text-[var(--mist)] leading-relaxed pt-1 font-sans">
                      {award.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
