// application/use-cases/ping/PingUseCase.ts
// Throwaway verification use-case — proves the DI chain is wired end-to-end.
// Remove or repurpose this file once Step 11 proves the real chain works.

export interface IPingUseCase {
  execute(): string;
}

/**
 * A no-op use-case that returns a string confirming the DI container is reachable
 * from the presentation layer.
 *
 * Flow: App.tsx → useContainer(DI_TOKENS.PingUseCase) → PingUseCase.execute()
 * This validates: container is registered → factory is called → result flows to UI.
 */
export class PingUseCase implements IPingUseCase {
  execute(): string {
    return "pong — DI container resolves correctly (Step 3)";
  }
}
