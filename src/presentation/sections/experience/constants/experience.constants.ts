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
  eyebrow: "EXPERIENCE // 2017 TO PRESENT",
  headline: "Four Roles, One Direction of Travel",
  subheadline:
    "Each move traded scope for depth: process analysis, then Azure support, then engineering, then leading the team that owns the multi-tenant SaaS platform.",
} as const;

export const EXPERIENCE_ROLES: readonly ExperienceRole[] = [
  {
    id: "eptura",
    company: "Eptura (formerly Condeco Software)",
    roleTitle: "Technical Lead — CloudOps",
    period: "JAN 2024 — PRESENT",
    location: "Multi-tenant SaaS · Global Enterprise Customers · Team of 10",
    headlineMetric: "$170K/mo Cloud Savings",
    bullets: [
      "Designed and implemented Azure optimisation strategies delivering ~$170K/month (~$2M/year) in savings through right-sizing, reserved instances, auto-scaling and resource lifecycle management.",
      "Brought Claude Code, GitHub Copilot, ChatGPT and Warp AI into engineering workflows to accelerate PowerShell scripting, YAML pipeline authoring and cloud automation — cutting development effort by ~30%.",
      "Led and mentored a cross-functional team of 10 engineers, establishing operational standards, runbook governance and knowledge-sharing practices across Agile sprints.",
      "Built and maintained Azure DevOps YAML pipelines and Azure Automation Runbooks covering provisioning, deployments and recurring operations across 2000+ cloud resources.",
      "Run enterprise SaaS infrastructure on Azure (App Services, Function Apps, APIM, Cosmos DB, Azure SQL, Data Factory, Logic Apps, Service Bus, Event Grid).",
      "Architected enterprise monitoring on Azure Monitor, Application Insights and Log Analytics (KQL), with Power BI dashboards for real-time SLA reporting and anomaly detection.",
      "Led P1/P2 resolution and reduced MTTR by ~40% via structured runbooks, automated alerting and post-incident RCA.",
    ],
    techStack: [
      "Azure",
      "AKS",
      "Cosmos DB",
      "Azure DevOps",
      "PowerShell",
      "KQL",
      "Power BI",
      "Claude Code",
      "GitHub Copilot",
    ],
  },
  {
    id: "ltimindtree",
    company: "LTIMindtree",
    roleTitle: "Specialist — Cloud Engineering",
    period: "FEB 2022 — DEC 2023",
    location:
      "A Larsen & Toubro Group Company · Healthcare Clients (Abbott Laboratories, Zoll Data)",
    headlineMetric: "$13K/mo Client Savings",
    bullets: [
      "Provisioned and managed App Services, Function Apps, AKS, APIM, Cosmos DB, SQL DB, Data Factory, Databricks, Synapse, Storage, Key Vault and Logic Apps for global healthcare clients.",
      "Identified and implemented infrastructure recommendations delivering ~$13K/month in client savings.",
      "Designed and maintained Azure DevOps pipelines (YAML, Azure CLI) to automate deployment workflows and shorten manual release cycles.",
      "Configured Azure Monitor, Application Insights and Log Analytics with custom KQL queries and Workbooks for proactive detection and compliance reporting.",
      "Enforced Azure AD, RBAC, Key Vault and Azure Defender policies; remediated cloud security vulnerabilities.",
      "Handled incidents, service requests, changes and problems in ServiceNow and JIRA under ITIL frameworks.",
      "Received SpotON-HatsOff Award for automation delivery and Leadership-Gracias Award for team excellence.",
    ],
    techStack: [
      "Azure",
      "AKS",
      "Azure DevOps",
      "Databricks",
      "Synapse",
      "Cosmos DB",
      "KQL",
      "ServiceNow",
      "JIRA",
    ],
  },
  {
    id: "tcs-downer",
    company: "Tata Consultancy Services",
    roleTitle: "Support Engineer — Azure Cloud",
    period: "OCT 2018 — JAN 2022",
    location: "Energy & Resources · Downer Group",
    headlineMetric: "30–40% Manual Effort Cut",
    bullets: [
      "Deployed and managed Azure IaaS/PaaS resources — VMs, Cosmos DB, SQL DB, Data Factory, Logic Apps, Storage Accounts across production and non-production environments.",
      "Configured Azure AD, MFA and RBAC roles, and managed user and group access to Azure resources.",
      "Wrote ARM templates and PowerShell scripts to automate resource provisioning and configuration management.",
      "Established monitoring, alerting and logging; held SLA compliance for P1/P2 incidents through ServiceNow.",
      "Tracked Azure resource utilisation and implemented cost-saving recommendations to keep budgets on target.",
      "Received TCS Kaizen Award for seven process-improvement ideas, Employee of the Month twice, Best Onshore Support Award and Best Quality Award.",
    ],
    techStack: [
      "Azure IaaS",
      "ARM Templates",
      "PowerShell",
      "Azure AD",
      "Cosmos DB",
      "Data Factory",
      "ServiceNow",
    ],
  },
  {
    id: "tcs-abnamro",
    company: "Tata Consultancy Services",
    roleTitle: "Process Analyst",
    period: "AUG 2017 — OCT 2018",
    location: "BFSI · ABN AMRO Bank",
    headlineMetric: "18% Headcount / 20% Throughput",
    bullets: [
      "Analysed and automated a critical manual process — mapped the process, worked with IT and ran UAT — achieving an 18% headcount reduction and 20% throughput increase.",
      "Ran QC Grid analysis and capacity utilisation planning; delivered weekly and monthly shrinkage reporting to management.",
      "Received Star Performer of the Month, TCS BFSI vertical, India.",
    ],
    techStack: [
      "Process Automation",
      "Workflow Mapping",
      "QC Grid",
      "Capacity Planning",
      "UAT",
      "Reporting",
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
