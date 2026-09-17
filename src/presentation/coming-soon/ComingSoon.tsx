// presentation/coming-soon/ComingSoon.tsx
// Static coming-soon placeholder — no Firebase, no logic in this file.
// Logic (countdown etc.) lives in ComingSoon.hooks.ts per agent rule #3.
// This component will be replaced by the full app shell in Step 14.

import { useComingSoon } from "./ComingSoon.hooks";

export function ComingSoon() {
  const { timeLeft, socialLinks } = useComingSoon();

  return (
    <div className="coming-soon-root">
      {/* Ambient background layers — depth without shadows (agent rule #4) */}
      <div className="aura-top" aria-hidden="true" />
      <div className="aura-bottom" aria-hidden="true" />
      <div className="grid-overlay" aria-hidden="true" />

      <main className="coming-soon-shell">
        {/* Status badge */}
        <div className="status-badge">
          <span className="status-dot" aria-hidden="true" />
          <span>Deploying soon</span>
        </div>

        {/* Headline */}
        <header className="coming-soon-header">
          <p className="eyebrow">CloudOps Technical Lead</p>
          <h1 className="name">Sachin Shakya</h1>
          <p className="tagline">
            AI-native cloud operations. Nine years keeping Azure &amp; AWS platforms
            <br className="desktop-only" />
            <span> fast, observable, and considerably cheaper.</span>
          </p>
        </header>

        {/* Countdown */}
        <section className="countdown-grid" aria-label="Countdown to launch">
          {timeLeft.map(({ label, value }) => (
            <div key={label} className="countdown-cell">
              <span className="countdown-value">{value}</span>
              <span className="countdown-label">{label}</span>
            </div>
          ))}
        </section>

        {/* Impact stats strip */}
        <section className="stats-strip" aria-label="Key achievements">
          <div className="stat">
            <span className="stat-value">$170K</span>
            <span className="stat-unit">/mo saved</span>
          </div>
          <div className="stat-divider" aria-hidden="true" />
          <div className="stat">
            <span className="stat-value">40%</span>
            <span className="stat-unit">MTTR cut</span>
          </div>
          <div className="stat-divider" aria-hidden="true" />
          <div className="stat">
            <span className="stat-value">2000+</span>
            <span className="stat-unit">resources managed</span>
          </div>
        </section>

        {/* Social + contact links */}
        <nav className="social-nav" aria-label="Contact and social links">
          {socialLinks.map(({ href, label, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label={label}
            >
              <span className="social-icon" aria-hidden="true">
                {icon}
              </span>
              <span>{label}</span>
            </a>
          ))}
        </nav>
      </main>

      {/* Footer */}
      <footer className="coming-soon-footer">
        <span>Sachin Shakya</span>
        <span className="footer-sep" aria-hidden="true" />
        <span>Faridabad, India</span>
      </footer>

      {/* Inline styles — using CSS custom properties from index.css, no box-shadow (rule #4) */}
      <style>{COMING_SOON_STYLES}</style>
    </div>
  );
}

const COMING_SOON_STYLES = `
  .coming-soon-root {
    position: relative;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 2rem 1rem;
  }

  /* Ambient depth layers — no box-shadow, depth via gradient */
  .aura-top {
    position: fixed; inset: 0;
    background: radial-gradient(ellipse 80% 60% at 70% 8%, rgba(255,176,32,.10) 0%, transparent 70%);
    pointer-events: none;
    animation: aura-pulse 8s ease-in-out infinite alternate;
  }
  .aura-bottom {
    position: fixed; inset: 0;
    background: radial-gradient(ellipse 60% 50% at 30% 90%, rgba(73,199,232,.07) 0%, transparent 65%);
    pointer-events: none;
  }
  .grid-overlay {
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(130,180,200,.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(130,180,200,.06) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
    mask-image: radial-gradient(ellipse at center, black 20%, transparent 80%);
  }

  @keyframes aura-pulse {
    from { opacity: 0.7; }
    to   { opacity: 1; }
  }

  .coming-soon-shell {
    position: relative;
    width: min(680px, 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2.5rem;
    text-align: center;
    z-index: 1;
  }

  /* Status badge */
  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.35rem 0.9rem;
    border: 1px solid var(--line);
    border-radius: 999px;
    background: rgba(11,29,39,.6);
    backdrop-filter: blur(12px);
    font-family: var(--f-mono);
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    color: var(--mist);
    text-transform: uppercase;
  }
  .status-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--live);
    animation: blink 2s ease-in-out infinite;
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.3; }
  }

  /* Headline */
  .coming-soon-header { display: flex; flex-direction: column; gap: 0.75rem; }
  .eyebrow {
    font-family: var(--f-mono);
    font-size: 0.75rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--cyan);
  }
  .name {
    font-family: var(--f-display);
    font-size: clamp(2.6rem, 6vw, 4.5rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--amber);
    line-height: 1.02;
  }
  .tagline {
    font-size: 1rem;
    color: var(--mist);
    line-height: 1.6;
    max-width: 52ch;
  }
  .desktop-only { display: none; }
  @media (min-width: 640px) { .desktop-only { display: inline; } }

  /* Countdown */
  .countdown-grid {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  .countdown-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    min-width: 72px;
    padding: 1rem 1.25rem;
    border: 1px solid var(--line);
    border-radius: 12px;
    background: rgba(11,29,39,.5);
    backdrop-filter: blur(8px);
  }
  .countdown-value {
    font-family: var(--f-mono);
    font-size: 2rem;
    font-weight: 600;
    color: var(--paper);
    line-height: 1;
    min-width: 2ch;
    text-align: center;
  }
  .countdown-label {
    font-family: var(--f-mono);
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--mist-dim);
  }

  /* Stats strip */
  .stats-strip {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
    justify-content: center;
    padding: 1rem 2rem;
    border: 1px solid var(--line-soft);
    border-radius: 12px;
    background: rgba(6,18,26,.4);
    backdrop-filter: blur(8px);
  }
  .stat { display: flex; align-items: baseline; gap: 0.3rem; }
  .stat-value {
    font-family: var(--f-display);
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--amber);
  }
  .stat-unit {
    font-size: 0.75rem;
    color: var(--mist-dim);
    letter-spacing: 0.03em;
  }
  .stat-divider {
    width: 1px; height: 2rem;
    background: var(--line);
  }

  /* Social nav */
  .social-nav {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  .social-link {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 1rem;
    border: 1px solid var(--line);
    border-radius: 8px;
    background: rgba(11,29,39,.4);
    font-size: 0.82rem;
    color: var(--mist);
    letter-spacing: 0.02em;
    transition: border-color 0.2s, color 0.2s;
  }
  .social-link:hover {
    border-color: var(--amber);
    color: var(--amber);
  }
  .social-icon { font-size: 1rem; line-height: 1; }

  /* Footer */
  .coming-soon-footer {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-top: 3rem;
    font-family: var(--f-mono);
    font-size: 0.7rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--mist-dim);
  }
  .footer-sep {
    width: 1px; height: 0.8rem;
    background: var(--line);
  }

  @media (prefers-reduced-motion: reduce) {
    .aura-top { animation: none; }
    .status-dot { animation: none; }
  }
`;
