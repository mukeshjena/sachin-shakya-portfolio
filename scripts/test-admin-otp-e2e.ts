// scripts/test-admin-otp-e2e.ts
// Automated end-to-end integration test for Step 20: Admin OTP Access Flow.
// Verifies authorization whitelist, code generation, SHA-256 persistence,
// 60-second rate-limiting, invalid code rejection, and replay prevention.

import type { IRequestAccessCodeUseCase } from "../src/application/use-cases/auth/RequestAccessCodeUseCase";
import type { IVerifyAccessCodeUseCase } from "../src/application/use-cases/auth/VerifyAccessCodeUseCase";
import type { IAdminAccessRepository } from "../src/domain/repositories/admin/IAdminAccessRepository";
import { sha256 } from "../src/infrastructure/crypto/crypto.utils";
import { bootstrapContainer } from "../src/infrastructure/di/bootstrap";
import { container } from "../src/infrastructure/di/container";
import { DI_TOKENS } from "../src/infrastructure/di/tokens";

async function main() {
  console.log("==========================================================");
  console.log("Starting Step 20 Admin OTP Access Flow E2E Test Suite...");
  console.log("==========================================================");

  // 1. Initialize DI Container
  console.log("\n[1/7] Bootstrapping DI container...");
  bootstrapContainer();

  const adminRepo = container.resolve<IAdminAccessRepository>(DI_TOKENS.AdminAccessRepository);
  const requestAccessCode = container.resolve<IRequestAccessCodeUseCase>(
    DI_TOKENS.RequestAccessCode
  );
  const verifyAccessCode = container.resolve<IVerifyAccessCodeUseCase>(DI_TOKENS.VerifyAccessCode);

  console.log("✓ DI dependencies resolved successfully!");

  // 2. Verify Root Admin Whitelist & Unknown Email Rejection
  console.log("\n[2/7] Verifying email authorization whitelist...");
  const isRootAuthorized = await adminRepo.isAuthorizedEmail("sachin.shakya@live.com");
  if (!isRootAuthorized) {
    throw new Error("Root admin email sachin.shakya@live.com was not authorized!");
  }
  console.log("✓ Root admin 'sachin.shakya@live.com' authorized by default.");

  let caughtUnauthorized = false;
  try {
    await requestAccessCode.execute({ email: "random.intruder@unknown-domain.io" });
  } catch (err) {
    caughtUnauthorized = true;
    console.log(`✓ Unauthorized email rejected as expected: "${(err as Error).message}"`);
  }
  if (!caughtUnauthorized) {
    throw new Error("Failed to reject unauthorized email address!");
  }

  // 3. Authorize Test Administrator
  console.log("\n[3/7] Authorizing temporary test administrator email...");
  const testAdminEmail = "sre.test.admin@enterprise-cloud.io";
  await adminRepo.addAuthorizedEmail(testAdminEmail);
  const isTestAuthorized = await adminRepo.isAuthorizedEmail(testAdminEmail);
  if (!isTestAuthorized) {
    throw new Error(`Failed to authorize test admin email: ${testAdminEmail}`);
  }
  console.log(`✓ '${testAdminEmail}' successfully added to authorized list.`);

  // 4. Request Access Code
  console.log("\n[4/7] Requesting 6-digit access code for authorized administrator...");
  const reqResult = await requestAccessCode.execute({ email: testAdminEmail });
  console.log("✓ Access code requested successfully:");
  console.log(`  - Target: ${reqResult.email}`);
  console.log(`  - Cooldown: ${reqResult.cooldownSeconds}s`);

  // 5. Test Rate-Limiting (Immediate Re-request)
  console.log("\n[5/7] Testing 60-second rate-limiting enforcement...");
  let caughtRateLimit = false;
  try {
    await requestAccessCode.execute({ email: testAdminEmail });
  } catch (err) {
    caughtRateLimit = true;
    console.log(`✓ Rate limit triggered as expected: "${(err as Error).message}"`);
  }
  if (!caughtRateLimit) {
    throw new Error("Rate limiting failed to block immediate subsequent code request!");
  }

  // 6. Test Invalid Code Rejection
  console.log("\n[6/7] Testing rejection of incorrect access code...");
  let caughtInvalidCode = false;
  try {
    await verifyAccessCode.execute({
      email: testAdminEmail,
      code: "000000",
    });
  } catch (err) {
    caughtInvalidCode = true;
    console.log(`✓ Invalid code rejected as expected: "${(err as Error).message}"`);
  }
  if (!caughtInvalidCode) {
    throw new Error("Failed to reject invalid 6-digit code!");
  }

  // 7. Verify Known Code Verification & Replay Prevention
  console.log("\n[7/7] Testing deterministic verification & replay attack prevention...");
  const knownCode = "847291";
  const emailHash = await sha256(testAdminEmail);
  const codeHash = await sha256(knownCode);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  // Directly seed a known active code record
  await adminRepo.saveAccessCode(emailHash, codeHash, expiresAt);

  // Verify the known code
  const authResult = await verifyAccessCode.execute({
    email: testAdminEmail,
    code: knownCode,
  });

  if (!authResult.success || authResult.email !== testAdminEmail) {
    throw new Error("Failed to authenticate session with valid code!");
  }
  console.log("✓ Session successfully authenticated:");
  console.log(`  - Authenticated Email: ${authResult.email}`);
  console.log(`  - Session Expires: ${new Date(authResult.tokenExpiresAt).toISOString()}`);

  // Replay test: Attempting to verify the exact same code again MUST fail
  let caughtReplay = false;
  try {
    await verifyAccessCode.execute({
      email: testAdminEmail,
      code: knownCode,
    });
  } catch (err) {
    caughtReplay = true;
    console.log(`✓ Replay attack blocked: "${(err as Error).message}"`);
  }
  if (!caughtReplay) {
    throw new Error("Replay attack succeeded! Used code was not invalidated.");
  }

  // Cleanup temporary test email from authorized whitelist
  await adminRepo.removeAuthorizedEmail(testAdminEmail);
  console.log(`✓ Test admin '${testAdminEmail}' removed from whitelist.`);

  console.log("\n==========================================================");
  console.log("🎉 ALL STEP 20 ADMIN OTP ACCESS FLOW TESTS PASSED!");
  console.log("==========================================================");
}

main().catch((err) => {
  console.error("\n❌ E2E TEST SUITE FAILED:", err);
  process.exit(1);
});
