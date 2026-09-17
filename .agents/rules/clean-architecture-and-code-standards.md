---
trigger: always_on
description: Mandatory Clean Architecture, Dependency Injection, and Universal Separation of Concerns rules for Sachin Shakya Portfolio.
---

# Clean Architecture & Code Quality Standards

Every file, module, and component in this repository must strictly adhere to Clean Architecture boundaries, Dependency Injection, and Universal Separation of Concerns.

---

## 1. Clean Architecture Layer Isolation

The system enforces strict unidirectional dependency flow:
```
presentation/  →  application/  →  domain/  ←  infrastructure/
```

| Layer | Allowed Imports | Forbidden Imports | Responsibilities |
|---|---|---|---|
| **`domain/`** | None (pure TypeScript) | React, Firebase, Cloudinary, presentation, infrastructure | Entities, value objects, repository interfaces, business invariants. |
| **`application/`** | `domain/` | React, Firebase, Cloudinary, presentation, infrastructure | Use-cases, DTOs, application orchestration. |
| **`infrastructure/`** | `domain/`, external SDKs (Firebase, Cloudinary) | `presentation/` | Concrete repository implementations, external API clients, DI container registration. |
| **`presentation/`** | `domain/`, `application/`, DI hook (`useContainer`) | Direct `firebase/*`, `cloudinary`, `infrastructure/*` concrete repositories | View templates (`.tsx`), component hooks (`.hooks.ts`), styles (`.css`), UI state. |

---

## 2. Dependency Injection Container

- All services, repositories, and use-cases register in `src/infrastructure/di/container.ts`.
- Presentation components resolve dependencies exclusively via the `useContainer()` hook.
- **NEVER** write `import { db } from '../../infrastructure/firebase/firebaseClient'` inside a presentation component. Always resolve:
  ```typescript
  const { pageRepository } = useContainer();
  ```

---

## 3. Universal Separation of Concerns (Rule 13)

Nothing hardcoded in `.tsx` or `.hooks.ts`. Every component follows this strict file breakdown:

| File Pattern | Allowed Content | Strictly Forbidden |
|---|---|---|
| **`ComponentName.tsx`** | Pure declarative JSX markup, binding props, accessible HTML elements. | State calculations, math, inline styling (`style={{}}`), hardcoded text copy, magic numbers, raw URLs. |
| **`ComponentName.hooks.ts`** | `useState`, `useEffect`, `useCallback`, `useMemo`, calling container use-cases and pure utils. | Complex calculation math, hardcoded strings/copy, inline CSS classes, JSX markup. |
| **`ComponentName.utils.ts`** | Pure deterministic functions (date formatting, countdown calculation, string normalization, array sorting). | React hooks, JSX, DOM manipulation, side-effects. |
| **`ComponentName.constants.ts`** | Copy text, headings, badges, metrics, timeouts, external URLs, date thresholds. | Business logic, state variables, JSX markup. |
| **`ComponentName.css`** | Co-located styling using CSS custom properties (`var(--token)`). | Hardcoded hex/rgb values, `box-shadow`, inline `<style>` tags. |
| **`ComponentName.data.ts`** | Static seed data, fallback navigation items, schema templates. | Active state, side-effects, component markup. |

---

## 4. File and Folder Size Constraints

1. **Maximum 500 lines per file (Target 200–400 LOC):**
   - If a file approaches 400 lines, immediately extract helper functions to `.utils.ts` or sub-components.
2. **Maximum 3 files per folder:**
   - Any folder that would contain a 4th file MUST be split into logical subfolders.
   - Example: `src/presentation/coming-soon/` contains `ComingSoon.tsx`, `ComingSoon.hooks.ts`, `ComingSoon.css`. Its constants and utils are placed into `constants/` and `utils/` subfolders respectively.

---

## 5. TypeScript Strict Mode & Safety

- `strict: true` in `tsconfig.json` is non-negotiable.
- `any` is strictly prohibited. Use proper generics, unions, or `unknown` with type narrowing.
- Avoid non-null assertion operator (`!`) unless accompanied by an explicit `// safe: <reason>` comment.
- Prefer `readonly` for immutable domain entities and configuration objects.
