// presentation/sections/experience/ExperienceSection.types.ts
// Contract types and UI state for the ExperienceSection component.

import type { ExperienceRole } from "./constants/experience.constants";

export interface ExperienceSectionState {
  readonly roles: readonly ExperienceRole[];
  readonly activeRoleId: string | null;
  readonly setActiveRoleId: (id: string | null) => void;
}
