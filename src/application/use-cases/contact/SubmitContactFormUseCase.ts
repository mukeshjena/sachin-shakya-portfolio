// application/use-cases/contact/SubmitContactFormUseCase.ts
// Orchestration for contact and consultation submissions.
// Validates inputs, persists to Firestore contactSubmissions, and dispatches notification email.
// Zero UI framework dependencies (Clean Architecture application layer).

import type {
  IContactRepository,
  SubmissionSource,
} from "../../../domain/repositories/admin/IContactRepository";
import type { IEmailSender } from "../../../domain/repositories/admin/IEmailSender";
import { type ContactSubmissionDTO, toContactSubmissionDTO } from "../../dto/ContactSubmissionDTO";

export interface SubmitContactFormInput {
  readonly name: string;
  readonly email: string;
  readonly subject?: string;
  readonly message: string;
  readonly source?: SubmissionSource;
}

export interface ISubmitContactFormUseCase {
  execute(input: SubmitContactFormInput): Promise<ContactSubmissionDTO>;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class SubmitContactFormUseCase implements ISubmitContactFormUseCase {
  private readonly contactRepository: IContactRepository;
  private readonly emailSender: IEmailSender;

  constructor(contactRepository: IContactRepository, emailSender: IEmailSender) {
    this.contactRepository = contactRepository;
    this.emailSender = emailSender;
  }

  /**
   * Validates contact form submission, creates document in Firestore, and sends notification email.
   */
  async execute(input: SubmitContactFormInput): Promise<ContactSubmissionDTO> {
    const trimmedName = input.name ? input.name.trim() : "";
    const trimmedEmail = input.email ? input.email.trim() : "";
    const trimmedMessage = input.message ? input.message.trim() : "";
    const subject = input.subject
      ? input.subject.trim()
      : "Cloud Architecture Consultation Inquiry";

    // 1. Strict input validation
    if (trimmedName.length < 2) {
      throw new Error("Full name must be at least 2 characters.");
    }
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      throw new Error("Please provide a valid corporate or personal email address.");
    }
    if (trimmedMessage.length < 10) {
      throw new Error(
        "Message must be at least 10 characters describing your inquiry or project scope."
      );
    }

    // 2. Persist to Firestore contactSubmissions collection
    const submission = await this.contactRepository.create({
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMessage,
      source: input.source ?? "contact-form",
    });

    // 3. Dispatch transactional notification email via IEmailSender
    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #08080a; color: #fafafa; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;">
        <h2 style="color: #ffb020; margin-top: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px;">Executive Consultation Inquiry</h2>
        <p style="font-size: 14px; color: #a1a1aa; line-height: 1.6;">A new technical leadership or advisory inquiry has been submitted via the executive portfolio.</p>
        <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 20px 0;" />
        <p style="margin: 8px 0;"><strong>Name:</strong> ${trimmedName}</p>
        <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${trimmedEmail}" style="color: #49c7e8;">${trimmedEmail}</a></p>
        <p style="margin: 8px 0;"><strong>Subject:</strong> ${subject}</p>
        <p style="margin: 8px 0;"><strong>Source:</strong> ${input.source ?? "contact-form"}</p>
        <div style="margin-top: 16px; padding: 16px; background-color: #0f0f13; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px;">
          <strong style="color: #49c7e8; display: block; margin-bottom: 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Message / Project Scope:</strong>
          <p style="white-space: pre-wrap; margin: 0; color: #e8f1f4; font-size: 14px; line-height: 1.6;">${trimmedMessage}</p>
        </div>
      </div>
    `;

    try {
      await this.emailSender.send({
        to: "sachin.shakya@live.com",
        subject: `[Portfolio Inquiry] ${subject} — ${trimmedName}`,
        html: emailHtml,
        replyTo: trimmedEmail,
      });
    } catch (emailErr) {
      // Submission was safely saved to Firestore; log email error without failing submission
      console.error(
        "[SubmitContactFormUseCase] Outbound email failed but submission recorded:",
        emailErr
      );
    }

    return toContactSubmissionDTO(submission);
  }
}
