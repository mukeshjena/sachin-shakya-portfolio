// presentation/pages/dynamic/components/NotFoundTelemetry.tsx
// Bespoke shadow-free 404 Telemetry Signal Loss presentation screen.
// Strictly adheres to instrument panel aesthetics, outline icons, and zero emojis.

import { IoArrowBackOutline, IoWarningOutline } from "react-icons/io5";
import type { NotFoundTelemetryProps } from "../DynamicPage.types";

export function NotFoundTelemetry({ slug, onReturnHome }: NotFoundTelemetryProps) {
  return (
    <section
      aria-label="404 Page Not Found"
      className="relative min-h-[80dvh] w-full py-24 flex items-center justify-center overflow-hidden"
    >
      <div className="max-w-2xl mx-auto px-6 text-center space-y-8 relative z-10">
        {/* Beacon Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[var(--ink-850)] border border-[var(--line)] select-none">
          <IoWarningOutline className="w-4 h-4 text-[var(--amber)]" aria-hidden="true" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--amber)] font-semibold">
            PAGE NOT FOUND {"//"} CODE 404
          </span>
        </div>

        {/* Monumental 404 Visual */}
        <div className="space-y-3">
          <div className="text-7xl sm:text-9xl font-mono font-bold text-[var(--paper)] tracking-tighter tabular-nums select-none">
            404
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--paper)]">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm font-mono text-[var(--mist-dim)] uppercase tracking-wider">
            PATH: /{slug}
          </p>
        </div>

        {/* Diagnostic Box */}
        <div className="p-4 rounded-xl bg-[var(--ink-850)]/90 border border-[var(--line)] text-left max-w-lg mx-auto font-mono text-xs text-[var(--mist)] space-y-1">
          <div className="text-[var(--cyan)]">{"//"} SYSTEM DIAGNOSTIC:</div>
          <div>STATUS: 404_PAGE_NOT_FOUND</div>
          <div>DETAILS: Document not found or unpublished in Firestore catalog.</div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={onReturnHome}
            className="px-6 py-3 rounded-full bg-[var(--amber)] text-black font-semibold text-xs sm:text-sm uppercase tracking-wider hover:bg-[var(--amber-deep)] active:translate-y-px transition-all flex items-center gap-2 select-none cursor-pointer"
          >
            <IoArrowBackOutline className="w-4 h-4" aria-hidden="true" />
            <span>Return to Home</span>
          </button>

          <a
            href="/#telemetry"
            className="px-6 py-3 rounded-full bg-[var(--ink-800)] text-[var(--paper)] border border-[var(--line)] hover:border-[var(--cyan)] hover:text-[var(--cyan)] text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all flex items-center gap-2 select-none cursor-pointer"
          >
            <span>Architecture & Metrics</span>
          </a>
        </div>
      </div>
    </section>
  );
}
