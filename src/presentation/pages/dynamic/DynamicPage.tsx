// presentation/pages/dynamic/DynamicPage.tsx
// Pure declarative dynamic page view container.
// Universal Separation of Concerns (Rule 13) — zero inline state calculations or direct database access.

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
        aria-label="Loading Telemetry Page"
        className="min-h-[70dvh] w-full flex flex-col items-center justify-center p-6 bg-[var(--ink-900)] space-y-6"
      >
        <div className="w-12 h-12 rounded-full border border-[var(--line)] flex items-center justify-center">
          <span className="w-3 h-3 rounded-full bg-[var(--amber)] animate-ping" />
        </div>
        <div className="space-y-2 text-center font-mono text-xs text-[var(--mist-dim)] uppercase tracking-widest">
          <div>{"//"} SYNCHRONIZING CLUSTER TELEMETRY</div>
          <div className="text-[10px] text-[var(--cyan)]">RESOLVING VECTOR: /{activeSlug}</div>
        </div>
      </section>
    );
  }

  if (isNotFound || error) {
    return <NotFoundTelemetry slug={activeSlug} onReturnHome={handleReturnHome} />;
  }

  if (!sections.length) {
    return (
      <div className="min-h-[60dvh] w-full flex flex-col items-center justify-center p-6 bg-[var(--ink-900)]">
        <div className="max-w-md p-6 rounded-2xl bg-[var(--ink-850)] border border-[var(--line)] text-center space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--amber)] font-semibold">
            SECTIONS PENDING
          </span>
          <p className="text-sm text-[var(--mist)]">
            This page has been registered in the catalog but has no visible sections configured yet.
          </p>
          <button
            type="button"
            onClick={handleReturnHome}
            className="px-5 py-2.5 rounded-full bg-[var(--ink-800)] text-[var(--paper)] border border-[var(--line)] hover:border-[var(--cyan)] text-xs font-semibold uppercase tracking-wider"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col bg-[var(--ink-900)]">
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
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </div>
  );
}
