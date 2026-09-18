/**
 * scripts/seed/seed-content.ts
 * Idempotent content seeder for Sachin Shakya Portfolio.
 * Populates all collections using deterministic IDs and setDoc(..., { merge: true }).
 */

import { doc, setDoc } from "firebase/firestore";
import { db } from "../../src/infrastructure/firebase/firebaseClient";
import type { SeededMediaMap } from "./seed-media";

export async function seedContent(media: SeededMediaMap): Promise<void> {
  console.log("\n==========================================================");
  console.log("Phase 2: Seeding Firestore Collections (Deterministic IDs)");
  console.log("==========================================================");

  const timestamp = new Date().toISOString();

  // 1. Site Settings (Singleton 'global')
  console.log("Seeding siteSettings/global...");
  await setDoc(
    doc(db, "siteSettings", "global"),
    {
      id: "global",
      fullName: "Sachin Shakya",
      headline: "Lead Cloud Architect & DevOps Consultant",
      shortBio:
        "Results-driven Cloud Architect with 8+ years architecting enterprise multi-cloud platforms, FinOps governance, and automated CI/CD pipelines. Documented $170K/month cloud cost reduction and 40% MTTR improvement across mission-critical systems.",
      email: "sachin.shakya@live.com",
      phone: "+91 99112 00473",
      location: "Faridabad, Haryana, India",
      logoUrl: media.logoUrl,
      avatarUrl: media.heroPhotoUrl,
      resumePdfUrl: media.resumePdfUrl || "/Sachin_Shakya_Resume.pdf",
      availabilityStatus: "available",
      availabilityNote: "Available for Lead Cloud Architecture & Advisory Roles",
      socialLinks: [
        {
          platform: "linkedin",
          label: "LinkedIn",
          url: "https://www.linkedin.com/in/sachin-shakya/",
          isVisible: true,
          order: 1,
        },
        {
          platform: "github",
          label: "GitHub",
          url: "https://github.com/mukeshjena",
          isVisible: true,
          order: 2,
        },
        {
          platform: "email",
          label: "Direct Email",
          url: "mailto:sachin.shakya@live.com",
          isVisible: true,
          order: 3,
        },
      ],
      updatedAt: timestamp,
    },
    { merge: true }
  );

  // 2. Pages ('home')
  console.log("Seeding pages/home...");
  await setDoc(
    doc(db, "pages", "home"),
    {
      id: "home",
      slug: "home",
      title: "Executive Portfolio — Sachin Shakya",
      sectionOrder: [
        "home-hero-0",
        "home-impact-1",
        "home-telemetry-2",
        "home-experience-3",
        "home-capabilities-4",
        "home-credentials-5",
        "home-contact-6",
      ],
      isPublished: true,
      showInHeader: true,
      showInFooter: true,
      seoTitle: "Sachin Shakya — Lead Cloud Architect & DevOps Consultant",
      seoDescription:
        "Official executive portfolio of Sachin Shakya. Specializing in enterprise AWS, Azure, FinOps cost optimization ($170K/mo savings), and Kubernetes telemetry.",
      seoImage: media.heroPhotoUrl,
      updatedAt: timestamp,
    },
    { merge: true }
  );

  // 3. Sections
  console.log("Seeding sections...");
  const sections = [
    {
      id: "home-hero-0",
      pageId: "home",
      type: "hero",
      title: "Mission Control Hero",
      order: 0,
      isVisible: true,
      content: {
        eyebrow: "LEAD CLOUD ARCHITECT & FINOPS CONSULTANT",
        headline: "Enterprise Cloud Reliability at Mission-Critical Scale",
        subheadline:
          "Architecting high-availability infrastructure across Azure & AWS, slashing cloud bills by $170K/month, and reducing incident MTTR by 40%.",
        ctaPrimary: "View Telemetry",
        ctaSecondary: "Get Résumé",
        heroPhotoUrl: media.heroPhotoUrl,
      },
    },
    {
      id: "home-impact-1",
      pageId: "home",
      type: "impact",
      title: "Key Impact Metrics",
      order: 1,
      isVisible: true,
      content: {
        heading: "Numbers I Am Accountable For",
        subheading:
          "Verifiable operational and financial metrics delivered across global enterprise engagements.",
      },
    },
    {
      id: "home-telemetry-2",
      pageId: "home",
      type: "telemetry",
      title: "Command Center Telemetry",
      order: 2,
      isVisible: true,
      content: {
        heading: "Architecture Telemetry & FinOps Trajectory",
        subheading:
          "Interactive instrument panel displaying real-time cloud spend reduction curves, MTTR resolution ladders, and fleet allocation.",
      },
    },
    {
      id: "home-experience-3",
      pageId: "home",
      type: "experience",
      title: "Professional Trajectory",
      order: 3,
      isVisible: true,
      content: {
        heading: "Four Roles, One Trajectory of Mastery",
        subheading:
          "Hands-on leadership across Eptura, LTIMindtree, and Tata Consultancy Services.",
        experiencePhotoUrl: media.experiencePhotoUrl,
      },
    },
    {
      id: "home-capabilities-4",
      pageId: "home",
      type: "capabilities",
      title: "Core Competencies",
      order: 4,
      isVisible: true,
      content: {
        heading: "Enterprise Technical Capabilities",
        subheading:
          "Filter by what you are hiring for across cloud platforms, container orchestration, observability, and AI automation.",
      },
    },
    {
      id: "home-credentials-5",
      pageId: "home",
      type: "credentials",
      title: "Certifications & Education",
      order: 5,
      isVisible: true,
      content: {
        heading: "Certified, Schooled & Industry Recognized",
        subheading:
          "Formal Microsoft, AWS, and ITIL accreditations paired with advanced academic foundation in computer applications.",
      },
    },
    {
      id: "home-contact-6",
      pageId: "home",
      type: "contact",
      title: "Consultation & Contact",
      order: 6,
      isVisible: true,
      content: {
        heading: "Let's Talk About Your Cloud Architecture",
        subheading:
          "Direct engagement inquiry for consulting, FinOps audits, or senior leadership roles.",
      },
    },
  ];

  for (const sec of sections) {
    await setDoc(doc(db, "sections", sec.id), { ...sec, updatedAt: timestamp }, { merge: true });
  }

  // 4. Telemetry Metrics (KPIs)
  console.log("Seeding telemetryMetrics...");
  const kpis = [
    {
      id: "kpi-finops-savings",
      category: "finops",
      title: "Cloud Spend Optimization",
      subtitle: "Monthly recurring Azure & AWS bill reduction",
      headlineValue: "$170K/mo",
      unit: "USD / month",
      baselineValue: 450000,
      targetValue: 280000,
      changePercentage: -37.8,
      direction: "down",
      timeframe: "12-Month Run-Rate",
      order: 1,
      isFeatured: true,
    },
    {
      id: "kpi-mttr-reduction",
      category: "reliability",
      title: "Incident MTTR Improvement",
      subtitle: "Mean time to recovery across P1 & P2 outages",
      headlineValue: "40%",
      unit: "recovery time",
      baselineValue: 180,
      targetValue: 90,
      changePercentage: -40,
      direction: "down",
      timeframe: "Continuous Operations",
      order: 2,
      isFeatured: true,
    },
    {
      id: "kpi-fleet-scale",
      category: "scale",
      title: "Multi-Cloud Fleet Governance",
      subtitle: "Active VM, container & PaaS cloud resources",
      headlineValue: "2,000+",
      unit: "cloud resources",
      baselineValue: 1200,
      targetValue: 2000,
      changePercentage: 66.7,
      direction: "up",
      timeframe: "Global Infrastructure",
      order: 3,
      isFeatured: true,
    },
    {
      id: "kpi-availability-sla",
      category: "availability",
      title: "System Availability SLA",
      subtitle: "Enterprise uptime across production clusters",
      headlineValue: "99.99%",
      unit: "fleet uptime",
      baselineValue: 99.5,
      targetValue: 99.99,
      changePercentage: 0.49,
      direction: "up",
      timeframe: "365-Day Rolling",
      order: 4,
      isFeatured: true,
    },
    {
      id: "kpi-automation-toil",
      category: "automation",
      title: "Manual Effort Reduction",
      subtitle: "Routine operational toil automated via Terraform",
      headlineValue: "35%+",
      unit: "toil eliminated",
      baselineValue: 35,
      targetValue: 8,
      changePercentage: -77.1,
      direction: "down",
      timeframe: "Weekly Engineering Hours",
      order: 5,
      isFeatured: false,
    },
  ];

  for (const kpi of kpis) {
    await setDoc(
      doc(db, "telemetryMetrics", kpi.id),
      { ...kpi, updatedAt: timestamp },
      { merge: true }
    );
  }

  // 5. FinOps Multi-Month Trajectory Series
  console.log("Seeding telemetryCostSeries/finops-trajectory-12m...");
  await setDoc(
    doc(db, "telemetryCostSeries", "finops-trajectory-12m"),
    {
      id: "finops-trajectory-12m",
      title: "12-Month FinOps Cloud Spend Optimization Curve",
      description:
        "Chronological progression of enterprise cloud expenditure showing $170K/month reduction ($2.04M annualized run-rate savings).",
      currency: "USD",
      annualRunRateSavings: 2040000,
      targetSavingsPercent: 37.8,
      points: [
        {
          month: "Jan 23",
          baselineSpend: 450000,
          optimizedSpend: 442000,
          savingsDelta: 8000,
          cumulativeSavings: 8000,
          milestone: "Baseline Audit & Telemetry Tagging",
        },
        {
          month: "Feb 23",
          baselineSpend: 450000,
          optimizedSpend: 425000,
          savingsDelta: 25000,
          cumulativeSavings: 33000,
          milestone: "Orphaned Storage & Disk Cleanup",
        },
        {
          month: "Mar 23",
          baselineSpend: 450000,
          optimizedSpend: 410000,
          savingsDelta: 40000,
          cumulativeSavings: 73000,
          milestone: "Overprovisioned VM Rightsizing",
        },
        {
          month: "Apr 23",
          baselineSpend: 450000,
          optimizedSpend: 395000,
          savingsDelta: 55000,
          cumulativeSavings: 128000,
          milestone: "Non-Prod Automated Sleep Schedules",
        },
        {
          month: "May 23",
          baselineSpend: 450000,
          optimizedSpend: 380000,
          savingsDelta: 70000,
          cumulativeSavings: 198000,
          milestone: "AKS Node Pool Architecture Tuning",
        },
        {
          month: "Jun 23",
          baselineSpend: 450000,
          optimizedSpend: 360000,
          savingsDelta: 90000,
          cumulativeSavings: 288000,
          milestone: "Reserved Instances Coverage at 50%",
        },
        {
          month: "Jul 23",
          baselineSpend: 450000,
          optimizedSpend: 345000,
          savingsDelta: 105000,
          cumulativeSavings: 393000,
          milestone: "PaaS Database vCore Optimizations",
        },
        {
          month: "Aug 23",
          baselineSpend: 450000,
          optimizedSpend: 330000,
          savingsDelta: 120000,
          cumulativeSavings: 513000,
          milestone: "Cross-Region Egress Traffic Consolidation",
        },
        {
          month: "Sep 23",
          baselineSpend: 450000,
          optimizedSpend: 315000,
          savingsDelta: 135000,
          cumulativeSavings: 648000,
          milestone: "Azure Savings Plans Coverage at 75%",
        },
        {
          month: "Oct 23",
          baselineSpend: 450000,
          optimizedSpend: 300000,
          savingsDelta: 150000,
          cumulativeSavings: 798000,
          milestone: "Spot Instance Adoption in Batch Jobs",
        },
        {
          month: "Nov 23",
          baselineSpend: 450000,
          optimizedSpend: 290000,
          savingsDelta: 160000,
          cumulativeSavings: 958000,
          milestone: "Governance Guardrails & Budget Alerts",
        },
        {
          month: "Dec 23",
          baselineSpend: 450000,
          optimizedSpend: 280000,
          savingsDelta: 170000,
          cumulativeSavings: 1128000,
          milestone: "Target Run-Rate Achieved: $170K/mo Savings",
        },
      ],
      updatedAt: timestamp,
    },
    { merge: true }
  );

  // 6. Incident MTTR & Fleet Distribution Benchmarks
  console.log("Seeding telemetryBenchmarks/benchmark-mttr-fleet...");
  await setDoc(
    doc(db, "telemetryBenchmarks", "benchmark-mttr-fleet"),
    {
      id: "benchmark-mttr-fleet",
      overallReductionPercent: 40,
      tiers: [
        {
          tier: "P1",
          tierName: "Critical Service Outage",
          preAutomationMinutes: 180,
          postAutomationMinutes: 90,
          improvementPercent: -50,
          sampleSize: 24,
          primaryAutomations: ["Automated Health Probe Failover", "Runbook Self-Healing Triggers"],
        },
        {
          tier: "P2",
          tierName: "Major Service Degradation",
          preAutomationMinutes: 120,
          postAutomationMinutes: 65,
          improvementPercent: -45.8,
          sampleSize: 68,
          primaryAutomations: ["Datadog Synthetic Log Triaging", "Auto-Scaling Burst Policies"],
        },
        {
          tier: "P3",
          tierName: "Moderate Infrastructure Alert",
          preAutomationMinutes: 60,
          postAutomationMinutes: 35,
          improvementPercent: -41.7,
          sampleSize: 142,
          primaryAutomations: ["Terraform Drift Detection", "Disk Volume Auto-Expansion"],
        },
      ],
      resourceDistribution: [
        {
          platform: "azure",
          platformLabel: "Microsoft Azure",
          resourceCount: 1100,
          percentage: 55,
          keyServices: ["AKS", "Azure SQL", "App Services", "VNet", "Key Vault"],
        },
        {
          platform: "aws",
          platformLabel: "Amazon Web Services",
          resourceCount: 600,
          percentage: 30,
          keyServices: ["EKS", "RDS PostgreSQL", "EC2", "S3", "CloudFront"],
        },
        {
          platform: "hybrid",
          platformLabel: "Hybrid & GCP",
          resourceCount: 300,
          percentage: 15,
          keyServices: ["BigQuery", "GKE", "On-Prem Gateway", "ExpressRoute"],
        },
      ],
      manualWeeklyHoursBefore: 35,
      automatedWeeklyHoursAfter: 8,
      manualEffortReductionPercent: 35,
      updatedAt: timestamp,
    },
    { merge: true }
  );

  // 7. Career Experience
  console.log("Seeding experience...");
  const roles = [
    {
      id: "exp-eptura",
      company: "Eptura",
      role: "Lead Cloud Operations & DevOps Architect",
      location: "Melbourne / Remote",
      period: "03/2024 – Present",
      startDate: "2024-03-01",
      endDate: "Present",
      isCurrent: true,
      summary:
        "Spearheading global cloud infrastructure operations across Azure and AWS. Architected FinOps cost governance program delivering $170K/month sustained savings.",
      achievements: [
        "Architected FinOps multi-account governance yielding $170,000/month recurring cloud cost reductions ($2.04M annualized).",
        "Led 10-engineer platform operations team supporting 2,000+ cloud workloads with 99.99% uptime.",
        "Engineered automated Terraform/GitLab CI pipelines cutting provisioning lead times from days to 18 minutes.",
      ],
      technologies: ["Azure", "AWS", "Terraform", "Kubernetes", "Datadog", "FinOps", "GitLab CI"],
      order: 1,
    },
    {
      id: "exp-ltimindtree",
      company: "LTIMindtree",
      role: "Specialist — Cloud Architecture & DevOps",
      location: "Pune / Remote",
      period: "07/2022 – 03/2024",
      startDate: "2022-07-01",
      endDate: "2024-03-01",
      isCurrent: false,
      summary:
        "Designed and deployed enterprise hybrid-cloud landing zones and automated release pipelines for Fortune 500 financial and logistics accounts.",
      achievements: [
        "Reduced Mean Time To Recovery (MTTR) by 40% through unified Datadog telemetry and automated incident runbooks.",
        "Eliminated 30–40% of repetitive operational tasks via infrastructure-as-code automation and self-healing scripts.",
        "Built enterprise Azure Landing Zones complying with strict CIS benchmarks and SOC2 standards.",
      ],
      technologies: [
        "Microsoft Azure",
        "Docker",
        "Kubernetes",
        "Terraform",
        "Dynatrace",
        "Shell Scripting",
      ],
      order: 2,
    },
    {
      id: "exp-tcs-downer",
      company: "Tata Consultancy Services",
      client: "Downer Group (Australia)",
      role: "Cloud DevOps Consultant",
      location: "Melbourne / Noida",
      period: "03/2021 – 07/2022",
      startDate: "2021-03-01",
      endDate: "2022-07-01",
      isCurrent: false,
      summary:
        "Delivered large-scale AWS and Azure migration programs for Downer Group, establishing automated CI/CD and immutable infrastructure.",
      achievements: [
        "Migrated 150+ on-premises enterprise workloads to AWS and Azure with zero unplanned downtime.",
        "Standardized container deployment pipelines using Docker, Kubernetes, and GitLab CI.",
        "Recipient of multiple TCS client appreciation awards for excellence in cloud migration delivery.",
      ],
      technologies: ["AWS", "Azure", "Kubernetes", "GitLab CI", "Terraform", "Python"],
      order: 3,
    },
    {
      id: "exp-tcs-abn",
      company: "Tata Consultancy Services",
      client: "ABN AMRO Bank (Netherlands)",
      role: "Systems Engineer — Cloud Infrastructure",
      location: "Amsterdam / Gurgaon",
      period: "11/2016 – 03/2021",
      startDate: "2016-11-01",
      endDate: "2021-03-01",
      isCurrent: false,
      summary:
        "Managed high-volume banking infrastructure, automated Linux server configuration, and supported critical financial transaction pipelines.",
      achievements: [
        "Maintained 99.99% availability across high-security banking transaction processing clusters.",
        "Automated recurring server provisioning and vulnerability patching across 800+ Linux instances.",
        "Managed production incident response adhering strictly to ITIL v4 methodologies.",
      ],
      technologies: ["Linux", "Bash", "ITIL v4", "Ansible", "VMware", "ServiceNow"],
      order: 4,
    },
  ];

  for (const exp of roles) {
    await setDoc(doc(db, "experience", exp.id), { ...exp, updatedAt: timestamp }, { merge: true });
  }

  // 8. Core Competencies
  console.log("Seeding competencies...");
  const skills = [
    {
      id: "comp-cloud-platforms",
      category: "Cloud Platforms",
      description: "Multi-cloud architecture, landing zones, and hybrid network interconnects.",
      skills: [
        "Microsoft Azure",
        "Amazon Web Services (AWS)",
        "Google Cloud (GCP)",
        "Hybrid Cloud",
        "Azure Landing Zones",
      ],
      proficiencyLevel: "expert",
      iconName: "PiCloud",
      order: 1,
    },
    {
      id: "comp-devops-iac",
      category: "DevOps & Infrastructure as Code",
      description: "Declarative infrastructure, containerization, and automated release gates.",
      skills: [
        "Terraform",
        "Terragrunt",
        "Docker",
        "Kubernetes (AKS / EKS)",
        "Helm",
        "GitLab CI",
        "GitHub Actions",
      ],
      proficiencyLevel: "expert",
      iconName: "PiTerminal",
      order: 2,
    },
    {
      id: "comp-observability",
      category: "Observability & SRE",
      description: "Full-stack monitoring, synthetic probes, APM tracing, and MTTR reduction.",
      skills: [
        "Datadog",
        "Dynatrace",
        "Azure Monitor",
        "AWS CloudWatch",
        "Prometheus",
        "Grafana",
        "Log Analytics",
      ],
      proficiencyLevel: "expert",
      iconName: "PiChartLine",
      order: 3,
    },
    {
      id: "comp-security-gov",
      category: "Security, FinOps & Governance",
      description: "Shift-left vulnerability scanning, policy enforcement, and spend optimization.",
      skills: [
        "FinOps Cost Governance",
        "Azure Policies",
        "IAM & RBAC",
        "Trivy",
        "SonarQube",
        "CIS Benchmarks",
      ],
      proficiencyLevel: "advanced",
      iconName: "PiShieldCheck",
      order: 4,
    },
    {
      id: "comp-ai-automation",
      category: "AI Tools & Scripting",
      description:
        "AI-accelerated engineering, self-healing automations, and operational scripting.",
      skills: [
        "GitHub Copilot",
        "Cursor AI",
        "ChatGPT Enterprise",
        "Python",
        "Bash / Shell Scripting",
        "PowerShell",
      ],
      proficiencyLevel: "advanced",
      iconName: "PiCpu",
      order: 5,
    },
    {
      id: "comp-databases",
      category: "Databases & Middleware",
      description: "Managed data stores, high-throughput caching, and messaging backbones.",
      skills: [
        "PostgreSQL",
        "Azure Cosmos DB",
        "AWS DynamoDB",
        "Redis Cache",
        "Kafka",
        "Azure Service Bus",
      ],
      proficiencyLevel: "proficient",
      iconName: "PiDatabase",
      order: 6,
    },
  ];

  for (const comp of skills) {
    await setDoc(
      doc(db, "competencies", comp.id),
      { ...comp, updatedAt: timestamp },
      { merge: true }
    );
  }

  // 9. Certifications & Education
  console.log("Seeding certifications and education...");
  const certs = [
    {
      id: "cert-az-104",
      name: "Microsoft Certified: Azure Administrator Associate",
      issuer: "Microsoft",
      code: "AZ-104",
      issueDate: "2023",
      order: 1,
    },
    {
      id: "cert-az-900",
      name: "Microsoft Certified: Azure Fundamentals",
      issuer: "Microsoft",
      code: "AZ-900",
      issueDate: "2021",
      order: 2,
    },
    {
      id: "cert-dp-900",
      name: "Microsoft Certified: Azure Data Fundamentals",
      issuer: "Microsoft",
      code: "DP-900",
      issueDate: "2022",
      order: 3,
    },
    {
      id: "cert-sc-900",
      name: "Microsoft Certified: Security, Compliance & Identity",
      issuer: "Microsoft",
      code: "SC-900",
      issueDate: "2022",
      order: 4,
    },
    {
      id: "cert-clf-c01",
      name: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services",
      code: "CLF-C01",
      issueDate: "2022",
      order: 5,
    },
    {
      id: "cert-itil-v4",
      name: "ITIL 4 Foundation in IT Service Management",
      issuer: "AXELOS",
      code: "ITIL-4",
      issueDate: "2020",
      order: 6,
    },
    {
      id: "edu-mca",
      name: "Master of Computer Applications (MCA)",
      issuer: "Jamia Hamdard University",
      code: "MCA",
      issueDate: "2016",
      order: 7,
    },
    {
      id: "edu-bsc",
      name: "Bachelor of Science (B.Sc.)",
      issuer: "Dr. B.R. Ambedkar University",
      code: "B.Sc.",
      issueDate: "2013",
      order: 8,
    },
  ];

  for (const c of certs) {
    await setDoc(doc(db, "certifications", c.id), { ...c, updatedAt: timestamp }, { merge: true });
  }

  // 10. Promo Popup (Singleton 'global')
  console.log("Seeding promoPopup/global...");
  await setDoc(
    doc(db, "promoPopup", "global"),
    {
      id: "global",
      isEnabled: true,
      heading: "Optimize Your Cloud Infrastructure",
      subheading:
        "Looking to reduce Azure/AWS spend or accelerate your DevOps delivery pipeline? Let's schedule a 30-minute cloud architecture review.",
      badgeText: "FINOPS & DEVOPS CONSULTATION",
      ctaText: "Schedule Cloud Review",
      ctaLink: "#contact",
      imageUrl: media.experiencePhotoUrl,
      displayDelaySeconds: 6,
      recurrenceDays: 7,
      updatedAt: timestamp,
    },
    { merge: true }
  );

  console.log("==========================================================");
  console.log("✓ Firestore collections seeded with 100% deterministic IDs!");
  console.log("==========================================================");
}
