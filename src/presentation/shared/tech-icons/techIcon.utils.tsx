// presentation/shared/tech-icons/techIcon.utils.tsx
// Pure deterministic helper mapping technology names to authentic vector outline icons.
// Strictly zero emojis (Rule 3).

import type { ReactNode } from "react";
import { FaAws, FaDocker, FaPython } from "react-icons/fa6";
import {
  IoAnalyticsOutline,
  IoCodeSlashOutline,
  IoHardwareChipOutline,
  IoLayersOutline,
  IoServerOutline,
  IoShieldCheckmarkOutline,
  IoSparklesOutline,
  IoTerminalOutline,
} from "react-icons/io5";
import {
  SiAnsible,
  SiClaude,
  SiDatabricks,
  SiDatadog,
  SiDynatrace,
  SiGithub,
  SiGithubcopilot,
  SiGrafana,
  SiJira,
  SiKubernetes,
  SiLinux,
  SiMongodb,
  SiPostgresql,
  SiPrometheus,
  SiTerraform,
} from "react-icons/si";
import { VscAzure, VscAzureDevops } from "react-icons/vsc";

export function resolveTechIcon(name: string, className = "w-3 h-3"): ReactNode {
  const normalized = name.toLowerCase().trim();

  // Cloud Providers
  if (normalized.includes("azure") && !normalized.includes("devops")) {
    return <VscAzure className={className} aria-hidden="true" />;
  }
  if (normalized.includes("aws")) {
    return <FaAws className={className} aria-hidden="true" />;
  }

  // Containers & Orchestration
  if (
    normalized.includes("aks") ||
    normalized.includes("eks") ||
    normalized.includes("k8s") ||
    normalized.includes("kubernetes")
  ) {
    return <SiKubernetes className={className} aria-hidden="true" />;
  }
  if (normalized.includes("docker")) {
    return <FaDocker className={className} aria-hidden="true" />;
  }

  // Infrastructure as Code & CI/CD
  if (normalized.includes("terraform")) {
    return <SiTerraform className={className} aria-hidden="true" />;
  }
  if (normalized.includes("ansible")) {
    return <SiAnsible className={className} aria-hidden="true" />;
  }
  if (normalized.includes("azure devops") || normalized.includes("pipeline")) {
    return <VscAzureDevops className={className} aria-hidden="true" />;
  }
  if (normalized.includes("copilot")) {
    return <SiGithubcopilot className={className} aria-hidden="true" />;
  }
  if (normalized.includes("github") || normalized.includes("git")) {
    return <SiGithub className={className} aria-hidden="true" />;
  }

  // AI Tooling
  if (normalized.includes("claude")) {
    return <SiClaude className={className} aria-hidden="true" />;
  }
  if (normalized.includes("chatgpt") || normalized.includes("ai") || normalized.includes("warp")) {
    return <IoSparklesOutline className={className} aria-hidden="true" />;
  }

  // Scripting & Languages
  if (normalized.includes("powershell")) {
    return <IoTerminalOutline className={className} aria-hidden="true" />;
  }
  if (normalized.includes("python")) {
    return <FaPython className={className} aria-hidden="true" />;
  }
  if (
    normalized.includes("bash") ||
    normalized.includes("terminal") ||
    normalized.includes("cli") ||
    normalized.includes("kql")
  ) {
    return <IoTerminalOutline className={className} aria-hidden="true" />;
  }
  if (normalized.includes("linux")) {
    return <SiLinux className={className} aria-hidden="true" />;
  }

  // Observability & Telemetry
  if (normalized.includes("datadog")) {
    return <SiDatadog className={className} aria-hidden="true" />;
  }
  if (normalized.includes("dynatrace")) {
    return <SiDynatrace className={className} aria-hidden="true" />;
  }
  if (normalized.includes("prometheus")) {
    return <SiPrometheus className={className} aria-hidden="true" />;
  }
  if (normalized.includes("grafana")) {
    return <SiGrafana className={className} aria-hidden="true" />;
  }
  if (
    normalized.includes("power bi") ||
    normalized.includes("reporting") ||
    normalized.includes("analytics") ||
    normalized.includes("monitor")
  ) {
    return <IoAnalyticsOutline className={className} aria-hidden="true" />;
  }

  // Data & Databases
  if (normalized.includes("databricks") || normalized.includes("synapse")) {
    return <SiDatabricks className={className} aria-hidden="true" />;
  }
  if (normalized.includes("sql") || normalized.includes("postgres")) {
    return <SiPostgresql className={className} aria-hidden="true" />;
  }
  if (normalized.includes("cosmos") || normalized.includes("mongo")) {
    return <SiMongodb className={className} aria-hidden="true" />;
  }
  if (normalized.includes("data factory") || normalized.includes("storage")) {
    return <IoServerOutline className={className} aria-hidden="true" />;
  }

  // Enterprise Process & Service Management
  if (normalized.includes("servicenow")) {
    return <IoLayersOutline className={className} aria-hidden="true" />;
  }
  if (normalized.includes("jira")) {
    return <SiJira className={className} aria-hidden="true" />;
  }
  if (
    normalized.includes("itil") ||
    normalized.includes("security") ||
    normalized.includes("sla") ||
    normalized.includes("rbac") ||
    normalized.includes("governance")
  ) {
    return <IoShieldCheckmarkOutline className={className} aria-hidden="true" />;
  }
  if (
    normalized.includes("arm") ||
    normalized.includes("iaas") ||
    normalized.includes("paas") ||
    normalized.includes("architecture")
  ) {
    return <IoLayersOutline className={className} aria-hidden="true" />;
  }
  if (
    normalized.includes("automation") ||
    normalized.includes("process") ||
    normalized.includes("workflow") ||
    normalized.includes("planning") ||
    normalized.includes("uat")
  ) {
    return <IoHardwareChipOutline className={className} aria-hidden="true" />;
  }

  return <IoCodeSlashOutline className={className} aria-hidden="true" />;
}
