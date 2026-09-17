---
trigger: always_on
description: Mandatory Git workflow, branching strategy, quality gates, and prohibition of --no-verify for Sachin Shakya Portfolio.
---

# Git Workflow, Quality Gates & Branch Promotion Protocol

All development work, feature implementations, refactorings, and promotions on this repository must strictly follow this protocol.

---

## 1. Branch Promotion Hierarchy

```
[step/NN-feature-name]  ──(Feature development & tests)──►
          │
          ▼
   [release/v1.0.0]     ──(Staging & Release candidate)──►
          │
          ▼
        [main]          ──(Production & CI/CD auto-deploy)──►
          │
          ▼
      [develop]         ──(Keep development branch in parity)
```

---

## 2. Step-by-Step Execution Lifecycle

### Step 1: Create Step Branch from `main`
```bash
git checkout main
git pull origin main
git checkout -b step/NN-<short-name>
```

### Step 2: Create Implementation Plan Artifact (`implementation_plan.md`)
Before modifying or creating any code for the step, ALWAYS create a structured implementation plan artifact:
- Outline exact files to modify/create across domain, application, infrastructure, presentation, or worker.
- Document design decisions, architectural boundaries, and verification commands.
- Proceed with implementation following the plan.

### Step 3: Implement & Validate Locally
Implement the step according to the approved plan. Adhere to:
- Max 500 lines per file (target 200–400 LOC)
- Max 3 files per folder (split into subfolders beyond 3)
- Universal Separation of Concerns (Rule 13)
- No hardcoded styles, strings, or numbers in `.tsx`
- Bespoke, human-crafted UI/UX (strictly zero AI tropes)

### Step 4: Automated Single Pre-Commit Gate
When you commit, `.githooks/pre-commit` automatically runs:
1. **Biome check:** `npx biome check .` (lint + format check)
2. **TypeScript:** `npx tsc -b` (strict typecheck)
3. **Vite build:** `npx vite build --logLevel silent` (production build verification)

> **STRICT RULE: Banning `--no-verify` (Rule 15)**
> Using `--no-verify` (or `-n`) with `git commit` is **STRICTLY PROHIBITED**.
> If any check fails, immediately diagnose and fix the root cause. Never bypass the hook.

### Step 5: Rapid Git Push
Push the feature branch to origin:
```bash
git push origin step/NN-<short-name>
```
*(Pre-push checks are eliminated to ensure instant, responsive push operations).*

### Step 6: Sequential Branch Merges
Merge into `release/v1.0.0`, then `main`, then sync `develop`:
```bash
git checkout release/v1.0.0
git merge step/NN-<short-name>
git push origin release/v1.0.0

git checkout main
git merge release/v1.0.0
git push origin main

git checkout develop
git merge main
git push origin develop

git checkout main
```

### Step 7: Check Last Workflow Run Status & Mandatory Pause
1. **Never block on `gh run watch`:** Do NOT wait for or watch the deployment pipeline on every push — blocking on workflow completion wastes time.
2. **Check last run status:** Run `gh run list --limit 1` to inspect status. If the prior run experienced an error or failure, diagnose and fix the issue before completing the step.
3. Update the Status Ledger in `doc/SACHIN-SHAKYA-SITE-IMPLEMENTATION-PLAN.md` to `Completed ✅`.
4. Append a dated entry to `.agents/memory.md`.
5. **MANDATORY STOP & PAUSE:** Report a concise delivery summary to the user. **DO NOT proceed to the next step until the user explicitly types `continue`.**
6. **Cycle Repeats:** When the user types `continue`, repeat this exact lifecycle: create the new step branch, generate a new implementation plan, and proceed.
