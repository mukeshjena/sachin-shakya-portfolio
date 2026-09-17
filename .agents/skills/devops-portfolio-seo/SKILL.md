---
name: devops-portfolio-seo
description: >-
  Technical SEO, Schema.org JSON-LD structured data, OpenGraph, dynamic sitemap, and Core Web Vitals optimization for Sachin Shakya Cloud/DevOps Portfolio.
  Activate when implementing metadata, pages, routing, sitemaps, robots.txt, social sharing previews, or auditing search performance.
---

# Technical SEO & Schema.org Strategy: Sachin Shakya Portfolio

This skill enforces enterprise-grade search engine optimization, semantic markup, and rich search snippets for Sachin Shakya's Lead Cloud Architect & DevOps Consultant website.

---

## 1. Schema.org JSON-LD Structured Data

Every page must dynamically inject rich Schema.org JSON-LD markup:

### Home Page (`Person` + `ProfilePage`)
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://shakya.mukeshjena.com/#person",
      "name": "Sachin Shakya",
      "jobTitle": "Lead Cloud Architect & DevOps Consultant",
      "url": "https://shakya.mukeshjena.com",
      "sameAs": [
        "https://www.linkedin.com/in/sachin-shakya"
      ],
      "knowsAbout": [
        "Amazon Web Services (AWS)",
        "Microsoft Azure",
        "Google Cloud Platform (GCP)",
        "Kubernetes",
        "Terraform",
        "Cloud Cost Optimization",
        "DevOps & CI/CD Pipelines",
        "Site Reliability Engineering (SRE)"
      ],
      "hasCredential": [
        {
          "@type": "EducationalOccupationalCredential",
          "name": "Microsoft Certified: Azure Administrator Associate (AZ-104)"
        },
        {
          "@type": "EducationalOccupationalCredential",
          "name": "AWS Certified Cloud Practitioner (CLF-C01)"
        },
        {
          "@type": "EducationalOccupationalCredential",
          "name": "ITIL Foundation Certificate in IT Service Management"
        }
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://shakya.mukeshjena.com/#website",
      "url": "https://shakya.mukeshjena.com",
      "name": "Sachin Shakya Portfolio",
      "publisher": { "@id": "https://shakya.mukeshjena.com/#person" }
    }
  ]
}
```

---

## 2. Meta Tags & Social Previews (OpenGraph / Twitter)

Ensure every page emits complete head metadata:
- `<title>`: Descriptive title (`Sachin Shakya — Lead Cloud Architect & DevOps Consultant`)
- `<meta name="description">`: Concise summary highlighting quantifiable impact (`Lead Cloud Architect managing 2,000+ cloud resources with $170K/month verified cost optimization. Expert in AWS, Azure, Kubernetes, and CI/CD.`)
- `<link rel="canonical" href="https://shakya.mukeshjena.com/...">`
- `<meta property="og:type" content="website">`
- `<meta property="og:title" content="...">`
- `<meta property="og:description" content="...">`
- `<meta property="og:image" content="https://shakya.mukeshjena.com/og-image.png">`
- `<meta name="twitter:card" content="summary_large_image">`

---

## 3. Semantic HTML & Accessibility Standards
- **Single `<h1>` per page**: Reserved exclusively for the main page subject.
- **Strict Heading Hierarchy**: Do not skip levels (`h1` → `h2` → `h3`).
- **Semantic Landmarks**: Structure pages with `<header>`, `<nav>`, `<main>`, `<section aria-labelledby="...">`, and `<footer>`.
- **Descriptive Alt Attributes**: All images must contain purposeful `alt` descriptions; decorative graphics must have `aria-hidden="true"`.
- **Unique IDs**: Interactive elements, inputs, and buttons must have unique, descriptive IDs.

---

## 4. Crawlability & Indexing
- `robots.txt` located in `public/robots.txt` allowing root access and pointing to `sitemap.xml`.
- Admin routes (`/admin`, `/admin/*`) must be blocked via `robots.txt` and `<meta name="robots" content="noindex, nofollow">`.
- Dynamic sitemap (`sitemap.xml`) updated whenever new pages are created or published in Firestore.
