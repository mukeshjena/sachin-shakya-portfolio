// domain/entities/profile/Certification.ts
// Pure domain entities modeling professional cloud certifications and academic credentials.

export interface Certification {
  /** Deterministic Firestore document ID (e.g. "cert-az-104", "cert-clf-c01") */
  readonly id: string;
  readonly name: string;
  readonly issuer: string;
  readonly code: string;
  readonly credentialId?: string;
  readonly issueDate: string;
  readonly expiryDate?: string;
  readonly verificationUrl?: string;
  readonly badgeUrl?: string;
  readonly order: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface EducationRecord {
  /** Deterministic Firestore document ID (e.g. "edu-mca", "edu-bsc") */
  readonly id: string;
  readonly degree: string;
  readonly fieldOfStudy: string;
  readonly institution: string;
  readonly location: string;
  readonly startYear: string;
  readonly endYear: string;
  readonly gradeOrScore?: string;
  readonly order: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type CreateCertificationInput = Omit<Certification, "id" | "createdAt" | "updatedAt">;
export type UpdateCertificationInput = Partial<
  Omit<Certification, "id" | "createdAt" | "updatedAt">
>;

export type CreateEducationRecordInput = Omit<EducationRecord, "id" | "createdAt" | "updatedAt">;
export type UpdateEducationRecordInput = Partial<
  Omit<EducationRecord, "id" | "createdAt" | "updatedAt">
>;
