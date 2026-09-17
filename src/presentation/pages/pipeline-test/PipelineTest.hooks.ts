// presentation/pages/pipeline-test/PipelineTest.hooks.ts
// Component hook for PipelineTest — calls usePage and packages presentation state.

import { usePage } from "../hooks/usePage";

export interface PipelineTestState {
  readonly title: string;
  readonly slug: string;
  readonly isPublished: boolean;
  readonly sectionCount: number;
  readonly sectionOrder: readonly string[];
  readonly loading: boolean;
  readonly error: string | null;
  readonly reload: () => void;
}

export function usePipelineTest(): PipelineTestState {
  const { page, loading, error, reload } = usePage("home");

  return {
    title: page?.title ?? "Awaiting Telemetry Stream...",
    slug: page?.slug ?? "home",
    isPublished: page?.isPublished ?? false,
    sectionCount: page?.sectionOrder.length ?? 0,
    sectionOrder: page?.sectionOrder ?? [],
    loading,
    error,
    reload,
  };
}
