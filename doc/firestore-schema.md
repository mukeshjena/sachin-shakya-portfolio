# Firestore Database Schema Specification — Sachin Shakya Portfolio

This document specifies the complete Cloud Firestore Native mode database architecture for the Sachin Shakya Cloud/DevOps Executive Portfolio site.

---

## 1. Database Architecture & Optimization

- **Mode:** Cloud Firestore Native Mode (`(default)` database).
- **Location:** `asia-south1` (Mumbai) — closest to primary Indian and APAC recruiter audience.
- **Client Cache Strategy:** `persistentLocalCache({ tabManager: persistentMultipleTabManager() })` configured via `src/infrastructure/firebase/firebaseClient.ts`. Conserves free-tier reads (50,000/day limit) by utilizing IndexedDB across multiple open tabs.
- **Idempotency Model:** All seed datasets utilize **deterministic document IDs** (e.g., `exp-eptura`, `kpi-monthly-savings`, `global`) rather than randomized auto-IDs. Reseeding with `setDoc(ref, data, { merge: true })` never creates duplicate records.

---

## 2. Collection & Entity Mapping Matrix

| Firestore Collection | TypeScript Domain Entity | Layer Path | Deterministic ID Pattern |
|---|---|---|---|
| `pages` | `Page` | `src/domain/entities/content/Page.ts` | Slug string (`home`, `about`, `case-studies`) |
| `sections` | `Section` | `src/domain/entities/content/Section.ts` | `${pageId}-${type}-${order}` (e.g. `home-hero-0`) |
| `mediaAssets` | `MediaAsset` | `src/domain/entities/content/MediaAsset.ts` | Normalized Cloudinary public_id hash |
| `telemetryMetrics` | `TelemetryMetric` | `src/domain/entities/telemetry/TelemetryMetric.ts` | `kpi-${category}-${shortname}` (e.g. `kpi-finops-savings`) |
| `telemetryCostSeries` | `CostComparisonSeries` | `src/domain/entities/telemetry/CostComparisonSeries.ts` | `finops-trajectory-12m` |
| `telemetryBenchmarks` | `MTTRBenchmark` | `src/domain/entities/telemetry/MTTRBenchmark.ts` | `benchmark-mttr-fleet` |
| `experience` | `Experience` | `src/domain/entities/profile/Experience.ts` | `exp-${companySlug}` (e.g. `exp-eptura`, `exp-ltimindtree`) |
| `competencies` | `Competency` | `src/domain/entities/profile/Competency.ts` | `comp-${categorySlug}` (e.g. `comp-cloud-platforms`) |
| `certifications` | `Certification` | `src/domain/entities/profile/Certification.ts` | `cert-${codeSlug}` (e.g. `cert-az-104`, `cert-itil-v4`) |
| `education` | `EducationRecord` | `src/domain/entities/profile/Certification.ts` | `edu-${degreeSlug}` (e.g. `edu-mca`, `edu-bsc`) |
| `siteSettings` | `SiteSettings` | `src/domain/entities/admin/SiteSettings.ts` | `global` (singleton document) |
| `contactSubmissions` | `ContactSubmission` | `src/domain/entities/admin/ContactSubmission.ts` | `sub-${timestamp}-${randomSuffix}` |
| `promoPopup` | `PromoPopup` | `src/domain/entities/admin/PromoPopup.ts` | `global` (singleton document) |

---

## 3. Detailed Collection Schemas

