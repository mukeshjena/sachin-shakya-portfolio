// presentation/shared/seo/constants/seo.constants.ts
// Centralized SEO constants, fallback copy, credentials, and social URLs.

export const SEO_CONSTANTS = {
  SITE_NAME: "Sachin Shakya — Professional Cloud & DevOps Portfolio",
  DEFAULT_TITLE: "Sachin Shakya — Lead Cloud Architect & DevOps Consultant",
  DEFAULT_DESCRIPTION:
    "AI-Native Lead Cloud Architect managing 2,000+ multi-cloud resources with $170K/month verified cost optimization and 40% MTTR reduction across AWS, Microsoft Azure, and Kubernetes.",
  DEFAULT_OG_IMAGE: "/og-image.png",
  AUTHOR: "Sachin Shakya",
  DEFAULT_CANONICAL: "https://shakya.mukeshjena.com",
  DEFAULT_ROBOTS: "index, follow",
  NOINDEX_ROBOTS: "noindex, nofollow",
  KEYWORDS: [
    "Sachin Shakya",
    "Lead Cloud Architect",
    "DevOps Consultant",
    "Cloud Cost Optimization",
    "CloudOps Lead",
    "Cloud Operations",
    "AWS",
    "Microsoft Azure",
    "Kubernetes",
    "Terraform",
    "Site Reliability Engineering",
    "SRE",
    "CI/CD Pipelines",
    "Datadog",
    "Dynatrace",
  ],
  SOCIAL_LINKS: [
    "https://www.linkedin.com/in/sachin-shakya0782",
    "https://github.com/sachin-shakya",
  ] as const,
  JSON_LD_SCRIPT_ID: "schema-org-jsonld",
} as const;
