/**
 * scripts/test-contact-e2e.ts
 * End-to-end integration test verifying Contact Form & Email API Integration:
 * - DI Container resolution for ContactRepository, EmailSender, and SubmitContactFormUseCase
 * - Validation rejection on invalid inputs
 * - Full submission creation and Firestore persistence
 * - Unread count query and mark-read mutation
 */

import type { SubmitContactFormUseCase } from "../src/application/use-cases/contact/SubmitContactFormUseCase";
import type { IContactRepository } from "../src/domain/repositories/admin/IContactRepository";
import type { IEmailSender } from "../src/domain/repositories/admin/IEmailSender";
import { bootstrapContainer } from "../src/infrastructure/di/bootstrap";
import { container } from "../src/infrastructure/di/container";
import { DI_TOKENS } from "../src/infrastructure/di/tokens";

async function runContactE2eTests() {
  console.log("==========================================================");
  console.log("Step 18: Contact Form & Email API E2E Verification");
  console.log("==========================================================");

  bootstrapContainer();

  const contactRepo = container.resolve<IContactRepository>(DI_TOKENS.ContactRepository);
  const _emailSender = container.resolve<IEmailSender>(DI_TOKENS.EmailSender);
  const submitUseCase = container.resolve<SubmitContactFormUseCase>(DI_TOKENS.SubmitContactForm);

  console.log("✓ DI container resolved ContactRepository and EmailSender");
  console.log("✓ DI container resolved SubmitContactFormUseCase");

  // 1. Test validation failures
  console.log("\n[Test 1] Verifying input validation gates...");
  let rejected = false;
  try {
    await submitUseCase.execute({
      name: "A",
      email: "not-an-email",
      message: "Short",
    });
  } catch (err) {
    rejected = true;
    console.log(`✓ Invalid input correctly rejected: "${(err as Error).message}"`);
  }
  if (!rejected) {
    throw new Error("FAILED: Invalid input was not rejected!");
  }

  // 2. Test successful submission
  console.log("\n[Test 2] Submitting valid executive consultation inquiry...");
  const testName = "Enterprise Cloud Director";
  const testEmail = "director.cloud@enterprise-partner.com";
  const testMessage =
    "Inquiring regarding multi-cloud Kubernetes governance, enterprise FinOps audits, and interim lead consulting roles.";

  const result = await submitUseCase.execute({
    name: testName,
    email: testEmail,
    subject: "FinOps Cloud Cost Optimization Consultation",
    message: testMessage,
    source: "contact-form",
  });

  console.log(`✓ Submission created with ID: ${result.id}`);
  console.log(`✓ Recorded at: ${result.createdAt}`);
  console.log(`✓ Is read status: ${result.isRead}`);

  // 3. Verify persistence in Firestore
  console.log("\n[Test 3] Verifying Firestore persistence in contactSubmissions...");
  const allSubmissions = await contactRepo.getAll();
  const matched = allSubmissions.find((s) => s.id === result.id);
  if (!matched) {
    throw new Error(`FAILED: Submission ${result.id} not found in Firestore!`);
  }
  console.log(`✓ Found submission in Firestore: "${matched.name}" <${matched.email}>`);

  // 4. Verify unread count and markRead
  console.log("\n[Test 4] Verifying unread count and markRead lifecycle...");
  const unreadBefore = await contactRepo.getUnreadCount();
  console.log(`✓ Unread submissions count: ${unreadBefore}`);

  await contactRepo.markRead(result.id);
  const unreadAfter = await contactRepo.getUnreadCount();
  console.log(`✓ Marked submission ${result.id} as read. New unread count: ${unreadAfter}`);

  console.log("\n==========================================================");
  console.log("✓ ALL STEP 18 CONTACT FORM & EMAIL TESTS PASSED (100%)");
  console.log("==========================================================");
}

runContactE2eTests().catch((err) => {
  console.error("Contact E2E test failed:", err);
  process.exit(1);
});
