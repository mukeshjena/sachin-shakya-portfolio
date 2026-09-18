// application/use-cases/promo/SubmitPromoInquiryUseCase.ts
// Orchestration for consultative promo popup submissions.
// Validates inquiry details, creates Firestore contactSubmissions record (source: "promo-popup"),
// and sends executive notification email via IEmailSender.
// Zero UI framework dependencies (Clean Architecture application layer).

import type { IContactRepository } from "../../../domain/repositories/admin/IContactRepository";
import type { IEmailSender } from "../../../domain/repositories/admin/IEmailSender";
import { type ContactSubmissionDTO, toContactSubmissionDTO } from "../../dto/ContactSubmissionDTO";

export interface SubmitPromoInquiryInput {
  readonly name: string;
  readonly email: string;
  readonly interestArea?: string;
  readonly message?: string;
}

export interface ISubmitPromoInquiryUseCase {
  execute(input: SubmitPromoInquiryInput): Promise<ContactSubmissionDTO>;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class SubmitPromoInquiryUseCase implements ISubmitPromoInquiryUseCase {
  private readonly contactRepository: IContactRepository;
  private readonly emailSender: IEmailSender;

  constructor(contactRepository: IContactRepository, emailSender: IEmailSender) {
    this.contactRepository = contactRepository;
    this.emailSender = emailSender;
  }

  /**
   * Validates consultative promo inquiry, writes to Firestore contactSubmissions, and dispatches notification email.
   */
  async execute(input: SubmitPromoInquiryInput): Promise<ContactSubmissionDTO> {
    const trimmedName = input.name ? input.name.trim() : "";
    const trimmedEmail = input.email ? input.email.trim() : "";
    const interest = input.interestArea ? input.interestArea.trim() : "Cloud Architecture Review";
    const optionalMsg = input.message ? input.message.trim() : "";

    // 1. Strict validation
    if (trimmedName.length < 2) {
      throw new Error("Full name must be at least 2 characters.");
    }
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      throw new Error("Please provide a valid corporate or personal email address.");
    }

    const compiledMessage = optionalMsg
      ? `[Interest: ${interest}]\n\n${optionalMsg}`
      : `[Interest: ${interest}]\nRequested a 30-minute cloud architecture and cost optimization consultation.`;

    // 2. Persist to Firestore contactSubmissions with source: "promo-popup"
    const submission = await this.contactRepository.create({
      name: trimmedName,
      email: trimmedEmail,
      message: compiledMessage,
      source: "promo-popup",
    });

    // 3. Dispatch transactional notification email
    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #08080a; color: #fafafa; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;">
        <h2 style="color: #ffb020; margin-top: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px;">Consultative Promo Inquiry</h2>
        <p style="font-size: 14px; color: #a1a1aa; line-height: 1.6;">A new prospective client requested an executive consultation via the interactive promo modal.</p>
        <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 20px 0;" />
        <p style="margin: 8px 0;"><strong>Name:</strong> ${trimmedName}</p>
        <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${trimmedEmail}" style="color: #49c7e8;">${trimmedEmail}</a></p>
        <p style="margin: 8px 0;"><strong>Consultation Focus:</strong> ${interest}</p>
        <p style="margin: 8px 0;"><strong>Source:</strong> promo-popup</p>
        <div style="margin-top: 16px; padding: 16px; background-color: #0f0f13; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px;">
          <strong style="color: #49c7e8; display: block; margin-bottom: 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Message / Context:</strong>
          <p style="white-space: pre-wrap; margin: 0; color: #e8f1f4; font-size: 14px; line-height: 1.6;">${compiledMessage}</p>
        </div>
      </div>
    `;

    try {
      await this.emailSender.send({
        to: "sachin.shakya@live.com",
        subject: `[Promo Consultation] Cloud Review Request — ${trimmedName}`,
        html: emailHtml,
        replyTo: trimmedEmail,
      });
    } catch (emailErr) {
      console.error(
        "[SubmitPromoInquiryUseCase] Outbound email failed but submission recorded:",
        emailErr
      );
    }

    return toContactSubmissionDTO(submission);
  }
}
