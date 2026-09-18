// infrastructure/seo/JsonLdGenerator.ts
// Generates rich Schema.org JSON-LD graph objects for search engines.
// Clean Architecture: pure TypeScript with zero UI framework dependencies.

export interface PersonSchemaOptions {
  readonly siteUrl?: string;
  readonly name?: string;
  readonly jobTitle?: string;
  readonly socialLinks?: readonly string[];
}

export interface BreadcrumbItem {
  readonly name: string;
  readonly path: string;
}

/**
 * Generates Schema.org Person, WebSite, and ProfilePage graph for Sachin Shakya.
 */
export function generatePersonGraph(options?: PersonSchemaOptions): object {
  const baseUrl = (options?.siteUrl || "https://shakya.mukeshjena.com").replace(/\/+$/, "");
  const name = options?.name || "Sachin Shakya";
  const jobTitle = options?.jobTitle || "Lead Cloud Architect & DevOps Consultant";
  const socialLinks = options?.socialLinks || [
    "https://www.linkedin.com/in/sachin-shakya",
    "https://github.com/sachin-shakya",
  ];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${baseUrl}/#person`,
        name,
        jobTitle,
        description:
          "Lead Cloud Architect managing 2,000+ multi-cloud resources with $170K/month verified cost optimization. Expert in AWS, Microsoft Azure, Kubernetes, Terraform, and Site Reliability Engineering.",
        url: baseUrl,
        image: `${baseUrl}/og-image.png`,
        sameAs: [...socialLinks],
        knowsAbout: [
          "Amazon Web Services (AWS)",
          "Microsoft Azure",
          "Google Cloud Platform (GCP)",
          "Kubernetes",
          "Terraform",
          "Cloud Cost Optimization (FinOps)",
          "Site Reliability Engineering (SRE)",
          "CI/CD Automation",
          "Datadog & Dynatrace Telemetry",
        ],
        hasCredential: [
          {
            "@type": "EducationalOccupationalCredential",
            name: "Microsoft Certified: Azure Administrator Associate (AZ-104)",
          },
          {
            "@type": "EducationalOccupationalCredential",
            name: "AWS Certified Cloud Practitioner (CLF-C01)",
          },
          {
            "@type": "EducationalOccupationalCredential",
            name: "ITIL Foundation Certificate in IT Service Management",
          },
          {
            "@type": "EducationalOccupationalCredential",
            name: "Microsoft Certified: Azure Data Fundamentals (DP-900)",
          },
          {
            "@type": "EducationalOccupationalCredential",
            name: "Microsoft Certified: Security, Compliance, and Identity Fundamentals (SC-900)",
          },
        ],
        worksFor: [
          {
            "@type": "Organization",
            name: "Eptura",
          },
          {
            "@type": "Organization",
            name: "Downer",
          },
          {
            "@type": "Organization",
            name: "LTIMindtree",
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: `${name} — Executive Portfolio & Telemetry`,
        description:
          "Executive portfolio, telemetry benchmarks, and cloud architecture capabilities of Sachin Shakya.",
        publisher: {
          "@id": `${baseUrl}/#person`,
        },
      },
      {
        "@type": "ProfilePage",
        "@id": `${baseUrl}/#profilepage`,
        url: baseUrl,
        name: `${name} — Professional Profile`,
        mainEntity: {
          "@id": `${baseUrl}/#person`,
        },
      },
    ],
  };
}

/**
 * Generates Schema.org BreadcrumbList for subpages and dynamic routes.
 */
export function generateBreadcrumbList(
  items: readonly BreadcrumbItem[],
  siteUrl = "https://shakya.mukeshjena.com"
): object {
  const baseUrl = siteUrl.replace(/\/+$/, "");

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}/${item.path.replace(/^\/+/, "")}`,
    })),
  };
}

export const JsonLdGenerator = {
  generatePersonGraph,
  generateBreadcrumbList,
};
