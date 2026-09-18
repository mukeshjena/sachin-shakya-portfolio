// presentation/admin/shared/rich-editor/RichEditor.tsx
// Declarative Markdown + Raw HTML + Custom CSS rich editor with live split-view preview.
// Shadow-free surfaces, hairline borders, outline icons, and zero emojis.

import type React from "react";
import {
  IoCodeOutline,
  IoCodeSlashOutline,
  IoColorPaletteOutline,
  IoEyeOutline,
  IoGridOutline,
  IoHardwareChipOutline,
  IoLinkOutline,
  IoListOutline,
  IoPencilOutline,
  IoReorderFourOutline,
  IoTextOutline,
} from "react-icons/io5";
import { useRichEditor } from "./RichEditor.hooks";
import type { RichEditorProps } from "./RichEditor.types";

export const RichEditor: React.FC<RichEditorProps> = (props) => {
  const {
    label = "Content",
    value,
    onChange,
    placeholder = "Write Markdown, HTML, or CSS here...",
    minHeight = "240px",
    helperText = "Full Markdown, HTML tags, and <style> CSS blocks supported.",
    disabled = false,
  } = props;

  const {
    viewMode,
    previewHtml,
    textareaRef,
    setViewMode,
    insertSnippet,
    insertTableSnippet,
    insertCssSnippet,
  } = useRichEditor(props);

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        {label && (
          <label
            htmlFor="rich-editor-textarea"
            className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)]"
          >
            {label}
          </label>
        )}

        {/* View Mode Switcher */}
        <div className="inline-flex items-center gap-1 p-0.5 rounded-lg border border-[var(--line)] bg-[var(--ink-850)]">
          <button
            type="button"
            onClick={() => setViewMode("write")}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer select-none ${
              viewMode === "write"
                ? "bg-[var(--amber)] text-[#06121a] font-bold"
                : "text-[var(--mist-dim)] hover:text-[var(--paper)]"
            }`}
          >
            <IoPencilOutline className="w-3 h-3" />
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer select-none ${
              viewMode === "preview"
                ? "bg-[var(--amber)] text-[#06121a] font-bold"
                : "text-[var(--mist-dim)] hover:text-[var(--paper)]"
            }`}
          >
            <IoEyeOutline className="w-3 h-3" />
            <span>Preview</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("split")}
            className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer select-none ${
              viewMode === "split"
                ? "bg-[var(--amber)] text-[#06121a] font-bold"
                : "text-[var(--mist-dim)] hover:text-[var(--paper)]"
            }`}
          >
            <IoHardwareChipOutline className="w-3 h-3" />
            <span>Split</span>
          </button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="w-full rounded-xl border border-[var(--line)] bg-[var(--ink-800)] overflow-hidden">
        {/* Formatting Toolbar */}
        {viewMode !== "preview" && (
          <div className="flex flex-wrap items-center gap-1 p-2 border-b border-[var(--line)] bg-[var(--ink-850)] text-xs">
            <button
              type="button"
              disabled={disabled}
              onClick={() => insertSnippet("# ", "")}
              title="Heading 1"
              className="px-2 py-1 rounded-lg border border-[var(--line)] bg-[var(--ink-800)] text-[var(--mist)] hover:text-[var(--paper)] hover:border-[var(--line-strong)] transition-colors disabled:opacity-40 cursor-pointer font-mono text-[11px]"
            >
              H1
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => insertSnippet("## ", "")}
              title="Heading 2"
              className="px-2 py-1 rounded-lg border border-[var(--line)] bg-[var(--ink-800)] text-[var(--mist)] hover:text-[var(--paper)] hover:border-[var(--line-strong)] transition-colors disabled:opacity-40 cursor-pointer font-mono text-[11px]"
            >
              H2
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => insertSnippet("### ", "")}
              title="Heading 3"
              className="px-2 py-1 rounded-lg border border-[var(--line)] bg-[var(--ink-800)] text-[var(--mist)] hover:text-[var(--paper)] hover:border-[var(--line-strong)] transition-colors disabled:opacity-40 cursor-pointer font-mono text-[11px]"
            >
              H3
            </button>

            <span className="w-px h-4 bg-[var(--line)] mx-1" />

            <button
              type="button"
              disabled={disabled}
              onClick={() => insertSnippet("**", "**")}
              title="Bold"
              className="px-2 py-1 rounded-lg border border-[var(--line)] bg-[var(--ink-800)] text-[var(--mist)] hover:text-[var(--paper)] hover:border-[var(--line-strong)] transition-colors disabled:opacity-40 cursor-pointer font-mono text-[11px] font-bold"
            >
              B
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => insertSnippet("*", "*")}
              title="Italic"
              className="px-2 py-1 rounded-lg border border-[var(--line)] bg-[var(--ink-800)] text-[var(--mist)] hover:text-[var(--paper)] hover:border-[var(--line-strong)] transition-colors disabled:opacity-40 cursor-pointer font-mono text-[11px] italic"
            >
              I
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => insertSnippet("`", "`")}
              title="Inline Code"
              className="p-1.5 rounded-lg border border-[var(--line)] bg-[var(--ink-800)] text-[var(--mist)] hover:text-[var(--paper)] hover:border-[var(--line-strong)] transition-colors disabled:opacity-40 cursor-pointer"
            >
              <IoCodeOutline className="w-3.5 h-3.5" />
            </button>

            <span className="w-px h-4 bg-[var(--line)] mx-1" />

            <button
              type="button"
              disabled={disabled}
              onClick={() => insertSnippet("- ", "")}
              title="Unordered List"
              className="p-1.5 rounded-lg border border-[var(--line)] bg-[var(--ink-800)] text-[var(--mist)] hover:text-[var(--paper)] hover:border-[var(--line-strong)] transition-colors disabled:opacity-40 cursor-pointer"
            >
              <IoListOutline className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => insertSnippet("1. ", "")}
              title="Ordered List"
              className="p-1.5 rounded-lg border border-[var(--line)] bg-[var(--ink-800)] text-[var(--mist)] hover:text-[var(--paper)] hover:border-[var(--line-strong)] transition-colors disabled:opacity-40 cursor-pointer"
            >
              <IoReorderFourOutline className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => insertSnippet("> ", "")}
              title="Blockquote"
              className="p-1.5 rounded-lg border border-[var(--line)] bg-[var(--ink-800)] text-[var(--mist)] hover:text-[var(--paper)] hover:border-[var(--line-strong)] transition-colors disabled:opacity-40 cursor-pointer"
            >
              <IoTextOutline className="w-3.5 h-3.5" />
            </button>

            <span className="w-px h-4 bg-[var(--line)] mx-1" />

            <button
              type="button"
              disabled={disabled}
              onClick={() => insertSnippet("[Link Text](", ")")}
              title="Insert Link"
              className="p-1.5 rounded-lg border border-[var(--line)] bg-[var(--ink-800)] text-[var(--mist)] hover:text-[var(--paper)] hover:border-[var(--line-strong)] transition-colors disabled:opacity-40 cursor-pointer"
            >
              <IoLinkOutline className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={insertTableSnippet}
              title="Insert Markdown Table"
              className="p-1.5 rounded-lg border border-[var(--line)] bg-[var(--ink-800)] text-[var(--mist)] hover:text-[var(--paper)] hover:border-[var(--line-strong)] transition-colors disabled:opacity-40 cursor-pointer"
            >
              <IoGridOutline className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => insertSnippet("```bash\n", "\n```")}
              title="Insert Code Block"
              className="p-1.5 rounded-lg border border-[var(--line)] bg-[var(--ink-800)] text-[var(--mist)] hover:text-[var(--paper)] hover:border-[var(--line-strong)] transition-colors disabled:opacity-40 cursor-pointer"
            >
              <IoCodeSlashOutline className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={insertCssSnippet}
              title="Insert Scoped Custom CSS Block"
              className="p-1.5 rounded-lg border border-[var(--line)] bg-[var(--ink-800)] text-[var(--amber)] hover:border-[var(--amber)] transition-colors disabled:opacity-40 cursor-pointer flex items-center gap-1 font-mono text-[11px]"
            >
              <IoColorPaletteOutline className="w-3.5 h-3.5" />
              <span>CSS</span>
            </button>
          </div>
        )}

        {/* Content Body: Write / Preview / Split */}
        <div
          className={`grid w-full ${
            viewMode === "split"
              ? "grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--line)]"
              : "grid-cols-1"
          }`}
        >
          {/* Write Textarea */}
          {viewMode !== "preview" && (
            <div className="relative w-full">
              <textarea
                id="rich-editor-textarea"
                ref={textareaRef}
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                style={{ minHeight }}
                className="w-full p-4 bg-transparent font-mono text-xs text-[var(--paper)] placeholder-[var(--mist-dim)]/50 focus:outline-none resize-y leading-relaxed border-0"
              />
            </div>
          )}

          {/* Live Preview */}
          {viewMode !== "write" && (
            <div
              style={{ minHeight }}
              className="p-4 overflow-y-auto bg-[var(--ink-850)]/50 text-xs text-[var(--mist)] leading-relaxed max-h-[400px]"
            >
              {previewHtml ? (
                <div
                  className="rich-preview-content space-y-3"
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: Sanitized rich content preview
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              ) : (
                <p className="text-[var(--mist-dim)] italic font-mono text-xs">
                  Nothing to preview. Enter markdown, HTML, or CSS above.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {helperText && <p className="text-[10px] font-mono text-[var(--mist-dim)]">{helperText}</p>}
    </div>
  );
};
