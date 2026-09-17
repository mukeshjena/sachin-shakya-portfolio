// domain/repositories/admin/IEmailSender.ts
// Interface only — zero framework or infrastructure imports.
// This single interface is the adapter point for ALL outbound emails:
// OTP delivery (Step 20), contact form notification (Step 18), promo inquiry (Step 19).

/**
 * Payload for a transactional email.
 * The concrete implementation (EmailApiSender) adapts this to the
 * existing emailService.js API already used in the mukesh-portfolio reference.
 */
export interface EmailPayload {
  /** Recipient email address */
  to: string;
  /** Email subject line */
  subject: string;
  /** HTML body — use inline styles for maximum email client compat */
  html: string;
  /** Optional reply-to address (defaults to noreply behavior if omitted) */
  replyTo?: string;
}

/**
 * Contract for all outbound email delivery.
 * One adapter, three call sites (OTP, contact form, promo popup).
 */
export interface IEmailSender {
  /**
   * Sends a transactional email.
   * @throws {Error} if delivery fails — callers should handle and surface to the user.
   */
  send(payload: EmailPayload): Promise<void>;
}
