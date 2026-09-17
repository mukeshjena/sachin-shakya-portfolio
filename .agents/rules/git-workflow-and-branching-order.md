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

### Step 2: Implement & Validate Locally
Implement the step according to the approved plan. Adhere to:
- Max 500 lines per file
- Max 3 files per folder
- Universal Separation of Concerns (Rule 13)
- No hardcoded styles, strings, or numbers in `.tsx`

### Step 3: Automated Single Pre-Commit Gate
When you commit, `.githooks/pre-commit` automatically runs:
1. **Biome check:** `npx biome check .` (lint + format check)
2. **TypeScript:** `npx tsc -b` (strict typecheck)
3. **Vite build:** `npx vite build --logLevel silent` (production build verification)

> **STRICT RULE: Banning `--no-verify` (Rule 15)**
> Using `--no-verify` (or `-n`) with `git commit` is **STRICTLY PROHIBITED**.
> If any check fails, immediately diagnose and fix the root cause. Never bypass the hook.

### Step 4: Rapid Git Push
Push the feature branch to origin:
```bash
git push origin step/NN-<short-name>
```
*(Pre-push checks are eliminated to ensure instant, responsive push operations).*

### Step 5: Sequential Branch Merges
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

### Step 6: Verify CI/CD & Pause
1. Verify the GitHub Actions atomic deployment pipeline is green (`gh run watch`).
2. Update the Status Ledger in `doc/SACHIN-SHAKYA-SITE-IMPLEMENTATION-PLAN.md` to `Completed ✅`.
3. Append a dated entry to `.agent/memory.md`.
4. **MANDATORY STOP:** Report a concise summary to the user. **DO NOT proceed to the next step until the user explicitly types `continue`.**
