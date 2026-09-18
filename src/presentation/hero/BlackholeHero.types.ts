// presentation/hero/BlackholeHero.types.ts
// Contract and state types for the BlackholeHero component.

import type { RefObject } from "react";

export interface HeroContentData {
  readonly eyebrow: string;
  readonly headline: string;
  readonly subheadline: string;
  readonly ctaPrimary: string;
  readonly ctaSecondary: string;
  readonly heroPhotoUrl: string;
  readonly resumePdfUrl: string;
}

export interface BlackholeHeroState {
  readonly content: HeroContentData;
  readonly isReducedMotion: boolean;
  readonly canvasRef: RefObject<HTMLCanvasElement | null>;
  readonly containerRef: RefObject<HTMLElement | null>;
}
