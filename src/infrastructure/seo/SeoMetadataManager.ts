// infrastructure/seo/SeoMetadataManager.ts
// Pure DOM manager for document head metadata, canonical URLs, OpenGraph, Twitter Cards, and JSON-LD.
// Clean Architecture: zero UI framework dependencies.

export interface OpenGraphMetadata {
  readonly title?: string;
  readonly description?: string;
  readonly image?: string;
  readonly url?: string;
  readonly type?: string;
}

export interface TwitterCardMetadata {
  readonly title?: string;
  readonly description?: string;
  readonly image?: string;
  readonly cardType?: "summary" | "summary_large_image";
}

export interface PageSeoOptions {
  readonly title: string;
  readonly description: string;
  readonly canonicalUrl?: string;
  readonly openGraph?: OpenGraphMetadata;
  readonly twitter?: TwitterCardMetadata;
  readonly noIndex?: boolean;
  readonly jsonLd?: object;
  readonly jsonLdId?: string;
}

export function setTitle(title: string): void {
  if (typeof document === "undefined") return;
  document.title = title;
}

export function setMetaTag(nameOrProperty: string, content: string, isProperty = false): void {
  if (typeof document === "undefined") return;
  const attribute = isProperty ? "property" : "name";
  let meta = document.querySelector(`meta[${attribute}="${nameOrProperty}"]`);

  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attribute, nameOrProperty);
    document.head.appendChild(meta);
  }

  meta.setAttribute("content", content);
}

export function setCanonicalUrl(url: string): void {
  if (typeof document === "undefined") return;
  let link = document.querySelector('link[rel="canonical"]');

  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }

  link.setAttribute("href", url);
}

export function setRobots(noIndex: boolean): void {
  const directive = noIndex ? "noindex, nofollow" : "index, follow";
  setMetaTag("robots", directive, false);
}

export function setOpenGraph(
  og: OpenGraphMetadata,
  defaultUrl = "https://shakya.mukeshjena.com"
): void {
  if (og.title) setMetaTag("og:title", og.title, true);
  if (og.description) setMetaTag("og:description", og.description, true);
  if (og.image) setMetaTag("og:image", og.image, true);
  setMetaTag("og:url", og.url || defaultUrl, true);
  setMetaTag("og:type", og.type || "website", true);
}

export function setTwitterCard(twitter: TwitterCardMetadata): void {
  setMetaTag("twitter:card", twitter.cardType || "summary_large_image", false);
  if (twitter.title) setMetaTag("twitter:title", twitter.title, false);
  if (twitter.description) setMetaTag("twitter:description", twitter.description, false);
  if (twitter.image) setMetaTag("twitter:image", twitter.image, false);
}

export function injectJsonLd(id: string, schema: object): void {
  if (typeof document === "undefined") return;
  let script = document.getElementById(id) as HTMLScriptElement | null;

  if (!script) {
    script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(schema, null, 2);
}

export function removeJsonLd(id: string): void {
  if (typeof document === "undefined") return;
  const script = document.getElementById(id);
  if (script) {
    script.remove();
  }
}

export function applyPageSeo(options: PageSeoOptions): void {
  setTitle(options.title);
  setMetaTag("description", options.description, false);

  if (options.canonicalUrl) {
    setCanonicalUrl(options.canonicalUrl);
  }

  setRobots(Boolean(options.noIndex));

  if (options.openGraph) {
    setOpenGraph(options.openGraph, options.canonicalUrl);
  }

  if (options.twitter) {
    setTwitterCard(options.twitter);
  }

  if (options.jsonLd && options.jsonLdId) {
    injectJsonLd(options.jsonLdId, options.jsonLd);
  }
}

export const SeoMetadataManager = {
  setTitle,
  setMetaTag,
  setCanonicalUrl,
  setRobots,
  setOpenGraph,
  setTwitterCard,
  injectJsonLd,
  removeJsonLd,
  applyPageSeo,
};
