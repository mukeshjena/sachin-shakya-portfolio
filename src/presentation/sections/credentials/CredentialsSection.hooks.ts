// presentation/sections/credentials/CredentialsSection.hooks.ts
// State and lifecycle logic for the Credentials section.
// Universal Separation of Concerns (Rule 13).

import type { CredentialsSectionState } from "./CredentialsSection.types";
import {
  CERTIFICATIONS,
  EDUCATION_RECORDS,
  HONORS_AWARDS,
} from "./constants/credentials.constants";

export function useCredentialsSectionLogic(): CredentialsSectionState {
  return {
    certifications: CERTIFICATIONS,
    education: EDUCATION_RECORDS,
    awards: HONORS_AWARDS,
  };
}
