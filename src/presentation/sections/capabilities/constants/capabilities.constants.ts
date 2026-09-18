// presentation/sections/capabilities/constants/capabilities.constants.ts
// Domain categories, technical competencies, and tool pills.
// Universal Separation of Concerns (Rule 13) — Zero inline hardcoded copy.

export type CapabilityCategory =
  | "all"
  | "cloud"
  | "finops"
  | "devops"
  | "observability"
  | "containers"
  | "security";

export interface CapabilityCardItem {
  readonly id: string;
  readonly category: CapabilityCategory;
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;
  readonly skills: readonly string[];
}

export const CAPABILITIES_COPY = {
  eyebrow: "TECHNICAL COMPETENCIES // ENTERPRISE PROFICIENCY",
  headline: "Filter by What You Are Hiring For",
  subheadline:
    "Nine years across multi-cloud production architecture, FinOps governance, and continuous automation. Select a domain below to inspect specific proficiencies.",
  filterCategories: [
    { key: "all" as const, label: "All Domains" },
    { key: "cloud" as const, label: "Cloud Platforms" },
    { key: "finops" as const, label: "FinOps & Cost" },
    { key: "devops" as const, label: "DevOps & IaC" },
    { key: "observability" as const, label: "Observability & SRE" },
    { key: "containers" as const, label: "Containers & K8s" },
    { key: "security" as const, label: "Security & ITSM" },
  ],
} as const;

export const CAPABILITY_CARDS: readonly CapabilityCardItem[] = [
  {
    id: "multi-cloud",
    category: "cloud",
    title: "Multi-Cloud Architecture",
    subtitle: "AZURE & AWS ENTERPRISE LANDING ZONES",
    description:
      "Architecting highly available, fault-tolerant cloud infrastructures across Azure and AWS with hybrid on-prem connectivity.",
    skills: [
      "Azure Landing Zones",
      "AWS Well-Architected",
      "ExpressRoute",
      "VPC Peering",
      "Availability Zones",
      "Hub-Spoke Topology",
    ],
  },
  {
    id: "finops-cost",
    category: "finops",
    title: "FinOps & Cloud Cost Governance",
    subtitle: "$170K/MONTH VERIFIED RUN-RATE REDUCTION",
    description:
      "Establishing enterprise FinOps operating models, automated cost anomaly detection, and capacity planning delivering millions in annual savings.",
    skills: [
      "Azure Cost Management",
      "AWS Cost Explorer",
      "Reserved Instances",
      "Savings Plans",
      "Kubecost",
      "Storage Tiering",
      "Rightsizing",
    ],
  },
  {
    id: "iac-automation",
    category: "devops",
    title: "Infrastructure as Code & Automation",
    subtitle: "DECLARATIVE & IMMUTABLE CLOUD DEPLOYMENTS",
    description:
      "Automating full-stack infrastructure provisioning using reusable Terraform modules with automated policy-as-code validation.",
    skills: [
      "Terraform",
      "Terragrunt",
      "Ansible",
      "ARM Templates",
      "Bicep",
      "Python",
      "PowerShell",
      "Bash Scripting",
    ],
  },
  {
    id: "cicd-devsecops",
    category: "devops",
    title: "CI/CD & Release Engineering",
    subtitle: "ZERO-DOWNTIME CONTINUOUS DELIVERY",
    description:
      "Engineering secure, automated continuous integration and continuous delivery pipelines with integrated vulnerability scans.",
    skills: [
      "GitHub Actions",
      "Azure DevOps Pipelines",
      "ArgoCD",
      "GitOps",
      "Docker BuildKit",
      "SonarQube",
      "Blue/Green Deployments",
    ],
  },
  {
    id: "observability-sre",
    category: "observability",
    title: "Observability & SRE Instrumentation",
    subtitle: "FULL-STACK APM & 40% MTTR CUT",
    description:
      "Instrumenting enterprise telemetry, synthetic monitoring, SLI/SLO tracking, and self-healing incident triage runbooks.",
    skills: [
      "Datadog",
      "Dynatrace",
      "Prometheus",
      "Grafana",
      "Azure Monitor",
      "Log Analytics",
      "CloudWatch",
      "Synthetic Canaries",
    ],
  },
  {
    id: "containers-k8s",
    category: "containers",
    title: "Kubernetes & Container Platforms",
    subtitle: "PRODUCTION K8S AT ENTERPRISE SCALE",
    description:
      "Designing and operating production-grade Kubernetes clusters with automated cluster autoscaling, ingress controllers, and mesh routing.",
    skills: [
      "Azure Kubernetes (AKS)",
      "Amazon EKS",
      "Helm Charts",
      "Docker",
      "Istio Service Mesh",
      "CoreDNS",
      "Cluster Autoscaler",
    ],
  },
  {
    id: "databases-storage",
    category: "cloud",
    title: "Cloud Data Services & Storage",
    subtitle: "ENTERPRISE DATA HIGH AVAILABILITY",
    description:
      "Managing distributed, highly available relational and NoSQL database clusters with automated backups and cross-region replication.",
    skills: [
      "Azure SQL Managed Instance",
      "Cosmos DB",
      "AWS RDS Multi-AZ",
      "PostgreSQL",
      "Azure Blob Lifecycle",
      "AWS S3 Tiering",
    ],
  },
  {
    id: "security-itsm",
    category: "security",
    title: "Security, ITSM & Reliability",
    subtitle: "ZERO TRUST ARCHITECTURE & ITIL GOVERNANCE",
    description:
      "Implementing least-privilege RBAC, cloud security posture management (CSPM), regulatory audit readiness, and incident management.",
    skills: [
      "Azure RBAC",
      "AWS IAM",
      "Azure Key Vault",
      "ITIL v4",
      "Disaster Recovery (RTO/RPO)",
      "SOC2 Compliance",
      "RCA Post-Mortems",
    ],
  },
] as const;

export const CAPABILITIES_ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
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
