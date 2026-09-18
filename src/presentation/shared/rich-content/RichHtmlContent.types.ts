// presentation/shared/rich-content/RichHtmlContent.types.ts
// TypeScript interfaces for the RichHtmlContent presentation component.

export interface RichHtmlContentProps {
  readonly content?: string | null;
  readonly className?: string;
  readonly fallbackText?: string;
}
