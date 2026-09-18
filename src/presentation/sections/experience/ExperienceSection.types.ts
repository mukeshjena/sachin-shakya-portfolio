// presentation/sections/experience/ExperienceSection.types.ts
// Contract types and UI state for the ExperienceSection component.

import type { ExperienceRole } from "./constants/experience.constants";

export interface ExperienceSectionProps {
  readonly content?: Record<string, unknown>;
}

export interface ExperienceSectionState {
  readonly roles: readonly ExperienceRole[];
  readonly activeRoleId: string | null;
  readonly setActiveRoleId: (id: string | null) => void;
  readonly headline?: string;
  readonly subheadline?: string;
}
