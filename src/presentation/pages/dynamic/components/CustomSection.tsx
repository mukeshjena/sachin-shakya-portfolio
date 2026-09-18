// presentation/pages/dynamic/components/CustomSection.tsx
// Generic presentation component for admin-created custom sections.
// Adheres strictly to shadow-free surfaces, outline Cupertino icons, and zero emojis.

import { IoArrowForwardOutline, IoHardwareChipOutline } from "react-icons/io5";
import { RichHtmlContent } from "../../../shared/rich-content/RichHtmlContent";
import type { CustomSectionProps } from "../DynamicPage.types";

interface CustomSectionContent {
  readonly eyebrow?: string;
  readonly headline?: string;
  readonly subheadline?: string;
  readonly body?: string;
  readonly ctaText?: string;
  readonly ctaUrl?: string;
  readonly secondaryCtaText?: string;
  readonly secondaryCtaUrl?: string;
  readonly items?: Array<{
    readonly title: string;
    readonly description: string;
    readonly tag?: string;
  }>;
}

export function CustomSection({ section }: CustomSectionProps) {
  const content = (section.content || {}) as CustomSectionContent;
  const eyebrow = content.eyebrow || section.title.toUpperCase();
  const headline = content.headline || section.title;
  const subheadline = content.subheadline;
  const body =
    content.body ||
    (typeof (content as Record<string, unknown>).description === "string"
      ? ((content as Record<string, unknown>).description as string)
      : undefined);
  const items = Array.isArray(content.items) ? content.items : [];

  return (
    <section
      id={`section-${section.id}`}
      aria-label={section.title}
      className="relative w-full py-16 md:py-24 bg-[var(--ink-900)] border-t border-[var(--line)] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-10">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[var(--ink-850)] border border-[var(--line)] select-none">
            <span className="w-2 h-2 rounded-full bg-[var(--cyan)]" aria-hidden="true" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--cyan)] font-semibold">
              {eyebrow}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--paper)] leading-tight">
            {headline}
          </h2>

          {subheadline && (
            <p className="text-base sm:text-lg text-[var(--mist)] leading-relaxed font-sans">
              {subheadline}
            </p>
          )}
        </div>

        {/* Narrative Body Copy / Rich Content if Present */}
        {body && (
          <div className="max-w-4xl p-6 md:p-8 rounded-2xl bg-[var(--ink-850)] border border-[var(--line)]">
            <RichHtmlContent content={body} />
          </div>
        )}

        {/* Dynamic Card Grid if Items Present */}
        {items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {items.map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-2xl bg-[var(--ink-850)]/90 backdrop-blur-md border border-[var(--line)] space-y-3 transition-colors hover:border-[var(--line-strong)]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="w-8 h-8 rounded-lg bg-[var(--ink-800)] border border-[var(--line)] flex items-center justify-center text-[var(--cyan)]">
                    <IoHardwareChipOutline className="w-4 h-4" aria-hidden="true" />
                  </span>
                  {item.tag && (
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--amber)] px-2.5 py-1 rounded-full bg-[var(--ink-800)] border border-[var(--line)]">
                      {item.tag}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-[var(--paper)]">{item.title}</h3>
                <p className="text-xs sm:text-sm text-[var(--mist)] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* CTA Actions */}
        {(content.ctaText || content.secondaryCtaText) && (
          <div className="flex flex-wrap items-center gap-4 pt-4">
            {content.ctaText && (
              <a
                href={content.ctaUrl || "#top"}
                className="px-6 py-3 rounded-full bg-[var(--amber)] text-black font-semibold text-xs sm:text-sm uppercase tracking-wider hover:bg-[var(--amber-deep)] active:translate-y-px transition-all flex items-center gap-2 select-none cursor-pointer"
              >
                <span>{content.ctaText}</span>
                <IoArrowForwardOutline className="w-4 h-4" aria-hidden="true" />
              </a>
            )}

            {content.secondaryCtaText && (
              <a
                href={content.secondaryCtaUrl || "#top"}
                className="px-6 py-3 rounded-full bg-[var(--ink-800)] text-[var(--paper)] border border-[var(--line)] hover:border-[var(--cyan)] hover:text-[var(--cyan)] text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all flex items-center gap-2 select-none cursor-pointer"
              >
                <span>{content.secondaryCtaText}</span>
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
