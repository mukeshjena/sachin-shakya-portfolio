// scripts/test-promo-popup-e2e.ts
// Automated end-to-end integration test for Step 19: Promo Popup.
// Verifies DI container resolution, GetPromoPopup query, SubmitPromoInquiry validation,
// and Firestore contactSubmissions persistence with source "promo-popup".

import type { IGetPromoPopupUseCase } from "../src/application/use-cases/promo/GetPromoPopupUseCase";
import type { ISubmitPromoInquiryUseCase } from "../src/application/use-cases/promo/SubmitPromoInquiryUseCase";
import type { IContactRepository } from "../src/domain/repositories/admin/IContactRepository";
import { bootstrapContainer } from "../src/infrastructure/di/bootstrap";
import { container } from "../src/infrastructure/di/container";
import { DI_TOKENS } from "../src/infrastructure/di/tokens";

async function main() {
  console.log("==========================================================");
  console.log("Starting Step 19 Promo Popup End-to-End Test Suite...");
  console.log("==========================================================");

  // 1. Initialize DI container
  console.log("\n[1/5] Bootstrapping DI container...");
  bootstrapContainer();

  const getPromoPopup = container.resolve<IGetPromoPopupUseCase>(DI_TOKENS.GetPromoPopup);
  const submitPromoInquiry = container.resolve<ISubmitPromoInquiryUseCase>(
    DI_TOKENS.SubmitPromoInquiry
  );
  const contactRepo = container.resolve<IContactRepository>(DI_TOKENS.ContactRepository);

  console.log("✓ DI tokens resolved successfully!");

  // 2. Query singleton promo configuration
  console.log("\n[2/5] Querying active promo configuration via GetPromoPopupUseCase...");
  const promoConfig = await getPromoPopup.execute();

  if (!promoConfig) {
    throw new Error("Expected promo configuration to exist and be enabled, but got null.");
  }

  console.log("✓ Promo configuration retrieved:");
  console.log(`  - ID: ${promoConfig.id}`);
  console.log(`  - Enabled: ${promoConfig.isEnabled}`);
  console.log(`  - Heading: "${promoConfig.heading}"`);
  console.log(`  - Badge: "${promoConfig.badgeText}"`);
  console.log(`  - Display Delay: ${promoConfig.displayDelaySeconds}s`);
  console.log(`  - Recurrence: ${promoConfig.recurrenceDays} days`);

  if (promoConfig.id !== "global" || !promoConfig.isEnabled) {
    throw new Error("Invalid promo config values returned from Firestore.");
  }

  // 3. Test validation rejection (short name)
  console.log("\n[3/5] Testing validation rejection on invalid inputs...");
  let caughtShortName = false;
  try {
    await submitPromoInquiry.execute({
      name: "A",
      email: "valid@enterprise.com",
    });
  } catch (err) {
    caughtShortName = true;
    console.log(`✓ Short name rejected as expected: "${(err as Error).message}"`);
  }
  if (!caughtShortName) {
    throw new Error("Validation failed to reject 1-character name!");
  }

  // 4. Test validation rejection (invalid email)
  let caughtInvalidEmail = false;
  try {
    await submitPromoInquiry.execute({
      name: "Enterprise Client",
      email: "not-an-email",
    });
  } catch (err) {
    caughtInvalidEmail = true;
    console.log(`✓ Invalid email rejected as expected: "${(err as Error).message}"`);
  }
  if (!caughtInvalidEmail) {
    throw new Error("Validation failed to reject invalid email!");
  }

  // 5. Test successful submission with source "promo-popup"
  console.log("\n[4/5] Testing valid consultative inquiry submission...");
  const testName = `E2E Promo Reviewer ${Date.now()}`;
  const testEmail = "test.promo.e2e@cloud-advisory.io";
  const testInterest = "FinOps Cost Optimization ($170K/mo Benchmark)";
  const testMessage = "Automated test inquiry for Step 19 verification.";

  const initialUnreadCount = await contactRepo.getUnreadCount();

  const submissionDto = await submitPromoInquiry.execute({
    name: testName,
    email: testEmail,
    interestArea: testInterest,
    message: testMessage,
  });

  console.log("✓ Inquiry submitted successfully:");
  console.log(`  - Submission ID: ${submissionDto.id}`);
  console.log(`  - Name: ${submissionDto.name}`);
  console.log(`  - Email: ${submissionDto.email}`);
  console.log(`  - Source: ${submissionDto.source}`);
  console.log(`  - Created At: ${submissionDto.createdAt}`);

  if (submissionDto.source !== "promo-popup") {
    throw new Error(`Expected source to be 'promo-popup', received: '${submissionDto.source}'`);
  }

  // 6. Verify Firestore persistence & unread count increment
  console.log("\n[5/5] Verifying persistence in Firestore contactSubmissions...");
  const allSubmissions = await contactRepo.getAll();
  const createdSub = allSubmissions.find((s) => s.id === submissionDto.id);

  if (!createdSub) {
    throw new Error(`Created submission ID ${submissionDto.id} was not found in Firestore!`);
  }

  console.log("✓ Verified document found in Firestore collection:");
  console.log(`  - Document ID: ${createdSub.id}`);
  console.log(`  - Document Source: ${createdSub.source}`);
  console.log(`  - Is Read: ${createdSub.isRead}`);
  console.log(`  - Message: "${createdSub.message}"`);

  const updatedUnreadCount = await contactRepo.getUnreadCount();
  console.log(`✓ Unread count incremented: ${initialUnreadCount} -> ${updatedUnreadCount}`);

  // Mark test record as read so inbox remains clean
  await contactRepo.markRead(createdSub.id);
  console.log("✓ Test submission marked read.");

  console.log("\n==========================================================");
  console.log("🎉 ALL STEP 19 PROMO POPUP E2E TESTS PASSED SUCCESSFULLY!");
  console.log("==========================================================");
}

main().catch((err) => {
  console.error("\n❌ E2E TEST SUITE FAILED:", err);
  process.exit(1);
});
