// presentation/sections/credentials/CredentialsSection.types.ts
// Contract types and data interfaces for the CredentialsSection component.

import type {
  AwardItem,
  CertificationItem,
  EducationItem,
} from "./constants/credentials.constants";

export interface CredentialsSectionState {
  readonly certifications: readonly CertificationItem[];
  readonly education: readonly EducationItem[];
  readonly awards: readonly AwardItem[];
}
