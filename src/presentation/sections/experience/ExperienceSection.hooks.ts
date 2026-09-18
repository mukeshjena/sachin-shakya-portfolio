// presentation/sections/experience/ExperienceSection.hooks.ts
// State and lifecycle logic for the Experience timeline section.
// Universal Separation of Concerns (Rule 13).

import { useState } from "react";
import { EXPERIENCE_ROLES } from "./constants/experience.constants";
import type { ExperienceSectionState } from "./ExperienceSection.types";

export function useExperienceSectionLogic(): ExperienceSectionState {
  const [activeRoleId, setActiveRoleId] = useState<string | null>(null);

  return {
    roles: EXPERIENCE_ROLES,
    activeRoleId,
    setActiveRoleId,
  };
}
