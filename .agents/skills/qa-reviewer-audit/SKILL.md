---
name: qa-reviewer-audit
description: >-
  Systematic quality assurance, pre-commit validation gates, accessibility auditing (WCAG AA), and bundle budget verification for Sachin Shakya Portfolio.
  Activate when validating code quality, reviewing pull requests, running accessibility checks, or auditing production bundles.
---

# QA Reviewer & Quality Auditor Skill

This skill governs all quality gates, automated testing, accessibility audits, and compliance reviews across the codebase.

---

## 1. Automated Pre-Commit Gate
- Executed on every `git commit` via `.githooks/pre-commit`:
  1. `npx biome check .` — Lints, formats, and sorts imports.
  2. `npx tsc -b` — Strict TypeScript typecheck across all project references.
  3. `npx vite build --logLevel silent` — Validates production bundling without errors.
- **Strict Prohibition of `--no-verify` (Rule 15):** Bypassing hooks is forbidden under all circumstances.

---

## 2. Accessibility Compliance (WCAG AA)
- All interactive controls have distinct accessible names (`aria-label` or visible text).
- Color contrast meets or exceeds `4.5:1` for normal text and `3:1` for large display text.
- Full keyboard navigability (visible focus indicators without drop shadows).
- Decorative imagery marked with `aria-hidden="true"`.

---

## 3. Bundle Budgets & Performance
- Bundle size threshold:
  - Primary index chunk: < 1000 KB
  - Total JavaScript: < 3000 KB
- Lighthouse performance score target: ≥ 90.
