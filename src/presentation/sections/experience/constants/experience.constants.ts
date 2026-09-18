// presentation/sections/experience/constants/experience.constants.ts
// Enterprise career milestones, roles, verified metrics, and stack tags.
// Universal Separation of Concerns (Rule 13) — Zero inline hardcoded copy.

export interface ExperienceRole {
  readonly id: string;
  readonly company: string;
  readonly roleTitle: string;
  readonly period: string;
  readonly location: string;
  readonly headlineMetric?: string;
  readonly bullets: readonly string[];
  readonly techStack: readonly string[];
}

export const EXPERIENCE_COPY = {
  eyebrow: "CAREER TRAJECTORY // 8+ YEARS IN PRODUCTION",
  headline: "Four Roles, One Direction of Travel",
  subheadline:
    "From Tier-1 core banking infrastructure to leading global SaaS cloud operations, automated FinOps cost reduction, and Kubernetes platform engineering.",
} as const;

export const EXPERIENCE_ROLES: readonly ExperienceRole[] = [
  {
    id: "eptura",
    company: "Eptura",
    roleTitle: "Lead Cloud Operations & FinOps Consultant",
    period: "2022 — PRESENT",
    location: "Global Delivery // Remote",
    headlineMetric: "$170K/mo Cloud Cost Savings",
    bullets: [
      "Directed multi-cloud governance and FinOps strategy across enterprise Azure and AWS estates, unlocking $170,000/month recurring cost reduction via reserved capacity, storage tiering, and workload rightsizing.",
      "Architected high-throughput Kubernetes clusters (AKS/EKS) with zero-downtime blue/green deployment pipelines, maintaining 99.99% service availability.",
      "Spearheaded APM instrumentation using Datadog and Dynatrace, cutting Mean Time to Resolution (MTTR) by 40% across P1-P3 operational incidents.",
    ],
    techStack: [
      "Azure AKS",
      "AWS EKS",
      "Terraform",
      "FinOps",
      "Datadog",
      "GitHub Actions",
      "Dynatrace",
    ],
  },
  {
    id: "ltimindtree",
    company: "LTIMindtree",
    roleTitle: "Senior Cloud & DevOps Engineer",
    period: "2021 — 2022",
    location: "Bangalore / Pune, India",
    headlineMetric: "90-Min Environment Spin-Up",
    bullets: [
      "Automated end-to-end cloud landing zone provisioning and security hardening using modular Terraform IaC, reducing environment spin-up time from 12 hours to under 90 minutes.",
      "Designed resilient CI/CD release workflows with integrated security scanning and automated rollback triggers for mission-critical client workloads.",
      "Engineered multi-region failover and disaster recovery strategies achieving RPO < 15 minutes and RTO < 30 minutes.",
    ],
    techStack: [
      "Terraform IaC",
      "Azure DevOps",
      "Docker",
      "Kubernetes",
      "Ansible",
      "Linux",
      "Bash",
    ],
  },
  {
    id: "tcs-downer",
    company: "Tata Consultancy Services // Downer Group",
    roleTitle: "Cloud Infrastructure Specialist",
    period: "2018 — 2021",
    location: "Melbourne, Australia (Delivery)",
    headlineMetric: "30-40% Manual Effort Cut",
    bullets: [
      "Delivered mission-critical hybrid cloud infrastructure operations for Downer Group's transport and infrastructure management platforms.",
      "Eliminated 30–40% manual operational toil by designing Python and PowerShell automation runbooks for routine fleet maintenance and patch management.",
      "Received TCS Star Performer Award for flawless execution of zero-incident database migration to Azure SQL Managed Instance.",
    ],
    techStack: [
      "Azure IaaS",
      "PowerShell",
      "Python",
      "ARM Templates",
      "ITIL",
      "SolarWinds",
      "SQL MI",
    ],
  },
  {
    id: "tcs-abnamro",
    company: "Tata Consultancy Services // ABN AMRO",
    roleTitle: "Infrastructure Operations Analyst",
    period: "2015 — 2018",
    location: "New Delhi / Amsterdam (Delivery)",
    headlineMetric: "Zero Regulatory SLA Breaches",
    bullets: [
      "Monitored 24x7 production core banking transaction pipelines for ABN AMRO, ensuring strict compliance with European banking regulatory standards.",
      "Executed root cause analysis (RCA) and post-mortem incident reports for high-severity core banking outages with zero SLA breaches.",
      "Established operational runbooks and standard operating procedures (SOPs) adopted across global Tier-1 service desk teams.",
    ],
    techStack: [
      "Core Banking Infra",
      "ITIL v3",
      "Linux Enterprise",
      "Monitoring",
      "SLA Governance",
    ],
  },
] as const;

export const EXPERIENCE_ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  },
} as const;
