// presentation/hero/BlackholeHero.types.ts
// Contract and state types for the BlackholeHero component.

import type { RefObject } from "react";

export interface HeroContentData {
  readonly eyebrow: string;
  readonly titleLine1: string;
  readonly titleLine2: string;
  readonly subheadline: string;
  readonly ctaPrimary: string;
  readonly ctaSecondary: string;
  readonly scrollPrompt: string;
}

export interface BlackholeHeroState {
  readonly isNarrow: boolean;
  readonly canvasRef: RefObject<HTMLCanvasElement | null>;
  readonly containerRef: RefObject<HTMLElement | null>;
  readonly resumePdfUrl?: string;
  readonly content: HeroContentData;
}
