// presentation/sections/capabilities/CapabilitiesSection.tsx
// Filterable Technical Capabilities and Enterprise Competencies Grid.
// Strictly adheres to shadow-free surfaces, monospaced tabular figures, and zero emojis.

import { motion } from "framer-motion";
import { TechIcon } from "../../shared/tech-icons/TechIcon";
import { useCapabilitiesSectionLogic } from "./CapabilitiesSection.hooks";
import {
  CAPABILITIES_ANIMATION_VARIANTS,
  CAPABILITIES_COPY,
} from "./constants/capabilities.constants";

export function CapabilitiesSection() {
  const { selectedCategory, setSelectedCategory, filteredCards } = useCapabilitiesSectionLogic();

  return (
    <section
      id="capabilities"
      aria-label="Technical Capabilities and Competencies"
      className="relative w-full py-16 md:py-24 scroll-mt-20 bg-[var(--ink-900)] border-t border-[var(--line)] flex items-center justify-center overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 space-y-10">
        {/* Section Header */}
        <motion.div
          variants={CAPABILITIES_ANIMATION_VARIANTS.container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="space-y-4 max-w-3xl"
        >
          <motion.div variants={CAPABILITIES_ANIMATION_VARIANTS.item}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--ink-850)] border border-[var(--line)] select-none">
              <span className="w-2 h-2 rounded-full bg-[var(--amber)]" aria-hidden="true" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--amber)] font-semibold">
                {CAPABILITIES_COPY.eyebrow}
              </span>
            </div>
          </motion.div>

          <motion.div variants={CAPABILITIES_ANIMATION_VARIANTS.item}>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--paper)] leading-[1.08]">
              {CAPABILITIES_COPY.headline}
            </h2>
          </motion.div>

          <motion.div variants={CAPABILITIES_ANIMATION_VARIANTS.item}>
            <p className="text-sm sm:text-base text-[var(--mist)] leading-relaxed font-sans">
              {CAPABILITIES_COPY.subheadline}
            </p>
          </motion.div>
        </motion.div>

        {/* Filter Chips Bar */}
        <div className="flex flex-wrap gap-2 select-none">
          {CAPABILITIES_COPY.filterCategories.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[var(--amber)] text-[#06121a] font-bold border border-[var(--amber)]"
                    : "bg-[var(--ink-850)] text-[var(--mist)] border border-[var(--line)] hover:border-[var(--amber)]/40 hover:text-[var(--paper)]"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Competency Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              className="p-5 rounded-2xl bg-[var(--ink-850)]/90 border border-[var(--line)] hover:border-[var(--amber)]/40 transition-all space-y-3.5 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-[var(--amber)] uppercase tracking-widest font-semibold block">
                  {card.subtitle}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[var(--paper)] tracking-tight">
                  {card.title}
                </h3>
                <p className="text-xs text-[var(--mist)] leading-relaxed font-sans">
                  {card.description}
                </p>
              </div>

              {/* Technical Skills Pills with Vector Icons */}
              <div className="pt-2.5 flex flex-wrap gap-1.5 select-none border-t border-[var(--line-soft)]">
                {card.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded bg-[var(--ink-800)] border border-[var(--line-soft)] text-[11px] font-mono text-[var(--mist)] flex items-center gap-1.5 transition-colors hover:border-[var(--cyan)]/40 hover:text-[var(--paper)]"
                  >
                    <TechIcon name={skill} className="w-3 h-3 text-[var(--cyan)]" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
