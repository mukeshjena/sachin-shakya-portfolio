// domain/repositories/admin/IContactRepository.ts
// Interface only — zero framework or infrastructure imports.

/** Source of the submission — used for inbox filtering in the admin panel */
export type SubmissionSource = "contact-form" | "promo-popup";

/** A contact or inquiry submission stored in Firestore */
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  source: SubmissionSource;
  /** Admin has viewed this submission in the inbox */
  isRead: boolean;
  createdAt: Date;
}

export type CreateContactInput = Omit<ContactSubmission, "id" | "isRead" | "createdAt">;

/**
 * Contract for contact submission persistence.
 * Implemented by FirestoreContactRepository in the infrastructure layer.
 */
export interface IContactRepository {
  /** Returns all submissions, newest first — admin inbox use */
  getAll(): Promise<ContactSubmission[]>;

  /** Returns unread submissions count — for admin badge indicator */
  getUnreadCount(): Promise<number>;

  /** Creates a new submission and returns it with server-assigned ID + timestamps */
  create(input: CreateContactInput): Promise<ContactSubmission>;

  /** Marks a submission as read in the admin inbox */
  markRead(id: string): Promise<void>;
}