### 3.1. `pages`
Represents individual routable pages rendered by the dynamic page engine.
```typescript
interface PageDocument {
  id: string;                    // Document ID (slug string, e.g. "home")
  slug: string;                  // URL slug, unique
  title: string;                 // Display title
  sectionOrder: string[];        // Array of Section document IDs in display sequence
  isPublished: boolean;          // Public visibility flag
  showInHeader: boolean;         // Display in navigation header
  showInFooter: boolean;         // Display in site footer
  seoTitle?: string;             // Optional custom SEO title
  seoDescription?: string;       // Optional meta description
  seoImage?: string;             // OpenGraph image URL
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 3.2. `sections`
Composable content blocks attached to a page.
```typescript
interface SectionDocument {
  id: string;                    // Document ID, e.g. "home-hero-0"
  pageId: string;                // Parent Page ID
  type: SectionType;             // "hero" | "impact" | "telemetry" | "experience" | ...
  title: string;                 // Admin section label
  content: Record<string, unknown>; // Type-erased schema bag for section content
  order: number;                 // Numeric presentation sort order
  isVisible: boolean;            // Display toggle
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 3.3. `telemetryMetrics`
High-level KPIs powering executive telemetry badges and cards.
```typescript
interface TelemetryMetricDocument {
  id: string;                    // e.g. "kpi-monthly-savings"
  category: "finops" | "reliability" | "automation" | "scale" | "availability";
  title: string;                 // "Cloud Cost Optimization"
  subtitle?: string;             // "Monthly recurring infrastructure reduction"
  headlineValue: string;         // "$170K/mo"
  unit?: string;                 // "USD / month"
  baselineValue?: number;        // 450000
  targetValue?: number;          // 280000
  changePercentage?: number;     // -37.8
  direction?: "up" | "down" | "neutral";
  timeframe?: string;            // "2023–Present"
  order: number;
  isFeatured: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 3.4. `telemetryCostSeries`
Chronological FinOps spend reduction trajectory ($170K/mo savings).
```typescript
interface CostComparisonSeriesDocument {
  id: string;                    // "finops-cost-trajectory"
  title: string;
  description: string;
  currency: string;              // "USD"
  annualRunRateSavings: number;  // 2040000
  targetSavingsPercent: number;  // 37.8
  points: Array<{
    month: string;               // "Jan 23"
    baselineSpend: number;       // 450000
    optimizedSpend: number;      // 380000
    savingsDelta: number;        // 70000
    cumulativeSavings: number;   // 70000
    milestone?: string;          // "Workload Rightsizing Phase 1"
  }>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 3.5. `experience`
Corporate enterprise career trajectory.
```typescript
interface ExperienceDocument {
  id: string;                    // "exp-eptura"
  company: string;               // "Eptura"
  role: string;                  // "Lead Cloud Operations & DevOps Architect"
  client?: string;               // Optional client enterprise
  location: string;              // "Melbourne / Remote"
  period: string;                // "03/2024 – Present"
  startDate: string;             // "2024-03-01"
  endDate?: string;              // "Present"
  isCurrent: boolean;
  summary: string;
  achievements: string[];
  technologies: string[];
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 3.6. `siteSettings`
Global profile and navigation constants (singleton document `global`).
```typescript
interface SiteSettingsDocument {
  id: "global";
  fullName: string;              // "Sachin Shakya"
  headline: string;              // "Lead Cloud Architect & DevOps Consultant"
  shortBio: string;
  email: string;                 // "sachin.shakya@live.com"
  phone: string;                 // "+91 99112 00473"
  location: string;              // "Faridabad, Haryana, India"
  logoUrl: string;
  avatarUrl?: string;
  resumePdfUrl?: string;
  socialLinks: Array<{
    platform: "linkedin" | "github" | "email" | "twitter" | "custom";
    label: string;
    url: string;
    isVisible: boolean;
    order: number;
  }>;
  availabilityStatus: "available" | "consulting_only" | "unavailable";
  availabilityNote?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

## 4. Query Indexing Strategy

Declared in `firestore.indexes.json`:

1. **Pages by Visibility & Order:**
   - Collection: `pages`
   - Fields: `isPublished ASC, order ASC`
   - Use-case: Header and footer dynamic navigation building.
2. **Sections by Page & Order:**
   - Collection: `sections`
   - Fields: `pageId ASC, order ASC`
   - Use-case: Page assembly rendering in order.
3. **Telemetry Metrics by Category & Order:**
   - Collection: `telemetryMetrics`
   - Fields: `category ASC, order ASC`
   - Use-case: Segmented display in command center tabs.
4. **Competencies by Category & Order:**
   - Collection: `competencies`
   - Fields: `category ASC, order ASC`
   - Use-case: Categorized skill matrices.
5. **Contact Inquiries by Archive & Date:**
   - Collection: `contactSubmissions`
   - Fields: `isArchived ASC, createdAt DESC`
   - Use-case: Admin inbox chronological triaging.
