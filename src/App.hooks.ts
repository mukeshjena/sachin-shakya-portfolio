// App.hooks.ts — Logic for App.tsx (Step 3: DI chain verification).
// All logic lives here, never in App.tsx (agent rule #3).

import type { IPingUseCase } from "./application/use-cases/ping/PingUseCase";
import { DI_TOKENS } from "./infrastructure/di/tokens";
import { useContainer } from "./presentation/shared/useContainer";

/**
 * Resolves PingUseCase through the DI container and returns its result.
 * If the container is not bootstrapped correctly, this will throw and surface
 * as an error boundary hit — useful for catching wiring mistakes early.
 */
export function useAppPing(): string {
  const pingUseCase = useContainer<IPingUseCase>(DI_TOKENS.PingUseCase);
  return pingUseCase.execute();
}
