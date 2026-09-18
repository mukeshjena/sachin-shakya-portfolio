// infrastructure/repositories/content/FirestoreSectionRepository.ts
// Concrete Firestore implementation of ISectionRepository.
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
  writeBatch,
} from "firebase/firestore";
import type {
  CreateSectionInput,
  Section,
  SectionType,
  UpdateSectionInput,
} from "../../../domain/entities/content/Section";
import type { ISectionRepository } from "../../../domain/repositories/content/ISectionRepository";
import { getDb } from "../../firebase/firebaseClient";

const COLLECTION_NAME = "sections";

interface FirestoreSectionDoc {
  id?: string;
  pageId: string;
  type: SectionType;
  title: string;
  content?: Record<string, unknown>;
  order: number;
  isVisible: boolean;
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

function mapDocToSection(id: string, data: FirestoreSectionDoc): Section {
  return {
    id,
    pageId: data.pageId ?? "",
    type: data.type ?? "custom",
    title: data.title ?? "Untitled Section",
    content: data.content && typeof data.content === "object" ? data.content : {},
    order: typeof data.order === "number" ? data.order : 0,
    isVisible: Boolean(data.isVisible),
    createdAt: parseDate(data.createdAt),
    updatedAt: parseDate(data.updatedAt),
  };
}

export class FirestoreSectionRepository implements ISectionRepository {
  /**
   * Retrieves all sections for a page, sorted by order ascending.
   */
  async getByPage(pageId: string): Promise<Section[]> {
    const db = getDb();
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, where("pageId", "==", pageId));
    const snapshot = await getDocs(q);

    const sections: Section[] = [];
    for (const docSnap of snapshot.docs) {
      sections.push(mapDocToSection(docSnap.id, docSnap.data() as FirestoreSectionDoc));
    }

    return sections.sort((a, b) => a.order - b.order);
  }

  /**
   * Retrieves visible sections for a page (public site view), sorted by order.
   */
  async getVisibleByPage(pageId: string): Promise<Section[]> {
    const sections = await this.getByPage(pageId);
    return sections.filter((s) => s.isVisible);
  }

  /**
   * Fetches a single section by its ID.
   */
  async getById(id: string): Promise<Section | null> {
    const db = getDb();
    const docRef = doc(db, COLLECTION_NAME, id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return null;
    }

    return mapDocToSection(snapshot.id, snapshot.data() as FirestoreSectionDoc);
  }

  /**
   * Creates a new section document with server-generated or specified ID.
   */
  async create(input: CreateSectionInput): Promise<Section> {
    const db = getDb();
    const colRef = collection(db, COLLECTION_NAME);
    const docRef = doc(colRef);
    const now = new Date();

    const docData: FirestoreSectionDoc = {
      pageId: input.pageId,
      type: input.type,
      title: input.title,
      content: input.content,
      order: input.order,
      isVisible: input.isVisible,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    await setDoc(docRef, docData);

    return mapDocToSection(docRef.id, docData);
  }

  /**
   * Applies partial updates to an existing section.
   */
  async update(id: string, updates: UpdateSectionInput): Promise<Section> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error(`Cannot update section: document with ID '${id}' not found.`);
    }

    const db = getDb();
    const docRef = doc(db, COLLECTION_NAME, id);
    const now = new Date();

    const updatePayload: Record<string, unknown> = {
      updatedAt: now.toISOString(),
    };

    if (updates.title !== undefined) updatePayload.title = updates.title;
    if (updates.content !== undefined) updatePayload.content = updates.content;
    if (updates.order !== undefined) updatePayload.order = updates.order;
    if (updates.isVisible !== undefined) updatePayload.isVisible = updates.isVisible;

    await updateDoc(docRef, updatePayload);

    return {
      ...existing,
      ...updates,
      updatedAt: now,
    };
  }

  /**
   * Hard-deletes a section document.
   */
  async delete(id: string): Promise<void> {
    const db = getDb();
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  }

  /**
   * Atomically reorders sections for a page using a Firestore writeBatch.
   */
  async reorder(_pageId: string, orderedIds: string[]): Promise<void> {
    const db = getDb();
    const batch = writeBatch(db);
    const now = new Date().toISOString();

    for (let index = 0; index < orderedIds.length; index++) {
      const sectionId = orderedIds[index];
      const docRef = doc(db, COLLECTION_NAME, sectionId);
      batch.update(docRef, {
        order: index,
        updatedAt: now,
      });
    }

    await batch.commit();
  }
}
