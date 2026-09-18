// presentation/sections/credentials/CredentialsSection.hooks.ts
// State and lifecycle logic for the Credentials section.
// Universal Separation of Concerns (Rule 13).

import { useMemo } from "react";
import type { CredentialsSectionState } from "./CredentialsSection.types";
import {
  type AwardItem,
  CERTIFICATIONS,
  type CertificationItem,
  CREDENTIALS_COPY,
  EDUCATION_RECORDS,
  type EducationItem,
  HONORS_AWARDS,
} from "./constants/credentials.constants";

export function useCredentialsSectionLogic(
  content?: Record<string, unknown>
): CredentialsSectionState {
  const certifications = useMemo<readonly CertificationItem[]>(() => {
    if (
      content?.certifications &&
      Array.isArray(content.certifications) &&
      content.certifications.length > 0
    ) {
      return content.certifications as readonly CertificationItem[];
    }
    return CERTIFICATIONS;
  }, [content?.certifications]);

  const education = useMemo<readonly EducationItem[]>(() => {
    if (content?.education && Array.isArray(content.education) && content.education.length > 0) {
      return content.education as readonly EducationItem[];
    }
    return EDUCATION_RECORDS;
  }, [content?.education]);

  const awards = useMemo<readonly AwardItem[]>(() => {
    if (content?.awards && Array.isArray(content.awards) && content.awards.length > 0) {
      return content.awards as readonly AwardItem[];
    }
    return HONORS_AWARDS;
  }, [content?.awards]);

  const headline =
    typeof content?.heading === "string"
      ? content.heading
      : typeof content?.headline === "string"
        ? content.headline
        : CREDENTIALS_COPY.headline;

  const subheadline =
    typeof content?.subheading === "string"
      ? content.subheading
      : typeof content?.subheadline === "string"
        ? content.subheadline
        : CREDENTIALS_COPY.subheadline;

  return {
    certifications,
    education,
    awards,
    headline,
    subheadline,
  };
}
