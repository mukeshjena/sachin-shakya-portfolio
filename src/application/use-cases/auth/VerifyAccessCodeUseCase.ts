// application/use-cases/auth/VerifyAccessCodeUseCase.ts
// Validates 6-digit OTP code against hashed records, invalidates used code, and issues session.
// Zero UI framework dependencies (Clean Architecture application layer).

import type { IAdminAccessRepository } from "../../../domain/repositories/admin/IAdminAccessRepository";
import { AccessCode } from "../../../domain/value-objects/AccessCode";
import { sha256 } from "../../../infrastructure/crypto/crypto.utils";

export interface VerifyAccessCodeInput {
  readonly email: string;
  readonly code: string;
}

export interface VerifyAccessCodeResult {
  readonly success: boolean;
  readonly email: string;
  readonly tokenExpiresAt: number;
}

export interface IVerifyAccessCodeUseCase {
  execute(input: VerifyAccessCodeInput): Promise<VerifyAccessCodeResult>;
}

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export class VerifyAccessCodeUseCase implements IVerifyAccessCodeUseCase {
  private readonly adminAccessRepo: IAdminAccessRepository;

  constructor(adminAccessRepo: IAdminAccessRepository) {
    this.adminAccessRepo = adminAccessRepo;
  }

  async execute(input: VerifyAccessCodeInput): Promise<VerifyAccessCodeResult> {
    const trimmedEmail = input.email ? input.email.trim().toLowerCase() : "";
    const trimmedCode = input.code ? input.code.trim() : "";

    // 1. Validate inputs
    if (!trimmedEmail) {
      throw new Error("Email address is required for authentication.");
    }

    // Throws if code is not exactly 6 digits
    const accessCode = new AccessCode(trimmedCode);

    // 2. Compute hashes
    const emailHash = await sha256(trimmedEmail);
    const codeHash = await sha256(accessCode.toString());

    // 3. Look up active code
    const activeCode = await this.adminAccessRepo.findActiveCode(emailHash);
    if (!activeCode) {
      throw new Error(
        "No active verification code found for this email. Please request a new code."
      );
    }

    if (activeCode.used) {
      throw new Error("This verification code has already been used. Please request a new code.");
    }

    if (activeCode.expiresAt.getTime() <= Date.now()) {
      throw new Error("Verification code has expired. Please request a new code.");
    }

    if (activeCode.codeHash !== codeHash) {
      throw new Error("Invalid verification code. Please check the 6 digits and try again.");
    }

    // 4. Invalidate code to prevent replay attacks
    await this.adminAccessRepo.markCodeUsed(activeCode.id);

    // 5. Issue 24-hour authenticated session
    const tokenExpiresAt = Date.now() + SESSION_DURATION_MS;

    return {
      success: true,
      email: trimmedEmail,
      tokenExpiresAt,
    };
  }
}
