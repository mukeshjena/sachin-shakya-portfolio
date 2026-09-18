// presentation/hero/cursor/CustomCursor.types.ts
// Contract and state types for the desktop precision cursor.

export interface CustomCursorState {
  readonly isVisible: boolean;
  readonly isHovered: boolean;
  readonly x: number;
  readonly y: number;
}
