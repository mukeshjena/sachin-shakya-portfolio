// infrastructure/repositories/admin/FirestoreAdminAccessRepository.ts
// Concrete Firestore implementation of IAdminAccessRepository.
// Manages authorized admin email whitelist and hashed OTP access codes.

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import type {
  IAdminAccessRepository,
  StoredAccessCode,
} from "../../../domain/repositories/admin/IAdminAccessRepository";
import { getDb } from "../../firebase/firebaseClient";

const ADMIN_EMAILS_COLLECTION = "adminEmails";
const ACCESS_CODES_COLLECTION = "accessCodes";
const ROOT_ADMIN_EMAIL = "sachin.shakya@live.com";

interface FirestoreAccessCodeDoc {
  id?: string;
  emailHash: string;
  codeHash: string;
  expiresAt: string | { toDate: () => Date };
  used: boolean;
  createdAt: string | { toDate: () => Date };
}

function parseDate(val: unknown): Date {
  if (!val) return new Date();
  if (typeof val === "object" && val !== null && "toDate" in val) {
    return (val as { toDate: () => Date }).toDate();
  }
  if (typeof val === "string") {
    const parsed = new Date(val);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date();
}

function mapDocToAccessCode(id: string, data: FirestoreAccessCodeDoc): StoredAccessCode {
  return {
    id,
    emailHash: data.emailHash,
    codeHash: data.codeHash,
    expiresAt: parseDate(data.expiresAt),
    used: Boolean(data.used),
    createdAt: parseDate(data.createdAt),
  };
}

export class FirestoreAdminAccessRepository implements IAdminAccessRepository {
  // ── Authorized email management ─────────────────────────────────────────────

  async getAuthorizedEmails(): Promise<string[]> {
    const db = getDb();
    const colRef = collection(db, ADMIN_EMAILS_COLLECTION);
    const snapshot = await getDocs(colRef);

    const emails = new Set<string>();
    emails.add(ROOT_ADMIN_EMAIL);

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      if (data.email && typeof data.email === "string") {
        emails.add(data.email.trim().toLowerCase());
      }
    }

    return Array.from(emails);
  }

  async addAuthorizedEmail(email: string): Promise<void> {
    const normalized = email.trim().toLowerCase();
    const db = getDb();
    const docRef = doc(db, ADMIN_EMAILS_COLLECTION, normalized);
    await setDoc(docRef, {
      email: normalized,
      addedAt: new Date().toISOString(),
    });
  }

  async removeAuthorizedEmail(email: string): Promise<void> {
    const normalized = email.trim().toLowerCase();
    if (normalized === ROOT_ADMIN_EMAIL) {
      throw new Error("Root administrator email cannot be removed.");
    }
    const db = getDb();
    const docRef = doc(db, ADMIN_EMAILS_COLLECTION, normalized);
    await deleteDoc(docRef);
  }

  async isAuthorizedEmail(email: string): Promise<boolean> {
    const normalized = email.trim().toLowerCase();
    if (normalized === ROOT_ADMIN_EMAIL) {
      return true;
    }
    const db = getDb();
    const docRef = doc(db, ADMIN_EMAILS_COLLECTION, normalized);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  }

  // ── OTP code lifecycle ───────────────────────────────────────────────────────

  async saveAccessCode(emailHash: string, codeHash: string, expiresAt: Date): Promise<string> {
    const db = getDb();
    const colRef = collection(db, ACCESS_CODES_COLLECTION);
    const docRef = doc(colRef);
    const now = new Date();

    const docData: FirestoreAccessCodeDoc = {
      emailHash,
      codeHash,
      expiresAt: expiresAt.toISOString(),
      used: false,
      createdAt: now.toISOString(),
    };

    await setDoc(docRef, docData);
    return docRef.id;
  }

  async findActiveCode(emailHash: string): Promise<StoredAccessCode | null> {
    const db = getDb();
    const colRef = collection(db, ACCESS_CODES_COLLECTION);
    const q = query(colRef, where("emailHash", "==", emailHash), where("used", "==", false));
    const snapshot = await getDocs(q);

    const now = Date.now();
    const activeCodes: StoredAccessCode[] = [];

    for (const docSnap of snapshot.docs) {
      const code = mapDocToAccessCode(docSnap.id, docSnap.data() as FirestoreAccessCodeDoc);
      if (code.expiresAt.getTime() > now) {
        activeCodes.push(code);
      }
    }

    if (activeCodes.length === 0) {
      return null;
    }

    // Return the newest active code
    return activeCodes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
  }

  async markCodeUsed(id: string): Promise<void> {
    const db = getDb();
    const docRef = doc(db, ACCESS_CODES_COLLECTION, id);
    await updateDoc(docRef, { used: true });
  }

  async getLastRequestTime(emailHash: string): Promise<Date | null> {
    const db = getDb();
    const colRef = collection(db, ACCESS_CODES_COLLECTION);
    const q = query(colRef, where("emailHash", "==", emailHash));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const times = snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as FirestoreAccessCodeDoc;
      return parseDate(data.createdAt);
    });

    times.sort((a, b) => b.getTime() - a.getTime());
    return times[0] || null;
  }
}
