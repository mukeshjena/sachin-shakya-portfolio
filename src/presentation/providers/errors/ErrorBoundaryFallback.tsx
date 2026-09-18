// presentation/providers/errors/ErrorBoundaryFallback.tsx
// Sci-Fi Instrument Panel diagnostic screen for unhandled client exceptions.
// Adheres strictly to design rules: zero box-shadows, zero emojis, token-based colors.

import { IoAlertCircleOutline, IoRefreshOutline } from "react-icons/io5";
import type { ErrorBoundaryFallbackProps } from "./ErrorBoundary.types";

export function ErrorBoundaryFallback({ error, errorInfo, onReset }: ErrorBoundaryFallbackProps) {
  const handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--ink-900)] text-[var(--paper)] flex items-center justify-center p-6 md:p-12">
      <div className="w-full max-w-2xl bg-[var(--ink-850)] border border-[var(--line)] rounded-2xl p-8 space-y-6">
        {/* Header Telemetry Badge */}
        <div className="flex items-center justify-between border-b border-[var(--line-soft)] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--amber)]/10 border border-[var(--amber)]/30 flex items-center justify-center text-[var(--amber)]">
              <IoAlertCircleOutline className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--amber)] font-semibold block">
                {"FAULT CODE // ERR-PRESENTATION-LAYER"}
              </span>
              <h1 className="text-xl font-bold tracking-tight text-[var(--paper)]">
                Runtime Subsystem Interrupted
              </h1>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--ink-800)] border border-[var(--line)] text-[11px] font-mono text-[var(--mist-dim)]">
            <span className="w-2 h-2 rounded-full bg-[var(--amber)]" />
            <span>DIAGNOSTIC MODE</span>
          </div>
        </div>

        {/* Technical Error Telemetry */}
        <div className="space-y-3">
          <p className="text-sm text-[var(--mist)] leading-relaxed">
            The presentation engine encountered an unhandled exception. Telemetry state has been
            isolated to prevent cascade instability.
          </p>

          {error && (
            <div className="p-4 rounded-xl bg-[var(--ink-900)] border border-[var(--line-soft)] font-mono text-xs text-[var(--amber)] space-y-1 overflow-x-auto">
              <div className="text-[var(--mist-dim)] font-semibold">
                {`EXCEPTION // ${error.name}`}
              </div>
              <div className="whitespace-pre-wrap break-all">{error.message}</div>
            </div>
          )}

          {errorInfo?.componentStack && (
            <details className="group">
              <summary className="text-xs font-mono text-[var(--mist-dim)] hover:text-[var(--cyan)] cursor-pointer select-none transition-colors">
                [+] View Component Stack Trace
              </summary>
              <pre className="mt-2 p-3 rounded-lg bg-[var(--ink-900)]/80 border border-[var(--line-soft)] text-[11px] font-mono text-[var(--mist-dim)] overflow-x-auto max-h-48 whitespace-pre-wrap">
                {errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-[var(--line-soft)]">
          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[var(--amber)] text-[var(--ink-900)] font-semibold text-sm hover:bg-[var(--amber-deep)] active:translate-y-px transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <IoRefreshOutline className="w-4 h-4" aria-hidden="true" />
            <span>Reboot Subsystem</span>
          </button>
          <button
            type="button"
            onClick={handleReload}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[var(--ink-700)] text-[var(--paper)] border border-[var(--line)] hover:border-[var(--mist-dim)] text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Reload Page</span>
          </button>
        </div>
      </div>
    </div>
  );
}
