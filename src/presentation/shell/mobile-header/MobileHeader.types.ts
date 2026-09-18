// presentation/shell/mobile-header/MobileHeader.types.ts
// Types for mobile top app bar.

export interface MobileHeaderState {
  readonly logoUrl: string;
  readonly fullName: string;
  readonly isAvailable: boolean;
  readonly isScrolled: boolean;
}
