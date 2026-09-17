// domain/entities/admin/ContactSubmission.ts
// Pure domain entity modeling inbound client inquiries and recruitment contact submissions.

export type SubmissionSource = "contact_form" | "promo_popup" | "direct";

export interface ContactSubmission {
  /** Firestore document ID (timestamp-based or auto-generated) */
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly subject?: string;
  readonly message: string;
  readonly source: SubmissionSource;
  readonly ipHash?: string;
  readonly isRead: boolean;
  readonly isArchived: boolean;
  readonly respondedAt?: Date;
  readonly createdAt: Date;
}

export type CreateContactSubmissionInput = Omit<
  ContactSubmission,
  "id" | "isRead" | "isArchived" | "respondedAt" | "createdAt"
>;
