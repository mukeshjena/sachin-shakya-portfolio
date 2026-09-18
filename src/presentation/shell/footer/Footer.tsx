// presentation/shell/footer/Footer.tsx
// Universal executive footer rendering dynamic social links, navigation, and telemetry metadata.
// Adheres strictly to shadow-free surfaces, Cupertino outline icons, and zero emojis.

import type { ComponentType } from "react";
import {
  IoDocumentTextOutline,
  IoGlobeOutline,
  IoLocationOutline,
  IoLogoGithub,
  IoLogoLinkedin,
  IoLogoTwitter,
  IoMailOutline,
} from "react-icons/io5";
import type { SocialLink } from "../../../domain/entities/admin/SiteSettings";
import { FOOTER_COPY, FOOTER_TELEMETRY_PILLS } from "./constants/footer.constants";
import { useFooterLogic } from "./Footer.hooks";

function getSocialIcon(
  platform: SocialLink["platform"]
): ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }> {
  switch (platform) {
    case "linkedin":
      return IoLogoLinkedin;
    case "github":
      return IoLogoGithub;
    case "email":
      return IoMailOutline;
    case "twitter":
      return IoLogoTwitter;
    default:
      return IoGlobeOutline;
  }
}

export function Footer() {
  const { currentYear, fullName, headline, email, location, resumePdfUrl, socialLinks, navItems } =
    useFooterLogic();

  return (
    <footer className="w-full bg-[var(--ink-900)] border-t border-[var(--line)] text-[var(--paper)]">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-28 md:pb-16 space-y-12">
        {/* Top Operational Status Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-[var(--line-soft)]">
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[var(--ink-850)] border border-[var(--line)] text-xs font-mono text-[var(--live)] select-none">
            <span className="w-2 h-2 rounded-full bg-[var(--live)]" aria-hidden="true" />
            <span className="font-semibold tracking-wider uppercase">
              {FOOTER_COPY.systemStatus}
            </span>
          </div>
          <div className="text-[11px] font-mono text-[var(--mist-dim)] tracking-wider uppercase flex items-center gap-2 select-none">
            <span className="text-[var(--cyan)] font-semibold">EDGE</span>
            <span>&bull;</span>
            <span>HIGH-PERFORMANCE RUNTIME</span>
            <span>&bull;</span>
            <span>DISTRIBUTED CACHE</span>
          </div>
        </div>

        {/* 4-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Identity & Executive Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 select-none">
              <div className="w-10 h-10 rounded-full bg-[var(--ink-800)] border border-[var(--line)] flex items-center justify-center text-[var(--amber)] font-mono font-bold text-sm">
                SS
              </div>
              <div>
                <h3 className="text-base font-bold tracking-tight text-[var(--paper)] uppercase">
                  {fullName}
                </h3>
                <p className="text-[10px] font-mono tracking-widest text-[var(--mist-dim)] uppercase">
                  {headline}
                </p>
              </div>
            </div>

            <p className="text-xs text-[var(--mist)] leading-relaxed">
              {FOOTER_COPY.summaryDescription}
            </p>

            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[var(--ink-850)] border border-[var(--line-soft)] text-[10px] font-mono text-[var(--live)] select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--live)]" aria-hidden="true" />
              <span>OPEN TO STRATEGIC ADVISORY</span>
            </div>

            <div className="pt-1 space-y-1.5 text-xs font-mono text-[var(--mist)]">
              <div className="flex items-center gap-2">
                <IoLocationOutline className="w-4 h-4 text-[var(--cyan)]" aria-hidden="true" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-2">
                <IoMailOutline className="w-4 h-4 text-[var(--amber)]" aria-hidden="true" />
                <a href={`mailto:${email}`} className="hover:text-[var(--paper)] transition-colors">
                  {email}
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Directory */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-mono uppercase tracking-widest text-[var(--mist-dim)] font-semibold">
              {FOOTER_COPY.navHeading}
            </h4>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className="group text-xs text-[var(--mist)] hover:text-[var(--paper)] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="text-[var(--mist-dim)] group-hover:text-[var(--cyan)] group-hover:translate-x-0.5 transition-all font-mono text-[10px]">
                      &rarr;
                    </span>
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Operational Telemetry Highlights */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-mono uppercase tracking-widest text-[var(--mist-dim)] font-semibold">
              {FOOTER_COPY.telemetryHeading}
            </h4>
            <div className="space-y-2.5">
              {FOOTER_TELEMETRY_PILLS.map((pill) => (
                <div
                  key={pill.label}
                  className="p-2.5 rounded-xl bg-[var(--ink-850)] border border-[var(--line-soft)] hover:border-[var(--line)] transition-colors space-y-0.5 select-none"
                >
                  <span className="text-[10px] font-mono uppercase text-[var(--mist-dim)] block">
                    {pill.label}
                  </span>
                  <span className="text-xs font-mono font-semibold text-[var(--amber)] tabular-nums block">
                    {pill.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Communication Channels & Résumé */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-mono uppercase tracking-widest text-[var(--mist-dim)] font-semibold">
              {FOOTER_COPY.connectHeading}
            </h4>

            <div className="flex flex-wrap gap-2">
              {socialLinks
                .filter((s) => s.isVisible)
                .map((link) => {
                  const Icon = getSocialIcon(link.platform);
                  return (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      title={link.label}
                      className="w-9 h-9 rounded-full bg-[var(--ink-850)] border border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)] hover:border-[var(--cyan)] active:translate-y-px transition-all cursor-pointer flex items-center justify-center"
                    >
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </a>
                  );
                })}
            </div>

            {resumePdfUrl && (
              <div className="pt-2">
                <a
                  href={resumePdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--amber)] text-black text-xs font-semibold hover:bg-[var(--amber-deep)] active:translate-y-px transition-all cursor-pointer select-none"
                >
                  <IoDocumentTextOutline className="w-4 h-4 text-black" aria-hidden="true" />
                  <span>Download CV (PDF)</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Hairline Divider & Copyright Line */}
        <div className="pt-8 border-t border-[var(--line-soft)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--mist-dim)] select-none">
          <div>
            &copy; <span className="tabular-nums">{currentYear}</span> {fullName}. All rights
            reserved.
          </div>
          <div className="text-[10px] tracking-wider uppercase text-[var(--mist-dim)]">
            {"ENTERPRISE ARCHITECTURE // ZERO DROP SHADOWS"}
          </div>
        </div>
      </div>
    </footer>
  );
}
