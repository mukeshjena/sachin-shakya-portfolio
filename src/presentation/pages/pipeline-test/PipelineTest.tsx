// presentation/pages/pipeline-test/PipelineTest.tsx
// Pure declarative component proving Clean Architecture end-to-end telemetry wiring.

import { ThemeToggle } from "../../theme/toggle/ThemeToggle";
import { usePipelineTest } from "./PipelineTest.hooks";
import "./PipelineTest.css";

export function PipelineTest() {
  const { title, slug, isPublished, sectionCount, sectionOrder, loading, error, reload } =
    usePipelineTest();

  return (
    <section className="pipeline-test-card" aria-label="Architecture Pipeline Verification">
      <header className="pipeline-header">
        <div>
          <div className="pipeline-badge pipeline-badge-live">
            <span className="pipeline-badge-pulse" aria-hidden="true" />
            <span>Clean Architecture Pipeline E2E</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--paper)] mt-2">{title}</h2>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={reload}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-mono font-medium rounded-lg border border-[var(--line)] bg-[var(--ink-700)] text-[var(--mist)] hover:border-[var(--amber)] hover:text-[var(--paper)] transition-colors"
          >
            {loading ? "Streaming..." : "Poll State"}
          </button>
        </div>
      </header>

      {error ? (
        <div
          role="alert"
          className="p-3 rounded-lg border border-red-500/30 bg-red-950/20 text-red-300 text-xs font-mono"
        >
          Telemetry Error: {error}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="pipeline-grid">
            <div className="pipeline-stat-box">
              <div className="pipeline-stat-label">Resolved Document Slug</div>
              <div className="pipeline-stat-value">{slug}</div>
            </div>

            <div className="pipeline-stat-box">
              <div className="pipeline-stat-label">Publication Status</div>
              <div className="pipeline-stat-value text-[var(--live)]">
                {isPublished ? "PUBLISHED" : "DRAFT"}
              </div>
            </div>

            <div className="pipeline-stat-box">
              <div className="pipeline-stat-label">Attached Section Count</div>
              <div className="pipeline-stat-value">{sectionCount}</div>
            </div>
          </div>

          <div>
            <div className="pipeline-stat-label">Seeded Section Architecture</div>
            <div className="pipeline-sections-list">
              {sectionOrder.map((sec) => (
                <span key={sec} className="pipeline-section-pill">
                  {sec}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
