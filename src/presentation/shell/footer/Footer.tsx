// presentation/shell/footer/Footer.tsx
// Executive DIIRA-parity footer rendering corporate coordinates, social links, and navigation.
// Adheres strictly to shadow-free surfaces, Cupertino outline icons, and zero emojis.

import type { ComponentType } from "react";
import {
  IoArrowForwardOutline,
  IoCallOutline,
  IoDocumentTextOutline,
  IoGlobeOutline,
  IoLocationOutline,
  IoLogoGithub,
  IoLogoLinkedin,
  IoLogoTwitter,
  IoMailOutline,
  IoPersonOutline,
} from "react-icons/io5";
import type { SocialLink } from "../../../domain/entities/admin/SiteSettings";
import { FOOTER_COPY, FOOTER_STACK_ITEMS } from "./constants/footer.constants";
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
  const {
    currentYear,
    fullName,
    headline,
    email,
    location,
    logoUrl,
    resumePdfUrl,
    socialLinks,
    navItems,
  } = useFooterLogic();

  return (
    <footer className="w-full bg-[var(--ink-900)] border-t border-[var(--line)] text-[var(--paper)]">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-28 md:pb-16 space-y-12">
        {/* 4-Column Responsive Grid (DIIRA Reference Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Identity & Corporate Coordinates */}
          <div className="space-y-4">
            <a href="#top" className="inline-flex items-center gap-3 select-none">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={`${fullName} emblem`}
                  className="w-10 h-10 rounded-xl object-cover border border-[var(--line)] bg-[var(--ink-800)]"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-[var(--ink-800)] border border-[var(--line)] flex items-center justify-center text-[var(--amber)] font-mono font-bold text-sm">
                  SS
                </div>
              )}
              <div>
                <h3 className="text-base font-bold tracking-tight text-[var(--paper)] uppercase leading-none">
                  {fullName}
                </h3>
                <p className="text-[10px] font-mono tracking-widest text-[var(--mist-dim)] uppercase mt-1">
                  {headline}
                </p>
              </div>
            </a>

            <p className="text-xs text-[var(--mist)] leading-relaxed">
              {FOOTER_COPY.summaryDescription}
            </p>

            {/* Coordinates */}
            <div className="flex flex-col gap-2 text-xs font-mono text-[var(--mist)] pt-1">
              <div className="flex items-center gap-2.5">
                <IoLocationOutline
                  className="w-4 h-4 text-[var(--cyan)] shrink-0"
                  aria-hidden="true"
                />
                <span className="truncate">{location}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <IoMailOutline
                  className="w-4 h-4 text-[var(--amber)] shrink-0"
                  aria-hidden="true"
                />
                <a
                  href={`mailto:${email}`}
                  className="hover:text-[var(--paper)] transition-colors truncate"
                >
                  {email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <IoCallOutline className="w-4 h-4 text-[var(--live)] shrink-0" aria-hidden="true" />
                <a href="tel:+919953060735" className="hover:text-[var(--paper)] transition-colors">
                  +91 99530 60735
                </a>
              </div>
            </div>

            {/* Social Channels (DIIRA-style outline buttons) */}
            <div className="flex items-center gap-2 pt-2">
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
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--mist)] hover:text-[var(--paper)] border border-[var(--line)] bg-[var(--ink-850)] hover:border-[var(--amber)] transition-colors cursor-pointer"
                    >
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </a>
                  );
                })}
            </div>
          </div>

          {/* Column 2: Navigation Directory */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--mist-dim)] font-semibold pb-2 border-b border-[var(--line-soft)]">
              {FOOTER_COPY.navHeading}
            </h4>
            <ul className="space-y-2.5">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className="group text-xs text-[var(--mist)] hover:text-[var(--paper)] transition-colors inline-flex items-center gap-2 cursor-pointer font-mono"
                  >
                    <span className="text-[var(--mist-dim)] group-hover:text-[var(--cyan)] group-hover:translate-x-0.5 transition-all text-[10px]">
                      &rarr;
                    </span>
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Core Multi-Cloud Infrastructure */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--mist-dim)] font-semibold pb-2 border-b border-[var(--line-soft)]">
              {FOOTER_COPY.stackHeading}
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_STACK_ITEMS.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-xs font-mono text-[var(--mist)]"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)]/60 shrink-0"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Direct Engagement & Access */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--mist-dim)] font-semibold pb-2 border-b border-[var(--line-soft)]">
              {FOOTER_COPY.connectHeading}
            </h4>

            <div className="space-y-3">
              <a
                href="#contact"
                className="w-full py-2.5 px-4 rounded-xl bg-[var(--amber)] text-black text-xs font-semibold uppercase tracking-wider hover:bg-[var(--amber-deep)] active:translate-y-px transition-all flex items-center justify-between cursor-pointer select-none"
              >
                <span>Schedule Review</span>
                <IoArrowForwardOutline className="w-4 h-4 text-black" aria-hidden="true" />
              </a>

              {resumePdfUrl && (
                <a
                  href={resumePdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-[var(--ink-800)] border border-[var(--line)] hover:border-[var(--cyan)] text-[var(--paper)] text-xs font-mono font-medium flex items-center justify-between transition-colors cursor-pointer select-none"
                >
                  <span className="flex items-center gap-2">
                    <IoDocumentTextOutline
                      className="w-4 h-4 text-[var(--cyan)]"
                      aria-hidden="true"
                    />
                    <span>Download CV</span>
                  </span>
                  <span className="text-[10px] text-[var(--mist-dim)] font-mono uppercase">
                    PDF
                  </span>
                </a>
              )}

              <a
                href="/admin"
                className="w-full py-2.5 px-4 rounded-xl bg-[var(--ink-850)] border border-[var(--line-soft)] hover:border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)] text-xs font-mono flex items-center gap-2 transition-colors cursor-pointer select-none"
              >
                <IoPersonOutline className="w-4 h-4 text-[var(--mist-dim)]" aria-hidden="true" />
                <span>Admin Console</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Hairline Divider & Copyright Line */}
        <div className="pt-8 border-t border-[var(--line-soft)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--mist-dim)] select-none">
          <div>
            &copy; <span className="tabular-nums">{currentYear}</span> {fullName}. All rights
            reserved.
          </div>
          <div className="text-[10px] tracking-wider uppercase text-[var(--mist-dim)]">
            AI-Native Enterprise Architecture
          </div>
        </div>
      </div>
    </footer>
  );
}
