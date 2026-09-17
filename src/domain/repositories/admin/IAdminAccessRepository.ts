// domain/repositories/admin/IAdminAccessRepository.ts
// Interface only — zero framework or infrastructure imports.

/**
 * Stored representation of a hashed access code in Firestore.
 * The plain code is NEVER persisted — only its hash is.
 */
export interface StoredAccessCode {
  id: string;
  /** SHA-256 hash of the admin's email (for privacy in Firestore) */
  emailHash: string;
  /** bcrypt or SHA-256 hash of the 6-digit code */
  codeHash: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

/**
 * Contract for admin access control persistence.
 * Covers both the authorized-emails list and the OTP code lifecycle.
 */
export interface IAdminAccessRepository {
  // ── Authorized email management ─────────────────────────────────────────────

  /** Returns all authorized admin email addresses */
  getAuthorizedEmails(): Promise<string[]>;

  /** Adds an email to the authorized list */
  addAuthorizedEmail(email: string): Promise<void>;

  /** Removes an email from the authorized list */
  removeAuthorizedEmail(email: string): Promise<void>;

  /** Returns true if the email is on the authorized list */
  isAuthorizedEmail(email: string): Promise<boolean>;

  // ── OTP code lifecycle ───────────────────────────────────────────────────────

  /** Persists a new hashed code; returns the Firestore document ID */
  saveAccessCode(emailHash: string, codeHash: string, expiresAt: Date): Promise<string>;

  /** Finds the most recent active (unused, unexpired) code for an email hash */
  findActiveCode(emailHash: string): Promise<StoredAccessCode | null>;

  /** Marks a code as used to prevent replay attacks */
  markCodeUsed(id: string): Promise<void>;

  /**
   * Returns the creation timestamp of the last code request for an email.
   * Used for rate-limiting: if < 60 s ago, block new requests.
   */
  getLastRequestTime(emailHash: string): Promise<Date | null>;
}
