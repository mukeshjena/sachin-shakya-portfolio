// presentation/coming-soon/ComingSoon.tsx
// Static coming-soon placeholder — no Firebase dependency.
// No logic in this file (agent rule #3) — logic lives in ComingSoon.hooks.ts.
// No inline styles, no <style> tags, no hardcoded CSS strings (agent rule #13).
// All styles are in ComingSoon.css (co-located).

import "./ComingSoon.css";
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
    </div>
  );
}
