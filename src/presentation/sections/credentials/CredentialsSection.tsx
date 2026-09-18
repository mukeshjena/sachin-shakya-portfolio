// presentation/sections/credentials/CredentialsSection.tsx
// Industry Certifications, Academic Education & Enterprise Honors Section.
// Strictly adheres to shadow-free surfaces, monospaced tabular figures, and zero emojis.

import { motion } from "framer-motion";
import { FaAws } from "react-icons/fa6";
import { IoSchoolOutline, IoShieldCheckmarkOutline, IoTrophyOutline } from "react-icons/io5";
import { VscAzure } from "react-icons/vsc";
import { useCredentialsSectionLogic } from "./CredentialsSection.hooks";
import {
  CREDENTIALS_ANIMATION_VARIANTS,
  CREDENTIALS_COPY,
} from "./constants/credentials.constants";

function getCertIcon(code: string) {
  if (code.startsWith("CLF")) {
    return <FaAws className="w-4 h-4 text-[var(--amber)] shrink-0" aria-hidden="true" />;
  }
  if (code.startsWith("ITIL")) {
    return (
      <IoShieldCheckmarkOutline
        className="w-4 h-4 text-[var(--live)] shrink-0"
        aria-hidden="true"
      />
    );
  }
  return <VscAzure className="w-4 h-4 text-[#0078d4] shrink-0" aria-hidden="true" />;
}

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
              <span className="w-2 h-2 rounded-full bg-[var(--amber)]" aria-hidden="true" />
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

        {/* 2-Column Responsive Grid With Level Bottoms */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column (7 cols): Industry Certifications */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--mist-dim)] font-semibold pb-2 border-b border-[var(--line-soft)] select-none">
                {CREDENTIALS_COPY.certificationsHeading}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4">
                {certifications.map((cert) => (
                  <div
                    key={cert.code}
                    className="p-4 rounded-xl bg-[var(--ink-850)]/90 border border-[var(--line)] hover:border-[var(--line-soft)] transition-colors space-y-3 select-none flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getCertIcon(cert.code)}
                        <span
                          className="px-2 py-0.5 rounded-md font-mono text-xs font-bold border"
                          style={{
                            borderColor: cert.badgeColor,
                            color: cert.badgeColor,
                            backgroundColor: "var(--ink-800)",
                          }}
                        >
                          {cert.code}
                        </span>
                      </div>
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

            {/* Micro Verification Telemetry Footnote */}
            <div className="p-3.5 rounded-xl bg-[var(--ink-850)]/50 border border-[var(--line-soft)] flex items-center justify-between text-[11px] font-mono text-[var(--mist-dim)] select-none">
              <span>VERIFIED ENTERPRISE ARCHITECT</span>
              <span className="text-[var(--live)]">6 OF 6 ACTIVE</span>
            </div>
          </div>

          {/* Right Column (5 cols): Education & Recognition */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            {/* Academic Education */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--mist-dim)] font-semibold pb-2 border-b border-[var(--line-soft)] select-none">
                {CREDENTIALS_COPY.educationHeading}
              </h3>

              <div className="space-y-2.5">
                {education.map((edu) => (
                  <div
                    key={edu.degree}
                    className="p-3.5 rounded-xl bg-[var(--ink-850)]/90 border border-[var(--line)] space-y-1 select-none flex items-start gap-3"
                  >
                    <div className="p-1.5 rounded-lg bg-[var(--ink-800)] border border-[var(--line)] mt-0.5">
                      <IoSchoolOutline
                        className="w-3.5 h-3.5 text-[var(--cyan)]"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[var(--paper)] text-xs sm:text-sm truncate">
                          {edu.degree}
                        </span>
                        <span className="font-mono text-[var(--amber)] text-xs tabular-nums shrink-0 ml-2">
                          {edu.period}
                        </span>
                      </div>
                      <div className="text-xs text-[var(--cyan)] font-medium pt-0.5">
                        {edu.field}
                      </div>
                      <div className="text-[11px] font-mono text-[var(--mist-dim)] pt-0.5 truncate">
                        {edu.institution}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Corporate Honors & Awards */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--mist-dim)] font-semibold pb-2 border-b border-[var(--line-soft)] select-none">
                {CREDENTIALS_COPY.awardsHeading}
              </h3>

              <div className="space-y-2.5">
                {awards.map((award) => (
                  <div
                    key={award.title}
                    className="p-3.5 rounded-xl bg-[var(--ink-850)]/90 border border-[var(--line)] space-y-1 select-none flex items-start gap-3"
                  >
                    <div className="p-1.5 rounded-lg bg-[var(--ink-800)] border border-[var(--line)] mt-0.5">
                      <IoTrophyOutline
                        className="w-3.5 h-3.5 text-[var(--amber)]"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs sm:text-sm text-[var(--paper)] truncate">
                          {award.title}
                        </h4>
                        <span className="font-mono text-xs text-[var(--amber)] font-bold tabular-nums shrink-0 ml-2">
                          {award.year}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-[var(--mist-dim)]">
                        {award.organization}
                      </div>
                      <p className="text-xs text-[var(--mist)] leading-relaxed pt-0.5 font-sans line-clamp-2">
                        {award.description}
                      </p>
                    </div>
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
