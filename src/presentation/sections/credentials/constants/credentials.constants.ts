// presentation/sections/credentials/constants/credentials.constants.ts
// Certifications, academic degrees, and enterprise recognition awards.
// Universal Separation of Concerns (Rule 13) — Zero inline hardcoded copy.

export interface CertificationItem {
  readonly code: string;
  readonly title: string;
  readonly issuer: string;
  readonly year: string;
  readonly badgeColor: string;
}

export interface EducationItem {
  readonly degree: string;
  readonly field: string;
  readonly institution: string;
  readonly period: string;
}

export interface AwardItem {
  readonly title: string;
  readonly organization: string;
  readonly year: string;
  readonly description: string;
}

export const CREDENTIALS_COPY = {
  eyebrow: "ACADEMIC & PROFESSIONAL CREDENTIALS",
  headline: "Certified, Schooled & Recognized",
  subheadline:
    "Formal certifications across Azure, AWS, and ITIL frameworks, backed by computer science engineering fundamentals and enterprise delivery awards.",
  certificationsHeading: "INDUSTRY CERTIFICATIONS",
  educationHeading: "ACADEMIC BACKGROUND",
  awardsHeading: "ENTERPRISE RECOGNITION",
} as const;

export const CERTIFICATIONS: readonly CertificationItem[] = [
  {
    code: "AZ-104",
    title: "Microsoft Certified: Azure Administrator Associate",
    issuer: "Microsoft",
    year: "2023",
    badgeColor: "#0078d4",
  },
  {
    code: "CLF-C01",
    title: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    year: "2022",
    badgeColor: "var(--amber)",
  },
  {
    code: "ITIL 4",
    title: "ITIL® 4 Foundation in IT Service Management",
    issuer: "AXELOS",
    year: "2021",
    badgeColor: "var(--live)",
  },
  {
    code: "SC-900",
    title: "Microsoft Certified: Security, Compliance, and Identity",
    issuer: "Microsoft",
    year: "2022",
    badgeColor: "#0078d4",
  },
  {
    code: "DP-900",
    title: "Microsoft Certified: Azure Data Fundamentals",
    issuer: "Microsoft",
    year: "2022",
    badgeColor: "#0078d4",
  },
  {
    code: "AZ-900",
    title: "Microsoft Certified: Azure Fundamentals",
    issuer: "Microsoft",
    year: "2020",
    badgeColor: "#0078d4",
  },
] as const;

export const EDUCATION_RECORDS: readonly EducationItem[] = [
  {
    degree: "MCA — Master of Computer Applications",
    field: "Computer Applications (74.10%)",
    institution: "D.A.V. Institute of Management, Faridabad",
    period: "2020",
  },
  {
    degree: "B.Sc. Electronics",
    field: "Electronics & Communications (68.98%)",
    institution: "Delhi University, New Delhi",
    period: "2017",
  },
  {
    degree: "Higher Secondary (Class XII)",
    field: "Science Stream (86.00%)",
    institution: "Haryana Board of School Education, Rohtak",
    period: "2013",
  },
] as const;

export const HONORS_AWARDS: readonly AwardItem[] = [
  {
    title: "SpotON-HatsOff Award",
    organization: "LTIMindtree",
    year: "2023",
    description:
      "Awarded for cross-functional automation delivery and cloud cost savings for global healthcare clients.",
  },
  {
    title: "Leadership-Gracias Award",
    organization: "LTIMindtree",
    year: "2022",
    description:
      "Recognized for outstanding engineering team excellence, mentorship, and cloud delivery standards.",
  },
  {
    title: "TCS Kaizen Award",
    organization: "Tata Consultancy Services",
    year: "2021",
    description:
      "Awarded for conceptualizing and implementing seven high-impact cloud process improvement ideas.",
  },
  {
    title: "Star Performer of the Month",
    organization: "TCS BFSI Vertical",
    year: "2018",
    description:
      "Recognized for critical process automation achieving 18% headcount and 20% throughput gains for ABN AMRO.",
  },
] as const;

export const CREDENTIALS_ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  },
} as const;
