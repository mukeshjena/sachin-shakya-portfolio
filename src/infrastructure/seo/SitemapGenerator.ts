// infrastructure/seo/SitemapGenerator.ts
// Generates standard sitemaps.org compliant XML sitemaps for search engine crawlers.
// Clean Architecture: pure deterministic utility with zero framework dependencies.

export interface SitemapUrlEntry {
  readonly path: string;
  readonly lastModified?: Date | string;
  readonly changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  readonly priority?: number;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatDate(date?: Date | string): string {
  if (!date) return new Date().toISOString().split("T")[0] as string;
  if (typeof date === "string") {
    const d = new Date(date);
    if (!Number.isNaN(d.getTime())) {
      return d.toISOString().split("T")[0] as string;
    }
    return date.split("T")[0] as string;
  }
  return date.toISOString().split("T")[0] as string;
}

export function generateSitemapXml(
  entries: readonly SitemapUrlEntry[],
  baseUrl = "https://shakya.mukeshjena.com"
): string {
  const cleanBaseUrl = baseUrl.replace(/\/+$/, "");

  const urlsXml = entries
    .map((entry) => {
      const rawPath =
        typeof entry.path === "string"
          ? entry.path
          : (entry.path as { value?: string })?.value || String(entry.path || "");
      const cleanPath = rawPath.replace(/^\/+/, "");
      const fullUrl = cleanPath ? `${cleanBaseUrl}/${cleanPath}` : `${cleanBaseUrl}/`;
      const lastMod = formatDate(entry.lastModified);
      const changeFreq = entry.changeFrequency || "monthly";
      const priority =
        entry.priority !== undefined ? entry.priority.toFixed(1) : cleanPath ? "0.8" : "1.0";

      return [
        "  <url>",
        `    <loc>${escapeXml(fullUrl)}</loc>`,
        `    <lastmod>${lastMod}</lastmod>`,
        `    <changefreq>${changeFreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlsXml,
    "</urlset>",
    "",
  ].join("\n");
}

export const SitemapGenerator = {
  generateXml: generateSitemapXml,
};
