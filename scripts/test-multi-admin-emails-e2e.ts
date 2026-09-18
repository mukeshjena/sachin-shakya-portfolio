// scripts/test-multi-admin-emails-e2e.ts
// Automated end-to-end integration test for Step 21: Multi-Email Admin Authorization.
// Verifies DI container resolution, root admin immutability, delegated admin whitelisting,
// duplicate/invalid input rejection, multi-admin OTP generation, and access revocation.

import type { IAddAdminEmailUseCase } from "../src/application/use-cases/admin-users/AddAdminEmailUseCase";
import type { IGetAuthorizedEmailsUseCase } from "../src/application/use-cases/admin-users/GetAuthorizedEmailsUseCase";
import type { IRemoveAdminEmailUseCase } from "../src/application/use-cases/admin-users/RemoveAdminEmailUseCase";
import type { IRequestAccessCodeUseCase } from "../src/application/use-cases/auth/RequestAccessCodeUseCase";
import type { IAdminAccessRepository } from "../src/domain/repositories/admin/IAdminAccessRepository";
import { bootstrapContainer } from "../src/infrastructure/di/bootstrap";
import { container } from "../src/infrastructure/di/container";
import { DI_TOKENS } from "../src/infrastructure/di/tokens";

async function main() {
  console.log("==================================================================");
  console.log("Starting Step 21 Multi-Email Admin Authorization E2E Test Suite...");
  console.log("==================================================================");

  // 1. Initialize DI Container
  console.log("\n[1/7] Bootstrapping DI container & resolving dependencies...");
  bootstrapContainer();

  const getAuthorizedEmails = container.resolve<IGetAuthorizedEmailsUseCase>(
    DI_TOKENS.GetAuthorizedEmails
  );
  const addAdminEmail = container.resolve<IAddAdminEmailUseCase>(DI_TOKENS.AddAdminEmail);
  const removeAdminEmail = container.resolve<IRemoveAdminEmailUseCase>(DI_TOKENS.RemoveAdminEmail);
  const adminRepo = container.resolve<IAdminAccessRepository>(DI_TOKENS.AdminAccessRepository);
  const requestAccessCode = container.resolve<IRequestAccessCodeUseCase>(
    DI_TOKENS.RequestAccessCode
  );

  console.log("✓ All Step 21 DI tokens resolved successfully!");

  // 2. Verify Root Admin Presence in Whitelist
  console.log("\n[2/7] Verifying primary root administrator presence...");
  const initialEmails = await getAuthorizedEmails.execute();
  console.log(`  - Initial authorized count: ${initialEmails.length}`);
  console.log(`  - Whitelisted entries: ${JSON.stringify(initialEmails)}`);

  const rootEmail = "sachin.shakya@live.com";
  if (!initialEmails.includes(rootEmail)) {
    throw new Error(`Root admin '${rootEmail}' not found in authorized emails list!`);
  }
  console.log(`✓ Root admin '${rootEmail}' is present and whitelisted.`);

  // 3. Test Root Admin Immutability (Removal Prevention)
  console.log("\n[3/7] Testing strict root admin immutability invariant...");
  let rootDeletionBlocked = false;
  try {
    await removeAdminEmail.execute({ email: rootEmail });
  } catch (err) {
    rootDeletionBlocked = true;
    console.log(`✓ Root admin removal rejected as expected: "${(err as Error).message}"`);
  }

  if (!rootDeletionBlocked) {
    throw new Error("CRITICAL SECURITY FAILURE: Root admin was not protected against removal!");
  }

  // 4. Test Adding Delegated Team Administrator
  console.log("\n[4/7] Testing delegated admin addition and validation...");
  const delegatedEmail = "co.architect.test@eptura.com";

  // Invalid email format test
  let invalidFormatBlocked = false;
  try {
    await addAdminEmail.execute({ email: "invalid-email-format" });
  } catch {
    invalidFormatBlocked = true;
    console.log("✓ Malformed email format rejected.");
  }
  if (!invalidFormatBlocked) {
    throw new Error("Failed to block malformed email string!");
  }

  // Add delegated admin
  const addResult = await addAdminEmail.execute({ email: delegatedEmail });
  if (!addResult.success || addResult.email !== delegatedEmail) {
    throw new Error(`Failed to add delegated admin: ${delegatedEmail}`);
  }
  console.log(`✓ Delegated admin '${delegatedEmail}' whitelisted successfully.`);

  // Duplicate addition test
  let duplicateBlocked = false;
  try {
    await addAdminEmail.execute({ email: delegatedEmail });
  } catch {
    duplicateBlocked = true;
    console.log("✓ Duplicate admin addition blocked as expected.");
  }
  if (!duplicateBlocked) {
    throw new Error("Failed to prevent duplicate administrator addition!");
  }

  // Verify list updated
  const updatedEmails = await getAuthorizedEmails.execute();
  if (!updatedEmails.includes(delegatedEmail)) {
    throw new Error(`Delegated admin '${delegatedEmail}' not found in updated whitelist!`);
  }
  console.log(`✓ Whitelist refreshed: ${JSON.stringify(updatedEmails)}`);

  // 5. Verify Multi-Admin OTP Access Flow for Delegated Admin
  console.log("\n[5/7] Verifying OTP generation for delegated administrator...");
  const otpResult = await requestAccessCode.execute({ email: delegatedEmail });
  if (otpResult.email !== delegatedEmail || otpResult.cooldownSeconds <= 0) {
    throw new Error("Failed to generate OTP access code for delegated admin!");
  }
  console.log(
    `✓ Access code successfully requested for '${delegatedEmail}' (cooldown: ${otpResult.cooldownSeconds}s)`
  );

  // 6. Test Admin Access Revocation
  console.log("\n[6/7] Testing administrative access revocation...");
  const removeResult = await removeAdminEmail.execute({ email: delegatedEmail });
  if (!removeResult.success || removeResult.email !== delegatedEmail) {
    throw new Error(`Failed to revoke delegated admin: ${delegatedEmail}`);
  }
  console.log(`✓ Delegated admin '${delegatedEmail}' revoked successfully.`);

  // Verify repository state
  const isStillAuthorized = await adminRepo.isAuthorizedEmail(delegatedEmail);
  if (isStillAuthorized) {
    throw new Error(`Revoked email '${delegatedEmail}' is still recognized as authorized!`);
  }

  const finalEmails = await getAuthorizedEmails.execute();
  if (finalEmails.includes(delegatedEmail)) {
    throw new Error(`Revoked email '${delegatedEmail}' still appears in whitelist!`);
  }
  console.log(`✓ Final authorized whitelist verified: ${JSON.stringify(finalEmails)}`);

  // 7. Test Non-Authorized Revocation Invariant
  console.log("\n[7/7] Testing revocation attempt for non-existent admin...");
  let nonExistentBlocked = false;
  try {
    await removeAdminEmail.execute({ email: "ghost.user@doesnotexist.io" });
  } catch {
    nonExistentBlocked = true;
    console.log("✓ Revocation of non-authorized email safely rejected.");
  }
  if (!nonExistentBlocked) {
    throw new Error("Failed to reject revocation of non-authorized email!");
  }

  console.log("\n==================================================================");
  console.log("ALL STEP 21 MULTI-EMAIL ADMIN AUTHORIZATION TESTS PASSED! (7/7)");
  console.log("==================================================================");
}

main().catch((err) => {
  console.error("\n❌ Step 21 E2E Test Suite FAILED:");
  console.error(err);
  process.exit(1);
});
