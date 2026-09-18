// application/dto/ContactSubmissionDTO.ts
// Data Transfer Object for contact submissions.
// Presentation-safe representation serialized to ISO date strings.

import type {
  ContactSubmission,
  SubmissionSource,
} from "../../domain/repositories/admin/IContactRepository";

export interface ContactSubmissionDTO {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly message: string;
  readonly source: SubmissionSource;
  readonly isRead: boolean;
  readonly createdAt: string;
}

export function toContactSubmissionDTO(submission: ContactSubmission): ContactSubmissionDTO {
  return {
    id: submission.id,
    name: submission.name,
    email: submission.email,
    message: submission.message,
    source: submission.source,
    isRead: submission.isRead,
    createdAt: submission.createdAt.toISOString(),
  };
}
