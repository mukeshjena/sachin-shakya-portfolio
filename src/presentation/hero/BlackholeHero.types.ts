// presentation/hero/BlackholeHero.types.ts
// Contract and state types for the BlackholeHero component.

import type { RefObject } from "react";

export interface BlackholeHeroState {
  readonly isNarrow: boolean;
  readonly canvasRef: RefObject<HTMLCanvasElement | null>;
  readonly containerRef: RefObject<HTMLElement | null>;
  readonly resumePdfUrl?: string;
}
