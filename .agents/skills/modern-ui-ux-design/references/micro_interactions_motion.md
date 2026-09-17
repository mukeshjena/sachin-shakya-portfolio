# Micro-Interactions & Motion: Performance & Subtlety

Motion principles for UI animations and Three.js background rendering.

---

## 1. Zero Hover Zoom Principle
- Never use `scale()` transformations on cards or images.
- Unwanted: `hover:scale-105` causes jitter, sub-pixel blur, and breaks hairline border rendering.
- Allowed:
  - Color transitions: `transition-colors duration-200`
  - Subtle directional icon translation: `group-hover:translate-x-1`
  - Border illumination: `border-[var(--line)]` to `border-[var(--amber)]`

---

## 2. Framer Motion for UI Transitions
- Entrances: `opacity: [0, 1]`, `y: [12, 0]` with `duration: 0.35`, `ease: [0.16, 1, 0.3, 1]` (custom cubic bezier for snappy response).
- Tab selection: `layoutId` on pill background for seamless spring transition across buttons.
- Page transitions: AnimatePresence with clean opacity fade.

---

## 3. Three.js Background Constraints
- Hero background only (Blackhole gravitational lensing simulation).
- Low polygon/particle budget (< 15,000 particles) tuned for mobile WebGL performance.
- IntersectionObserver to pause the render loop whenever the hero section is out of the viewport.
- Respect `prefers-reduced-motion`: disable particle movement and render static constellation gradient fallback.
