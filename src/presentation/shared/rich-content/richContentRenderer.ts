// presentation/shared/rich-content/richContentRenderer.ts
// Universal Rich Content Renderer (Markdown + HTML + CSS).
// Pure deterministic function parsing rich documents into sanitized, token-styled HTML.
// Clean Architecture presentation utility — zero React or DOM dependencies.

function sanitizeDangerousContent(raw: string): string {
  if (!raw) return "";
  return raw
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*(?:'javascript:[^']*'|"javascript:[^"]*")/gi, '$1="#"');
}

export function formatInlineMarkdown(text: string): string {
  if (!text) return "";
  return text
    .replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" class="max-w-full h-auto rounded-xl border border-[var(--line)] my-3" loading="lazy" />'
    )
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[var(--cyan)] font-medium underline underline-offset-2 hover:text-[var(--amber)] transition-colors">$1</a>'
    )
    .replace(
      /\*\*\*(.*?)\*\*\*/g,
      '<strong class="font-semibold text-[var(--paper)]"><em class="italic">$1</em></strong>'
    )
    .replace(
      /___(.*?)___/g,
      '<strong class="font-semibold text-[var(--paper)]"><em class="italic">$1</em></strong>'
    )
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-[var(--paper)]">$1</strong>')
    .replace(/__([^_]+)__/g, '<strong class="font-semibold text-[var(--paper)]">$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em class="italic text-[var(--mist)]">$1</em>')
    .replace(/_([^_]+)_/g, '<em class="italic text-[var(--mist)]">$1</em>')
    .replace(/~~(.*?)~~/g, '<del class="line-through opacity-70">$1</del>')
    .replace(
      /`([^`]+)`/g,
      '<code class="px-1.5 py-0.5 rounded-md bg-[var(--ink-800)] border border-[var(--line)] font-mono text-[11px] text-[var(--amber)]">$1</code>'
    );
}

function parseMarkdownTable(lines: string[]): string {
  if (lines.length < 2) return lines.join("\n");

  const parseRow = (line: string): string[] => {
    return line
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((cell) => cell.trim());
  };

  const headerCells = parseRow(lines[0]);
  const alignCells = parseRow(lines[1]);

  const alignments: ("left" | "center" | "right")[] = alignCells.map((cell) => {
    const trimmed = cell.trim();
    if (trimmed.startsWith(":") && trimmed.endsWith(":")) return "center";
    if (trimmed.endsWith(":")) return "right";
    return "left";
  });

  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  let thead = '<tr class="border-b border-[var(--line)] bg-[var(--ink-800)]">';
  for (let i = 0; i < headerCells.length; i++) {
    const align = alignments[i] || "left";
    thead += `<th class="p-3 ${alignClasses[align]} font-semibold text-[var(--paper)] text-xs uppercase tracking-wider font-mono">${formatInlineMarkdown(headerCells[i])}</th>`;
  }
  thead += "</tr>";

  let tbody = "";
  for (let i = 2; i < lines.length; i++) {
    const rowCells = parseRow(lines[i]);
    if (rowCells.length === 0 || (rowCells.length === 1 && rowCells[0] === "")) continue;

    tbody +=
      '<tr class="hover:bg-[var(--ink-800)]/40 border-b border-[var(--line-soft)] transition-colors">';
    for (let j = 0; j < headerCells.length; j++) {
      const cellContent = rowCells[j] !== undefined ? rowCells[j] : "";
      const align = alignments[j] || "left";
      tbody += `<td class="p-3 ${alignClasses[align]} text-[var(--mist)] text-xs font-mono">${formatInlineMarkdown(cellContent)}</td>`;
    }
    tbody += "</tr>";
  }

  return `<div class="overflow-x-auto my-5 rounded-xl border border-[var(--line)] bg-[var(--ink-850)]">
    <table class="w-full border-collapse text-xs">
      <thead>${thead}</thead>
      <tbody class="divide-y divide-[var(--line-soft)]">${tbody}</tbody>
    </table>
  </div>`;
}

const BLOCK_ELEMENT_NAMES = new Set([
  "div",
  "section",
  "article",
  "aside",
  "table",
  "thead",
  "tbody",
  "tfoot",
  "tr",
  "th",
  "td",
  "ul",
  "ol",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "blockquote",
  "header",
  "footer",
  "nav",
  "figure",
  "figcaption",
  "form",
  "fieldset",
  "iframe",
  "details",
  "summary",
  "dialog",
]);

const SELF_CLOSING_HTML_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

export function renderRichContent(rawContent?: string | null): string {
  if (!rawContent?.trim()) {
    return "";
  }

  const sanitized = sanitizeDangerousContent(rawContent);

  // Preserve <style> blocks
  const styleBlocks: string[] = [];
  const contentWithoutStyles = sanitized.replace(
    /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
    (match) => {
      styleBlocks.push(match);
      return `\n<!--__STYLE_BLOCK_${styleBlocks.length - 1}__-->\n`;
    }
  );

  // Preserve ```code blocks```
  const codeBlocks: string[] = [];
  const contentWithoutCode = contentWithoutStyles.replace(
    /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g,
    (_, lang, code) => {
      const langAttr = lang ? ` data-lang="${lang}"` : "";
      const escapedCode = (code as string)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      const htmlBlock = `<pre class="overflow-x-auto p-4 my-4 rounded-xl bg-[var(--ink-900)] border border-[var(--line)] font-mono text-xs text-[var(--paper)] leading-relaxed"${langAttr}><code>${escapedCode}</code></pre>`;
      codeBlocks.push(htmlBlock);
      return `\n<!--__CODE_BLOCK_${codeBlocks.length - 1}__-->\n`;
    }
  );

  const lines = contentWithoutCode.split(/\r?\n/);
  const processedBlocks: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    if (trimmed.startsWith("<!--__STYLE_BLOCK_") || trimmed.startsWith("<!--__CODE_BLOCK_")) {
      processedBlocks.push(trimmed);
      i++;
      continue;
    }

    if (/^(?:---|\*\*\*|___)$/.test(trimmed)) {
      processedBlocks.push('<hr class="border-t border-[var(--line)] my-8" />');
      i++;
      continue;
    }

    if (/^######\s+(.*)$/.test(trimmed)) {
      const match = trimmed.match(/^######\s+(.*)$/);
      processedBlocks.push(
        `<h6 class="text-xs font-semibold uppercase tracking-widest text-[var(--mist-dim)] mt-3 mb-1.5 font-mono">${formatInlineMarkdown(match ? match[1] : "")}</h6>`
      );
      i++;
      continue;
    }
    if (/^#####\s+(.*)$/.test(trimmed)) {
      const match = trimmed.match(/^#####\s+(.*)$/);
      processedBlocks.push(
        `<h5 class="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[var(--mist-dim)] mt-4 mb-2 font-mono">${formatInlineMarkdown(match ? match[1] : "")}</h5>`
      );
      i++;
      continue;
    }
    if (/^####\s+(.*)$/.test(trimmed)) {
      const match = trimmed.match(/^####\s+(.*)$/);
      processedBlocks.push(
        `<h4 class="text-sm sm:text-base font-semibold text-[var(--cyan)] mt-5 mb-2 font-mono">${formatInlineMarkdown(match ? match[1] : "")}</h4>`
      );
      i++;
      continue;
    }
    if (/^###\s+(.*)$/.test(trimmed)) {
      const match = trimmed.match(/^###\s+(.*)$/);
      processedBlocks.push(
        `<h3 class="text-base sm:text-lg font-semibold text-[var(--amber)] mt-6 mb-2.5 font-mono">${formatInlineMarkdown(match ? match[1] : "")}</h3>`
      );
      i++;
      continue;
    }
    if (/^##\s+(.*)$/.test(trimmed)) {
      const match = trimmed.match(/^##\s+(.*)$/);
      processedBlocks.push(
        `<h2 class="text-lg sm:text-xl font-bold tracking-tight text-[var(--paper)] mt-7 mb-3 border-b border-[var(--line-soft)] pb-2 font-sans">${formatInlineMarkdown(match ? match[1] : "")}</h2>`
      );
      i++;
      continue;
    }
    if (/^#\s+(.*)$/.test(trimmed)) {
      const match = trimmed.match(/^#\s+(.*)$/);
      processedBlocks.push(
        `<h1 class="text-xl sm:text-2xl font-bold tracking-tight text-[var(--paper)] mt-8 mb-4 border-b border-[var(--line)] pb-2.5 font-sans">${formatInlineMarkdown(match ? match[1] : "")}</h1>`
      );
      i++;
      continue;
    }

    if (trimmed.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      processedBlocks.push(
        `<blockquote class="border-l-2 border-[var(--amber)] pl-4 py-2 my-4 bg-[var(--ink-800)]/40 rounded-r-lg italic text-[var(--mist)] text-xs sm:text-sm leading-relaxed font-sans">${formatInlineMarkdown(quoteLines.join(" "))}</blockquote>`
      );
      continue;
    }

    if (
      trimmed.startsWith("|") &&
      trimmed.endsWith("|") &&
      i + 1 < lines.length &&
      lines[i + 1].trim().startsWith("|")
    ) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }
      if (tableLines.length >= 2) {
        processedBlocks.push(parseMarkdownTable(tableLines));
        continue;
      }
    }

    if (/^[-*+]\s+/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < lines.length && /^[-*+]\s+/.test(lines[i].trim())) {
        let itemText = lines[i].trim().replace(/^[-*+]\s+/, "");
        if (/^\[\s\]\s+/.test(itemText)) {
          itemText = `<span class="inline-block w-3.5 h-3.5 mr-2 rounded border border-[var(--line)] align-middle"></span>${itemText.replace(/^\[\s\]\s+/, "")}`;
        } else if (/^\[x\]\s+/i.test(itemText)) {
          itemText = `<span class="inline-flex items-center justify-center w-3.5 h-3.5 mr-2 rounded bg-[var(--amber)] align-middle"><svg class="w-2.5 h-2.5 text-[#06121a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg></span>${itemText.replace(/^\[x\]\s+/i, "")}`;
        }
        listItems.push(itemText);
        i++;
      }
      processedBlocks.push(
        `<ul class="list-disc pl-5 space-y-1.5 my-3 text-[var(--mist)] text-xs sm:text-sm leading-relaxed">${listItems.map((item) => `<li>${formatInlineMarkdown(item)}</li>`).join("")}</ul>`
      );
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        const itemText = lines[i].trim().replace(/^\d+\.\s+/, "");
        listItems.push(itemText);
        i++;
      }
      processedBlocks.push(
        `<ol class="list-decimal pl-5 space-y-1.5 my-3 text-[var(--mist)] text-xs sm:text-sm leading-relaxed">${listItems.map((item) => `<li>${formatInlineMarkdown(item)}</li>`).join("")}</ol>`
      );
      continue;
    }

    const blockTagMatch = trimmed.match(/^<([a-zA-Z][a-zA-Z0-9]*)\b/i);
    const blockTagName = blockTagMatch ? blockTagMatch[1].toLowerCase() : null;
    const isBlockHtml = blockTagName !== null && BLOCK_ELEMENT_NAMES.has(blockTagName);

    if (isBlockHtml) {
      if (SELF_CLOSING_HTML_TAGS.has(blockTagName) || /\/>[\s]*$/.test(trimmed)) {
        processedBlocks.push(line);
        i++;
        continue;
      }

      const openRe = new RegExp(`<${blockTagName}\\b`, "gi");
      const closeRe = new RegExp(`<\\/${blockTagName}\\s*>`, "gi");

      const htmlLines: string[] = [line];
      i++;

      const firstLineOpens = (line.match(openRe) ?? []).length;
      const firstLineCloses = (line.match(closeRe) ?? []).length;
      let depth = firstLineOpens - firstLineCloses;

      while (i < lines.length && depth > 0) {
        const currentLine = lines[i];
        const opens = (currentLine.match(openRe) ?? []).length;
        const closes = (currentLine.match(closeRe) ?? []).length;
        depth += opens - closes;
        htmlLines.push(currentLine);
        i++;
      }

      processedBlocks.push(htmlLines.join("\n"));
      continue;
    }

    const paragraphLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^#{1,6}\s+/.test(lines[i].trim()) &&
      !lines[i].trim().startsWith(">") &&
      !/^[-*+]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !(lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) &&
      !/^(?:---|\*\*\*|___)$/.test(lines[i].trim()) &&
      !lines[i].trim().startsWith("<!--__")
    ) {
      paragraphLines.push(lines[i]);
      i++;
    }

    if (paragraphLines.length > 0) {
      processedBlocks.push(
        `<p class="mb-3 text-[var(--mist)] text-xs sm:text-sm leading-relaxed">${formatInlineMarkdown(paragraphLines.join(" "))}</p>`
      );
    }
  }

  let finalHtml = processedBlocks.join("\n");

  for (let idx = 0; idx < styleBlocks.length; idx++) {
    finalHtml = finalHtml.replace(`<!--__STYLE_BLOCK_${idx}__-->`, styleBlocks[idx]);
  }

  for (let idx = 0; idx < codeBlocks.length; idx++) {
    finalHtml = finalHtml.replace(`<!--__CODE_BLOCK_${idx}__-->`, codeBlocks[idx]);
  }

  return finalHtml;
}
