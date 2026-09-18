// infrastructure/repositories/content/FirestoreMediaRepository.ts
// Concrete Firestore implementation of IMediaRepository.
// Tracks Cloudinary assets, dimensions, format, and document usage references.

import {
  arrayRemove,
  arrayUnion,
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
  CreateMediaAssetInput,
  MediaAsset,
} from "../../../domain/entities/content/MediaAsset";
import type { IMediaRepository } from "../../../domain/repositories/content/IMediaRepository";
import { getDb } from "../../firebase/firebaseClient";

const COLLECTION_NAME = "mediaAssets";

interface FirestoreMediaDoc {
  id?: string;
  url: string;
  publicId: string;
  folder: string;
  altText: string;
  usageRefs?: string[];
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
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

function mapDocToMediaAsset(id: string, data: FirestoreMediaDoc): MediaAsset {
  return {
    id,
    url: data.url,
    publicId: data.publicId,
    folder: data.folder,
    altText: data.altText ?? "",
    usageRefs: Array.isArray(data.usageRefs) ? data.usageRefs : [],
    width: data.width,
    height: data.height,
    format: data.format,
    bytes: data.bytes,
    createdAt: parseDate(data.createdAt),
  };
}

export class FirestoreMediaRepository implements IMediaRepository {
  async getAll(): Promise<MediaAsset[]> {
    const db = getDb();
    const colRef = collection(db, COLLECTION_NAME);
    const snap = await getDocs(colRef);

    const assets = snap.docs.map((d) => mapDocToMediaAsset(d.id, d.data() as FirestoreMediaDoc));
    return assets.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getById(id: string): Promise<MediaAsset | null> {
    const db = getDb();
    const docRef = doc(db, COLLECTION_NAME, id);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      return null;
    }
    return mapDocToMediaAsset(snap.id, snap.data() as FirestoreMediaDoc);
  }

  async getByPublicId(publicId: string): Promise<MediaAsset | null> {
    const db = getDb();
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, where("publicId", "==", publicId));
    const snap = await getDocs(q);

    if (snap.empty || !snap.docs[0]) {
      return null;
    }
    const match = snap.docs[0];
    return mapDocToMediaAsset(match.id, match.data() as FirestoreMediaDoc);
  }

  async save(input: CreateMediaAssetInput): Promise<MediaAsset> {
    const db = getDb();
    const colRef = collection(db, COLLECTION_NAME);
    const docId = (input as { id?: string }).id || input.publicId.replace(/[^a-zA-Z0-9_-]/g, "_");
    const docRef = doc(colRef, docId);
    const now = new Date();

    const rawPayload: Record<string, unknown> = {
      url: input.url,
      publicId: input.publicId,
      folder: input.folder,
      altText: input.altText,
      usageRefs: input.usageRefs || [],
      createdAt: now.toISOString(),
    };

    if (input.width !== undefined) rawPayload.width = input.width;
    if (input.height !== undefined) rawPayload.height = input.height;
    if (input.format !== undefined) rawPayload.format = input.format;
    if (input.bytes !== undefined) rawPayload.bytes = input.bytes;

    await setDoc(docRef, rawPayload, { merge: true });

    return {
      id: docId,
      url: input.url,
      publicId: input.publicId,
      folder: input.folder,
      altText: input.altText,
      usageRefs: input.usageRefs || [],
      width: input.width,
      height: input.height,
      format: input.format,
      bytes: input.bytes,
      createdAt: now,
    };
  }

  async delete(id: string): Promise<void> {
    const db = getDb();
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  }

  async addUsageRef(id: string, ref: string): Promise<void> {
    const db = getDb();
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      usageRefs: arrayUnion(ref),
    });
  }

  async removeUsageRef(id: string, ref: string): Promise<void> {
    const db = getDb();
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      usageRefs: arrayRemove(ref),
    });
  }
}
