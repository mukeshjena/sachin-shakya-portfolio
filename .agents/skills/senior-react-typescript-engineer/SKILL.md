---
name: senior-react-typescript-engineer
description: >-
  Clean Architecture, Dependency Injection container, strict TypeScript, and Universal Separation of Concerns (Rule 13) for Sachin Shakya Portfolio.
  Activate when designing entities, use-cases, repositories, DI container tokens, custom hooks, or refactoring React components.
---

# Senior React & TypeScript Architecture Skill

This skill enforces strict Clean Architecture layer separation, Dependency Injection container patterns, and the Universal Separation of Concerns across all frontend code.

---

## 1. Clean Architecture Layer Flow
```
presentation/  →  application/  →  domain/  ←  infrastructure/
```
- **`domain/`**: Pure business invariants, repository interfaces (`IPageRepository`), entities (`Page`). Never imports React or Firebase.
- **`application/`**: Use-cases (`GetPublishedPagesUseCase`). Orchestrates domain repositories.
- **`infrastructure/`**: Concrete implementations (`FirestorePageRepository`). Registered in `src/infrastructure/di/container.ts`.
- **`presentation/`**: Components and hooks. Resolves dependencies ONLY via `useContainer()`.

---

## 2. Universal Separation of Concerns (Rule 13)

| Target File | Contents |
|---|---|
| `ComponentName.tsx` | Pure declarative JSX markup. Zero logic, zero calculations, zero raw text copy. |
| `ComponentName.hooks.ts` | React state, effects, hooks orchestration. Wires container use-cases and pure utils. |
| `ComponentName.utils.ts` | Pure deterministic functions (math, formatting, sorting). Zero React hooks or JSX. |
| `ComponentName.constants.ts` | Headings, badge copy, aria labels, metrics, URLs, timeouts, date thresholds. |
| `ComponentName.css` | Styling using CSS custom properties (`var(--token)`). Zero hardcoded hex colors. |
| `ComponentName.data.ts` | Static fallback data, nav schemas, initial seed items. |

---

## 3. Strict Size Caps
- **Max 500 lines per file** (target 200–400 LOC).
- **Max 3 files per folder** (split into subfolders beyond 3).
