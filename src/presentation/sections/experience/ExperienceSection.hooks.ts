// presentation/sections/experience/ExperienceSection.hooks.ts
// State and lifecycle logic for the Experience timeline section.
// Universal Separation of Concerns (Rule 13).

import { useMemo, useState } from "react";
import {
  EXPERIENCE_COPY,
  EXPERIENCE_ROLES,
  type ExperienceRole,
} from "./constants/experience.constants";
import type { ExperienceSectionState } from "./ExperienceSection.types";

export function useExperienceSectionLogic(
  content?: Record<string, unknown>
): ExperienceSectionState {
  const [activeRoleId, setActiveRoleId] = useState<string | null>(null);

  const roles = useMemo<readonly ExperienceRole[]>(() => {
    if (content?.roles && Array.isArray(content.roles) && content.roles.length > 0) {
      return content.roles as readonly ExperienceRole[];
    }
    return EXPERIENCE_ROLES;
  }, [content?.roles]);

  const headline =
    typeof content?.heading === "string"
      ? content.heading
      : typeof content?.headline === "string"
        ? content.headline
        : EXPERIENCE_COPY.headline;

  const subheadline =
    typeof content?.subheading === "string"
      ? content.subheading
      : typeof content?.subheadline === "string"
        ? content.subheadline
        : EXPERIENCE_COPY.subheadline;

  return {
    roles,
    activeRoleId,
    setActiveRoleId,
    headline,
    subheadline,
  };
}
