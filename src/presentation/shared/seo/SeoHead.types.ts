// presentation/shared/seo/SeoHead.types.ts
// Type contracts for declarative SEO head metadata component.

import type { BreadcrumbItem } from "../../../infrastructure/seo/JsonLdGenerator";

export interface SeoHeadProps {
  readonly title?: string;
  readonly description?: string;
  readonly canonicalPath?: string;
  readonly ogImage?: string;
  readonly noIndex?: boolean;
  readonly jsonLd?: object;
  readonly breadcrumbs?: readonly BreadcrumbItem[];
}
