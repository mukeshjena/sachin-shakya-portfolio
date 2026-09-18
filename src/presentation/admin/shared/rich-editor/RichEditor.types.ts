// presentation/admin/shared/rich-editor/RichEditor.types.ts
// TypeScript interfaces and types for RichEditor component.

import type React from "react";

export interface RichEditorProps {
  readonly label?: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly minHeight?: string;
  readonly helperText?: string;
  readonly disabled?: boolean;
}

export interface RichEditorViewModel {
  readonly viewMode: "write" | "preview" | "split";
  readonly previewHtml: string;
  readonly textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  readonly setViewMode: (mode: "write" | "preview" | "split") => void;
  readonly insertSnippet: (prefix: string, suffix?: string) => void;
  readonly insertTableSnippet: () => void;
  readonly insertCssSnippet: () => void;
}
