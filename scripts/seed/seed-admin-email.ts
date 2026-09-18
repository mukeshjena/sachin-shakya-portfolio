// scripts/seed/seed-admin-email.ts
// Seeds muk3shjena@gmail.com into Firestore adminEmails whitelist.

import { doc, setDoc } from "firebase/firestore";
import { getDb } from "../../src/infrastructure/firebase/firebaseClient";

async function main() {
  const db = getDb();
  const timestamp = new Date().toISOString();

  await setDoc(
    doc(db, "adminEmails", "muk3shjena@gmail.com"),
    {
      email: "muk3shjena@gmail.com",
      role: "root",
      isEnabled: true,
      addedAt: timestamp,
    },
    { merge: true }
  );

  await setDoc(
    doc(db, "adminEmails", "sachin.shakya@live.com"),
    {
      email: "sachin.shakya@live.com",
      role: "root",
      isEnabled: true,
      addedAt: timestamp,
    },
    { merge: true }
  );

  console.log(
    "✓ Successfully seeded muk3shjena@gmail.com and sachin.shakya@live.com to Firestore adminEmails!"
  );
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed to seed admin email:", err);
  process.exit(1);
});
