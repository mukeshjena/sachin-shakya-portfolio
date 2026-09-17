// infrastructure/repositories/content/FirestorePageRepository.ts
// Concrete Firestore implementation of IPageRepository.
// Handles multi-tab IndexedDB cache reading, serialization, and domain object mapping.

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
import type { CreatePageInput, Page, UpdatePageInput } from "../../../domain/entities/content/Page";
import type { IPageRepository } from "../../../domain/repositories/content/IPageRepository";
import { Slug } from "../../../domain/value-objects/Slug";
import { getDb } from "../../firebase/firebaseClient";

const COLLECTION_NAME = "pages";

interface FirestorePageDoc {
  id?: string;
  slug: string;
  title: string;
  sectionOrder?: string[];
  isPublished: boolean;
  showInHeader: boolean;
  showInFooter: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
  createdAt?: string | { toDate: () => Date };
  updatedAt?: string | { toDate: () => Date };
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

function mapDocToPage(id: string, data: FirestorePageDoc): Page {
  return {
    id,
    slug: new Slug(data.slug || id),
    title: data.title ?? "Untitled Page",
    sectionOrder: Array.isArray(data.sectionOrder) ? data.sectionOrder : [],
    isPublished: Boolean(data.isPublished),
    showInHeader: Boolean(data.showInHeader),
    showInFooter: Boolean(data.showInFooter),
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    seoImage: data.seoImage,
    createdAt: parseDate(data.createdAt),
    updatedAt: parseDate(data.updatedAt),
  };
}

export class FirestorePageRepository implements IPageRepository {
  async getAll(): Promise<Page[]> {
    const db = getDb();
    const colRef = collection(db, COLLECTION_NAME);
    const snap = await getDocs(colRef);
    return snap.docs.map((d) => mapDocToPage(d.id, d.data() as FirestorePageDoc));
  }

  async getPublished(): Promise<Page[]> {
    const db = getDb();
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, where("isPublished", "==", true));
    const snap = await getDocs(q);
    return snap.docs.map((d) => mapDocToPage(d.id, d.data() as FirestorePageDoc));
  }

  async getHeaderNavPages(): Promise<Page[]> {
    const db = getDb();
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, where("isPublished", "==", true), where("showInHeader", "==", true));
    const snap = await getDocs(q);
    return snap.docs.map((d) => mapDocToPage(d.id, d.data() as FirestorePageDoc));
  }

  async getFooterNavPages(): Promise<Page[]> {
    const db = getDb();
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, where("isPublished", "==", true), where("showInFooter", "==", true));
    const snap = await getDocs(q);
    return snap.docs.map((d) => mapDocToPage(d.id, d.data() as FirestorePageDoc));
  }

  async getBySlug(slug: Slug): Promise<Page | null> {
    const db = getDb();
    const rawSlug = slug.toString();

    // First attempt direct ID lookup since standard pages use slug as document ID
    const directRef = doc(db, COLLECTION_NAME, rawSlug);
    const directSnap = await getDoc(directRef);
    if (directSnap.exists()) {
      return mapDocToPage(directSnap.id, directSnap.data() as FirestorePageDoc);
    }

    // Fallback: Query by slug field for pages with custom or random IDs
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, where("slug", "==", rawSlug));
    const querySnap = await getDocs(q);

    if (querySnap.empty) {
      return null;
    }

    const firstMatch = querySnap.docs[0];
    return mapDocToPage(firstMatch.id, firstMatch.data() as FirestorePageDoc);
  }

  async create(input: CreatePageInput): Promise<Page> {
    const db = getDb();
    const slugObj = new Slug(input.slug);
    const docId = slugObj.toString();
    const now = new Date();
    const isoString = now.toISOString();

    const payload: FirestorePageDoc = {
      slug: slugObj.toString(),
      title: input.title,
      sectionOrder: input.sectionOrder ?? [],
      isPublished: input.isPublished,
      showInHeader: input.showInHeader,
      showInFooter: input.showInFooter,
      seoTitle: input.seoTitle,
      seoDescription: input.seoDescription,
      seoImage: input.seoImage,
      createdAt: isoString,
      updatedAt: isoString,
    };

    const docRef = doc(db, COLLECTION_NAME, docId);
    await setDoc(docRef, payload, { merge: true });

    return {
      id: docId,
      slug: slugObj,
      title: input.title,
      sectionOrder: input.sectionOrder ?? [],
      isPublished: input.isPublished,
      showInHeader: input.showInHeader,
      showInFooter: input.showInFooter,
      seoTitle: input.seoTitle,
      seoDescription: input.seoDescription,
      seoImage: input.seoImage,
      createdAt: now,
      updatedAt: now,
    };
  }

  async update(id: string, updates: UpdatePageInput): Promise<Page> {
    const db = getDb();
    const docRef = doc(db, COLLECTION_NAME, id);
    const existingSnap = await getDoc(docRef);

    if (!existingSnap.exists()) {
      throw new Error(`[FirestorePageRepository] Cannot update non-existent page: ${id}`);
    }

    const now = new Date();
    const updatePayload: Partial<FirestorePageDoc> = {
      ...updates,
      updatedAt: now.toISOString(),
    };

    await updateDoc(docRef, updatePayload);

    const mergedData = {
      ...existingSnap.data(),
      ...updatePayload,
    } as FirestorePageDoc;

    return mapDocToPage(id, mergedData);
  }

  async delete(id: string): Promise<void> {
    const db = getDb();
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  }
}
