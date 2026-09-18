// application/use-cases/auth/RequestAccessCodeUseCase.ts
// Generates, hashes, rate-limits, and sends 6-digit OTP admin access codes.
// Zero UI framework dependencies (Clean Architecture application layer).

import type { IAdminAccessRepository } from "../../../domain/repositories/admin/IAdminAccessRepository";
import type { IEmailSender } from "../../../domain/repositories/admin/IEmailSender";
import { AccessCode } from "../../../domain/value-objects/AccessCode";
import { sha256 } from "../../../infrastructure/crypto/crypto.utils";

export interface RequestAccessCodeInput {
  readonly email: string;
}

export interface RequestAccessCodeResult {
  readonly success: boolean;
  readonly email: string;
  readonly cooldownSeconds: number;
}

export interface IRequestAccessCodeUseCase {
  execute(input: RequestAccessCodeInput): Promise<RequestAccessCodeResult>;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_MS = 60_000; // 60 seconds
const CODE_VALIDITY_WINDOW_MS = 10 * 60_000; // 10 minutes

export class RequestAccessCodeUseCase implements IRequestAccessCodeUseCase {
  private readonly adminAccessRepo: IAdminAccessRepository;
  private readonly emailSender: IEmailSender;

  constructor(adminAccessRepo: IAdminAccessRepository, emailSender: IEmailSender) {
    this.adminAccessRepo = adminAccessRepo;
    this.emailSender = emailSender;
  }

  async execute(input: RequestAccessCodeInput): Promise<RequestAccessCodeResult> {
    const trimmed = input.email ? input.email.trim().toLowerCase() : "";

    // 1. Format validation
    if (!EMAIL_REGEX.test(trimmed)) {
      throw new Error("Please enter a valid administrator email address.");
    }

    // 2. Authorization check
    const isAuthorized = await this.adminAccessRepo.isAuthorizedEmail(trimmed);
    if (!isAuthorized) {
      throw new Error("This email address is not authorized for administrative access.");
    }

    // 3. Rate-limiting check (max 1 request per 60s per email)
    const emailHash = await sha256(trimmed);
    const lastRequest = await this.adminAccessRepo.getLastRequestTime(emailHash);
    if (lastRequest) {
      const elapsed = Date.now() - lastRequest.getTime();
      if (elapsed < RATE_LIMIT_WINDOW_MS) {
        const remainingSec = Math.ceil((RATE_LIMIT_WINDOW_MS - elapsed) / 1000);
        throw new Error(
          `Rate limit active. Please wait ${remainingSec} seconds before requesting a new access code.`
        );
      }
    }

    // 4. Generate random 6-digit access code
    const accessCode = AccessCode.generate();
    const plainCode = accessCode.toString();
    const codeHash = await sha256(plainCode);
    const expiresAt = new Date(Date.now() + CODE_VALIDITY_WINDOW_MS);

    // 5. Persist hashed access code to Firestore
    await this.adminAccessRepo.saveAccessCode(emailHash, codeHash, expiresAt);

    // 6. Transmit plain code via email
    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace; max-width: 540px; margin: 0 auto; padding: 28px; background-color: #08080a; color: #fafafa; border: 1px solid rgba(255,255,255,0.12); border-radius: 12px;">
        <div style="display: inline-block; padding: 4px 10px; background-color: #0f0f13; border: 1px solid rgba(255,176,32,0.3); border-radius: 9999px; color: #ffb020; font-size: 11px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">
          Sachin Shakya — Admin Access
        </div>
        <h2 style="color: #fafafa; margin-top: 16px; margin-bottom: 8px; font-size: 20px; font-weight: 700; letter-spacing: -0.5px;">
          Admin Authentication Code
        </h2>
        <p style="font-size: 13px; color: #a1a1aa; line-height: 1.6; margin-top: 0;">
          A single-use verification passcode has been generated for administrative access to the Sachin Shakya Admin Console.
        </p>
        
        <div style="margin: 28px 0; padding: 20px; background-color: #000000; border: 1px solid rgba(73,199,232,0.3); border-radius: 8px; text-align: center;">
          <span style="font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #49c7e8; text-shadow: 0 0 10px rgba(73,199,232,0.4);">
            ${plainCode}
          </span>
        </div>

        <p style="font-size: 12px; color: #71717a; line-height: 1.5;">
          • This code will expire in <strong>10 minutes</strong>.<br />
          • If you did not initiate this authentication request, please disregard this transmission immediately.
        </p>
        <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.08); margin: 20px 0;" />
        <p style="font-size: 11px; color: #52525b; margin: 0; font-family: monospace;">
          SYSTEM: SACHIN-SHAKYA-TELEMETRY // ID: ${emailHash.slice(0, 8)}
        </p>
      </div>
    `;

    try {
      await this.emailSender.send({
        to: trimmed,
        subject: `[Admin Security] ${plainCode} is your Sachin Shakya verification code`,
        html: emailHtml,
      });
    } catch (sendErr) {
      console.error("[RequestAccessCodeUseCase] Failed to dispatch OTP email:", sendErr);
      throw new Error(
        "Unable to deliver verification code email. Please verify connection or retry."
      );
    }

    return {
      success: true,
      email: trimmed,
      cooldownSeconds: 60,
    };
  }
}
