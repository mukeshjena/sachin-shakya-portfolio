// presentation/sections/telemetry/constants/telemetry.constants.ts
// Precision telemetry datasets, milestone annotations, and copy descriptors.
// Universal Separation of Concerns (Rule 13) — Zero inline hardcoded copy.

export interface MonthlySpendPoint {
  readonly month: string;
  readonly baseline: number; // in thousands ($K)
  readonly optimized: number; // in thousands ($K)
  readonly savings: number; // in thousands ($K)
  readonly milestone?: string;
}

export interface MttrBenchmarkItem {
  readonly tier: string;
  readonly name: string;
  readonly preMinutes: number;
  readonly postMinutes: number;
  readonly reductionPercent: number;
  readonly description: string;
}

export interface AutomationMetricItem {
  readonly category: string;
  readonly manualHours: number;
  readonly automatedHours: number;
  readonly reductionPercent: number;
  readonly frequency: string;
}

export interface FleetDistributionItem {
  readonly platform: string;
  readonly count: number;
  readonly percentage: number;
  readonly keyServices: readonly string[];
  readonly colorToken: string;
}

export interface TelemetryKpiCard {
  readonly label: string;
  readonly value: string;
  readonly numericValue: number;
  readonly prefix?: string;
  readonly suffix?: string;
  readonly change: string;
  readonly description: string;
  readonly accent: "amber" | "cyan" | "live";
}

export const TELEMETRY_COPY = {
  eyebrow: "IMPACT // SIX MEASURED PRODUCTION OUTCOMES",
  headline: "Numbers I Am Accountable For",
  subheadline:
    "Cloud operations is judged on two things: what it costs and whether it stays up. Grounded in verified multi-cloud production telemetry and automated runbooks.",
  tabs: {
    spend: "Cost Curve",
    mttr: "MTTR Benchmark",
    automation: "Automation ROI",
    fleet: "Fleet Topology",
  },
} as const;

export const TELEMETRY_KPIS: readonly TelemetryKpiCard[] = [
  {
    label: "Recurring Cloud Savings",
    value: "$170K",
    numericValue: 170,
    prefix: "$",
    suffix: "K/mo",
    change: "-37.8%",
    description:
      "Monthly recurring cloud expenditure reduction delivered across enterprise tenants",
    accent: "amber",
  },
  {
    label: "Mean Time to Resolution",
    value: "-40%",
    numericValue: 40,
    prefix: "-",
    suffix: "%",
    change: "120m → 72m",
    description: "Incident MTTR reduction via Datadog/Dynatrace APM & automated runbooks",
    accent: "cyan",
  },
  {
    label: "Managed Cloud Fleet",
    value: "2,000+",
    numericValue: 2000,
    suffix: "+",
    change: "95%+ IaC",
    description: "Production multi-cloud resources managed across Azure, AWS, and Hybrid links",
    accent: "live",
  },
  {
    label: "Manual Effort Reduction",
    value: "30-40%",
    numericValue: 35,
    suffix: "%",
    change: "35h → 8h/wk",
    description: "Manual operations eliminated through Terraform, GitHub Actions, and self-healing",
    accent: "amber",
  },
] as const;

export const MONTHLY_SPEND_SERIES: readonly MonthlySpendPoint[] = [
  { month: "Jan", baseline: 450, optimized: 450, savings: 0, milestone: "Baseline Audit" },
  { month: "Feb", baseline: 450, optimized: 432, savings: 18 },
  { month: "Mar", baseline: 452, optimized: 410, savings: 42, milestone: "Workload Rightsizing" },
  { month: "Apr", baseline: 448, optimized: 388, savings: 60 },
  { month: "May", baseline: 450, optimized: 365, savings: 85, milestone: "Storage Tiering" },
  { month: "Jun", baseline: 454, optimized: 345, savings: 109 },
  { month: "Jul", baseline: 450, optimized: 328, savings: 122, milestone: "Idle Reclamation" },
  { month: "Aug", baseline: 452, optimized: 312, savings: 140 },
  { month: "Sep", baseline: 448, optimized: 298, savings: 150, milestone: "85% RI / Savings Plan" },
  { month: "Oct", baseline: 450, optimized: 290, savings: 160 },
  { month: "Nov", baseline: 452, optimized: 282, savings: 170 },
  {
    month: "Dec",
    baseline: 450,
    optimized: 280,
    savings: 170,
    milestone: "$2.04M Run-Rate Target",
  },
] as const;

export const MTTR_BENCHMARKS: readonly MttrBenchmarkItem[] = [
  {
    tier: "P1",
    name: "Critical Outage",
    preMinutes: 180,
    postMinutes: 90,
    reductionPercent: 50,
    description: "Complete service degradation or severe customer outage",
  },
  {
    tier: "P2",
    name: "High Severity",
    preMinutes: 120,
    postMinutes: 65,
    reductionPercent: 46,
    description: "Degraded functionality with available redundancy failover",
  },
  {
    tier: "P3",
    name: "Medium / Warning",
    preMinutes: 60,
    postMinutes: 35,
    reductionPercent: 42,
    description: "Non-critical alert requiring proactive automated triage",
  },
  {
    tier: "Fleet Avg",
    name: "Weighted Mean",
    preMinutes: 120,
    postMinutes: 72,
    reductionPercent: 40,
    description: "Aggregate fleet-wide operational incident resolution time",
  },
] as const;

export const AUTOMATION_METRICS: readonly AutomationMetricItem[] = [
  {
    category: "Infrastructure Provisioning",
    manualHours: 12,
    automatedHours: 1.5,
    reductionPercent: 88,
    frequency: "Per Environment",
  },
  {
    category: "Deployment & Rollback",
    manualHours: 8,
    automatedHours: 1.2,
    reductionPercent: 85,
    frequency: "Per Release Cycle",
  },
  {
    category: "Health Checks & Drift Audits",
    manualHours: 6,
    automatedHours: 0.8,
    reductionPercent: 87,
    frequency: "Weekly",
  },
  {
    category: "Cloud Cost Optimization",
    manualHours: 9,
    automatedHours: 2.5,
    reductionPercent: 72,
    frequency: "Monthly",
  },
] as const;

export const FLEET_DISTRIBUTION: readonly FleetDistributionItem[] = [
  {
    platform: "Microsoft Azure",
    count: 1100,
    percentage: 55,
    keyServices: ["AKS", "Cosmos DB", "App Services", "ExpressRoute", "Azure Monitor"],
    colorToken: "#0078d4",
  },
  {
    platform: "Amazon Web Services",
    count: 600,
    percentage: 30,
    keyServices: ["EKS", "EC2", "RDS Multi-AZ", "S3 Tiered", "CloudWatch"],
    colorToken: "var(--amber)",
  },
  {
    platform: "Hybrid / GCP & On-Prem",
    count: 300,
    percentage: 15,
    keyServices: ["GKE", "Direct Connect", "Terraform Cloud", "Datadog Agents"],
    colorToken: "var(--cyan)",
  },
] as const;

export const TELEMETRY_ANIMATION_VARIANTS = {
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
