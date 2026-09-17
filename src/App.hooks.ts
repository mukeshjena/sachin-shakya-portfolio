// App.hooks.ts — Logic for App.tsx.
// All state and hook resolution lives here, never in App.tsx (agent rule #3 / Rule 13).

import { useEffect, useState } from "react";
import type { IPingUseCase } from "./application/use-cases/ping/PingUseCase";
import { DI_TOKENS } from "./infrastructure/di/tokens";
import { useContainer } from "./presentation/shared/useContainer";

export interface AppState {
  readonly showPipelineTest: boolean;
  readonly pingMessage: string;
}

/**
 * App-level hook managing routing state and DI smoke tests.
 */
export function useAppState(): AppState {
  const pingUseCase = useContainer<IPingUseCase>(DI_TOKENS.PingUseCase);
  const pingMessage = pingUseCase.execute();

  const [showPipelineTest, setShowPipelineTest] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const isPipelineTestParam =
        params.get("test") === "pipeline" || window.location.hash === "#pipeline-test";

      if (isPipelineTestParam) {
        setShowPipelineTest(true);
      }
    }
  }, []);

  return { showPipelineTest, pingMessage };
}
