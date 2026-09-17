import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../src/infrastructure/firebase/firebaseClient";

async function verifyFirestoreConnection(): Promise<void> {
  console.log("==========================================================");
  console.log("Testing Firestore Native Mode Connection for sachin-shakya-site");
  console.log("==========================================================");

  const testRef = doc(db, "_system_health", "connectivity_probe");
  const timestamp = new Date().toISOString();

  console.log(`Writing probe document at ${timestamp}...`);
  await setDoc(testRef, {
    status: "healthy",
    environment: "native_firestore",
    probeTimestamp: timestamp,
    verifiedBy: "Step 07 Automation",
  });
  console.log("✓ Write operation successful.");

  console.log("Reading probe document back...");
  const snapshot = await getDoc(testRef);

  if (!snapshot.exists()) {
    throw new Error("Probe document not found after write!");
  }

  const data = snapshot.data();
  console.log("✓ Read operation successful. Document data:", JSON.stringify(data, null, 2));

  console.log("Cleaning up probe document...");
  await deleteDoc(testRef);
  console.log("✓ Cleanup operation successful.");

  console.log("==========================================================");
  console.log("Firestore Native mode is fully functional and verified!");
  console.log("==========================================================");
}

verifyFirestoreConnection()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("✗ Firestore verification failed:", err);
    process.exit(1);
  });
