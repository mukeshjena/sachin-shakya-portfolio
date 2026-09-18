// presentation/pages/dynamic/DynamicPage.tsx
// Pure declarative dynamic page view container.
// Universal Separation of Concerns (Rule 13) — zero inline state calculations or direct database access.

import { RichHtmlContent } from "../../shared/rich-content/RichHtmlContent";
import { SeoHead } from "../../shared/seo/SeoHead";
import { NotFoundTelemetry } from "./components/NotFoundTelemetry";
import { SectionRenderer } from "./components/SectionRenderer";
import { useDynamicPageLogic } from "./DynamicPage.hooks";
import type { DynamicPageProps } from "./DynamicPage.types";

export function DynamicPage({ slug }: DynamicPageProps) {
  const {
    slug: activeSlug,
    page,
    sections,
    isLoading,
    isNotFound,
    error,
    handleReturnHome,
  } = useDynamicPageLogic(slug);

  if (isLoading) {
    return (
      <section
        role="status"
        aria-label="Loading Page"
        className="min-h-[70dvh] w-full flex flex-col items-center justify-center p-6 space-y-6"
      >
        <div className="w-12 h-12 rounded-full border border-[var(--line)] flex items-center justify-center">
          <span className="w-3 h-3 rounded-full bg-[var(--amber)] animate-ping" />
        </div>
        <div className="space-y-2 text-center font-mono text-xs text-[var(--mist-dim)] uppercase tracking-widest">
          <div>{"//"} LOADING PAGE CONTENT</div>
          <div className="text-[10px] text-[var(--cyan)]">RESOLVING PATH: /{activeSlug}</div>
        </div>
      </section>
    );
  }

  if (isNotFound || error) {
    return <NotFoundTelemetry slug={activeSlug} onReturnHome={handleReturnHome} />;
  }

  const hasRichContent = Boolean(page?.richContent?.trim() || page?.content?.trim());
  const hasSections = sections.length > 0;

  if (!hasSections && !hasRichContent) {
    return (
      <div className="min-h-[60dvh] w-full flex flex-col items-center justify-center p-6">
        <div className="max-w-md p-6 rounded-2xl bg-[var(--ink-850)] border border-[var(--line)] text-center space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--amber)] font-semibold">
            SECTIONS PENDING
          </span>
          <p className="text-sm text-[var(--mist)]">
            This page has been registered in the catalog but has no visible sections or rich content
            configured yet.
          </p>
          <button
            type="button"
            onClick={handleReturnHome}
            className="px-5 py-2.5 rounded-full bg-[var(--ink-800)] text-[var(--paper)] border border-[var(--line)] hover:border-[var(--cyan)] text-xs font-semibold uppercase tracking-wider cursor-pointer"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      {page && (
        <SeoHead
          title={page.seoTitle || page.title}
          description={page.seoDescription}
          canonicalPath={`/${activeSlug}`}
          ogImage={page.seoImage || "/og-image.png"}
          breadcrumbs={[
            { name: "Home", path: "/" },
            { name: page.title, path: `/${activeSlug}` },
          ]}
        />
      )}

      {/* Render Document Body if rich content is present */}
      {hasRichContent && page && (
        <article className="relative w-full py-12 md:py-20 bg-[var(--ink-900)] border-t border-[var(--line)]">
          <div className="max-w-4xl mx-auto px-6 space-y-8">
            {/* Breadcrumbs & Category */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[var(--mist-dim)]">
              <button
                type="button"
                onClick={handleReturnHome}
                className="hover:text-[var(--paper)] transition-colors cursor-pointer"
              >
                home
              </button>
              <span>/</span>
              <span className="text-[var(--amber)]">{activeSlug}</span>
              {page.category && (
                <>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded-full bg-[var(--ink-800)] border border-[var(--line)] text-[10px] uppercase tracking-wider text-[var(--cyan)]">
                    {page.category}
                  </span>
                </>
              )}
            </div>

            {/* Page Header */}
            <header className="space-y-3 pb-6 border-b border-[var(--line)]">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--paper)] leading-tight">
                {page.title}
              </h1>
              {page.subtitle && (
                <p className="text-base sm:text-lg text-[var(--mist)] font-sans leading-relaxed">
                  {page.subtitle}
                </p>
              )}
            </header>

            {/* Rich Document Content */}
            <div className="p-6 md:p-8 rounded-2xl bg-[var(--ink-850)] border border-[var(--line)]">
              <RichHtmlContent content={page.richContent || page.content || ""} />
            </div>
          </div>
        </article>
      )}

      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </div>
  );
}
