// presentation/coming-soon/ComingSoon.tsx
// Static coming-soon placeholder — pure declarative presentation layer.
// RULE 3: Zero computation or state logic in .tsx — lives in .hooks.ts / .utils.ts.
// RULE 7 & 13: Zero hardcoded strings, numbers, or constants — lives in .constants.ts.
// RULE 13 & 14: Zero inline styles or CSS strings — lives in ComingSoon.css with token variables.

import React from "react";
import "./ComingSoon.css";
import { useComingSoon } from "./ComingSoon.hooks";
import { COMING_SOON_CONTENT } from "./constants/ComingSoon.constants";

export function ComingSoon() {
  const { timeLeft } = useComingSoon();
  const {
    statusBadge,
    eyebrow,
    name,
    taglinePart1,
    taglinePart2,
    countdownAriaLabel,
    statsAriaLabel,
    socialNavAriaLabel,
    stats,
    socialLinks,
    footer,
  } = COMING_SOON_CONTENT;

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
          <span>{statusBadge}</span>
        </div>

        {/* Headline */}
        <header className="coming-soon-header">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="name">{name}</h1>
          <p className="tagline">
            {taglinePart1}
            <br className="desktop-only" />
            <span>{taglinePart2}</span>
          </p>
        </header>

        {/* Countdown */}
        <section className="countdown-grid" aria-label={countdownAriaLabel}>
          {timeLeft.map(({ label, value }) => (
            <div key={label} className="countdown-cell">
              <span className="countdown-value">{value}</span>
              <span className="countdown-label">{label}</span>
            </div>
          ))}
        </section>

        {/* Impact stats strip */}
        <section className="stats-strip" aria-label={statsAriaLabel}>
          {stats.map(({ value, unit }, index) => (
            <React.Fragment key={unit}>
              {index > 0 && <div className="stat-divider" aria-hidden="true" />}
              <div className="stat">
                <span className="stat-value">{value}</span>
                <span className="stat-unit">{unit}</span>
              </div>
            </React.Fragment>
          ))}
        </section>

        {/* Social + contact links */}
        <nav className="social-nav" aria-label={socialNavAriaLabel}>
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
        <span>{footer.author}</span>
        <span className="footer-sep" aria-hidden="true" />
        <span>{footer.location}</span>
      </footer>
    </div>
  );
}
