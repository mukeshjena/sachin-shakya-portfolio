// presentation/shared/rich-content/RichHtmlContent.tsx
// Universal Rich Content Renderer component (Markdown + HTML + CSS).
// Safely renders formatted HTML pages, CSS style scopes, tables, and Markdown blocks.
// Strictly adheres to shadow-free surfaces, token colors, and zero emojis.

import type React from "react";
import { useMemo } from "react";
import type { RichHtmlContentProps } from "./RichHtmlContent.types";
import { renderRichContent } from "./richContentRenderer";

export const RichHtmlContent: React.FC<RichHtmlContentProps> = ({
  content,
  className = "",
  fallbackText,
}) => {
  const parsedHtml = useMemo(() => renderRichContent(content), [content]);

  if (!content?.trim()) {
    if (fallbackText) {
      return (
        <p className={`text-xs sm:text-sm text-[var(--mist)] leading-relaxed ${className}`}>
          {fallbackText}
        </p>
      );
    }
    return null;
  }

  return (
    <div
      className={`rich-content-root max-w-none text-[var(--mist)] leading-relaxed break-words min-w-0 font-sans ${className}`}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Sanitized rich content supporting HTML, CSS, and Markdown
      dangerouslySetInnerHTML={{ __html: parsedHtml }}
    />
  );
};
