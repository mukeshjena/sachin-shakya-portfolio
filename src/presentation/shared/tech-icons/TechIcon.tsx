// presentation/shared/tech-icons/TechIcon.tsx
// Declarative component rendering technology iconography.
// Strictly zero emojis (Rule 3) and shadow-free.

import type { TechIconProps } from "./techIcon.types";
import { resolveTechIcon } from "./techIcon.utils";

export function TechIcon({ name, className = "w-3 h-3" }: TechIconProps) {
  return <>{resolveTechIcon(name, className)}</>;
}
