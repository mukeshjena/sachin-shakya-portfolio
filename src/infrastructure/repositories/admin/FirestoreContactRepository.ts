// infrastructure/repositories/admin/FirestoreContactRepository.ts
// Concrete Firestore implementation of IContactRepository.
// Handles contact submission persistence and admin inbox queries.

import { collection, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import type {
  ContactSubmission,
  CreateContactInput,
  IContactRepository,
  SubmissionSource,
} from "../../../domain/repositories/admin/IContactRepository";
import { getDb } from "../../firebase/firebaseClient";

const COLLECTION_NAME = "contactSubmissions";

interface FirestoreContactDoc {
  id?: string;
  name: string;
  email: string;
  message: string;
  source?: SubmissionSource;
  isRead: boolean;
  createdAt?: string | { toDate: () => Date };
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

function mapDocToSubmission(id: string, data: FirestoreContactDoc): ContactSubmission {
  return {
    id,
    name: data.name ?? "Anonymous",
    email: data.email ?? "",
    message: data.message ?? "",
    source: data.source ?? "contact-form",
    isRead: Boolean(data.isRead),
    createdAt: parseDate(data.createdAt),
  };
}

export class FirestoreContactRepository implements IContactRepository {
  /**
   * Retrieves all submissions, sorted newest first.
   */
  async getAll(): Promise<ContactSubmission[]> {
    const db = getDb();
    const colRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(colRef);

    const submissions: ContactSubmission[] = [];
    for (const docSnap of snapshot.docs) {
      submissions.push(mapDocToSubmission(docSnap.id, docSnap.data() as FirestoreContactDoc));
    }

    return submissions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Returns the count of unread submissions for the admin dashboard beacon.
   */
  async getUnreadCount(): Promise<number> {
    const db = getDb();
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, where("isRead", "==", false));
    const snapshot = await getDocs(q);
    return snapshot.size;
  }

  /**
   * Creates a new submission document in Firestore.
   */
  async create(input: CreateContactInput): Promise<ContactSubmission> {
    const db = getDb();
    const colRef = collection(db, COLLECTION_NAME);
    const docRef = doc(colRef);
    const now = new Date();

    const docData: FirestoreContactDoc = {
      name: input.name,
      email: input.email,
      message: input.message,
      source: input.source,
      isRead: false,
      createdAt: now.toISOString(),
    };

    await setDoc(docRef, docData);

    return mapDocToSubmission(docRef.id, docData);
  }

  /**
   * Marks a contact submission as read in the admin inbox.
   */
  async markRead(id: string): Promise<void> {
    const db = getDb();
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { isRead: true });
  }
}
