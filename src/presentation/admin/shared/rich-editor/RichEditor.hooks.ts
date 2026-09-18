// presentation/admin/shared/rich-editor/RichEditor.hooks.ts
// Hook managing formatting toolbar snippets, selection ranges, and view modes.
// Universal Separation of Concerns (Rule 13) — zero JSX markup.

import { useCallback, useMemo, useRef, useState } from "react";
import { renderRichContent } from "../../../shared/rich-content/richContentRenderer";
import type { RichEditorProps, RichEditorViewModel } from "./RichEditor.types";

export function useRichEditor(props: RichEditorProps): RichEditorViewModel {
  const { value, onChange, disabled = false } = props;
  const [viewMode, setViewMode] = useState<"write" | "preview" | "split">("write");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const previewHtml = useMemo(() => renderRichContent(value), [value]);

  const insertSnippet = useCallback(
    (prefix: string, suffix = "") => {
      if (disabled || !textareaRef.current) return;
      const el = textareaRef.current;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const selected = value.substring(start, end) || "text";
      const replacement = `${prefix}${selected}${suffix}`;
      const nextValue = value.substring(0, start) + replacement + value.substring(end);

      onChange(nextValue);

      setTimeout(() => {
        el.focus();
        el.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
      }, 0);
    },
    [disabled, onChange, value]
  );

  const insertTableSnippet = useCallback(() => {
    const tableTemplate =
      "\n| Cloud Architecture Pillar | Target SLA | Benchmark Performance |\n| :--- | :---: | ---: |\n| High Availability Multi-Region | 99.99% | < 15ms latency |\n| Automated CI/CD Deployment | MTTR < 10m | 100% Zero Downtime |\n| Cloud Financial Optimization | Cost Delta | -$170K/mo Savings |\n";
    insertSnippet(tableTemplate, "");
  }, [insertSnippet]);

  const insertCssSnippet = useCallback(() => {
    const cssTemplate =
      '\n<style>\n/* Scoped Custom Section Styles */\n.telemetry-callout {\n  background: rgba(16, 42, 54, 0.6);\n  border: 1px solid rgba(130, 180, 200, 0.16);\n  border-left: 3px solid #ffb020;\n  padding: 16px;\n  border-radius: 12px;\n  margin: 16px 0;\n}\n</style>\n<div class="telemetry-callout">\n  <strong style="color: #e8f1f4;">Architecture Milestone:</strong> Multi-region failover verified.\n</div>\n';
    insertSnippet(cssTemplate, "");
  }, [insertSnippet]);

  return {
    viewMode,
    previewHtml,
    textareaRef,
    setViewMode,
    insertSnippet,
    insertTableSnippet,
    insertCssSnippet,
  };
}
