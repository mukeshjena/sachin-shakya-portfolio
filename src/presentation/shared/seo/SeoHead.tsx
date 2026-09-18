// presentation/shared/seo/SeoHead.tsx
// Pure declarative head metadata and JSON-LD injection component.
// Universal Separation of Concerns (Rule 13) — state and DOM logic live in SeoHead.hooks.ts.

import type React from "react";
import { useSeoHead } from "./SeoHead.hooks";
import type { SeoHeadProps } from "./SeoHead.types";

export const SeoHead: React.FC<SeoHeadProps> = (props) => {
  useSeoHead(props);
  return null;
};
