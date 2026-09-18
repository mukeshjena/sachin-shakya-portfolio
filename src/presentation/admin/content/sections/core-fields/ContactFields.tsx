// presentation/admin/content/sections/core-fields/ContactFields.tsx
// Pure declarative sub-editor for direct contact channels and identity.
// Strictly adheres to shadow-free surfaces, token colors, and zero emojis (Rule 13).

import {
  IoCallOutline,
  IoDocumentTextOutline,
  IoImageOutline,
  IoLocationOutline,
  IoLogoLinkedin,
  IoMailOutline,
  IoPersonOutline,
} from "react-icons/io5";
import type { SectionEditorFormData } from "../SectionEditorModal.types";

interface ContactFieldsProps {
  readonly formData: SectionEditorFormData;
  readonly onChange: (field: keyof SectionEditorFormData, value: unknown) => void;
}

export function ContactFields({ formData, onChange }: ContactFieldsProps) {
  return (
    <div className="p-4 rounded-xl bg-[var(--ink-800)] border border-[var(--line)] space-y-4">
      <span className="text-xs font-mono uppercase tracking-wider text-[var(--cyan)] font-semibold block">
        Direct Contact Channels & Identity
      </span>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="contact-fullname"
            className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)] mb-1"
          >
            Full Name
          </label>
          <div className="relative">
            <input
              id="contact-fullname"
              type="text"
              value={formData.fullName || ""}
              onChange={(e) => onChange("fullName", e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[var(--ink-850)] text-xs font-mono text-[var(--paper)] border border-[var(--line)] outline-none focus:border-[var(--amber)]"
            />
            <IoPersonOutline className="w-4 h-4 text-[var(--mist-dim)] absolute left-3 top-2.5" />
          </div>
        </div>

        <div>
          <label
            htmlFor="contact-role"
            className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)] mb-1"
          >
            Professional Role
          </label>
          <input
            id="contact-role"
            type="text"
            value={formData.role || ""}
            onChange={(e) => onChange("role", e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-[var(--ink-850)] text-xs font-mono text-[var(--paper)] border border-[var(--line)] outline-none focus:border-[var(--amber)]"
          />
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)] mb-1"
          >
            Contact Email
          </label>
          <div className="relative">
            <input
              id="contact-email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => onChange("email", e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[var(--ink-850)] text-xs font-mono text-[var(--paper)] border border-[var(--line)] outline-none focus:border-[var(--amber)]"
            />
            <IoMailOutline className="w-4 h-4 text-[var(--mist-dim)] absolute left-3 top-2.5" />
          </div>
        </div>

        <div>
          <label
            htmlFor="contact-phone"
            className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)] mb-1"
          >
            Direct Phone / WhatsApp
          </label>
          <div className="relative">
            <input
              id="contact-phone"
              type="text"
              value={formData.phone || ""}
              onChange={(e) => onChange("phone", e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[var(--ink-850)] text-xs font-mono text-[var(--paper)] border border-[var(--line)] outline-none focus:border-[var(--amber)]"
            />
            <IoCallOutline className="w-4 h-4 text-[var(--mist-dim)] absolute left-3 top-2.5" />
          </div>
        </div>

        <div>
          <label
            htmlFor="contact-linkedin"
            className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)] mb-1"
          >
            LinkedIn Profile URL
          </label>
          <div className="relative">
            <input
              id="contact-linkedin"
              type="url"
              value={formData.linkedinUrl || ""}
              onChange={(e) => onChange("linkedinUrl", e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[var(--ink-850)] text-xs font-mono text-[var(--cyan)] border border-[var(--line)] outline-none focus:border-[var(--amber)]"
            />
            <IoLogoLinkedin className="w-4 h-4 text-[var(--mist-dim)] absolute left-3 top-2.5" />
          </div>
        </div>

        <div>
          <label
            htmlFor="contact-location"
            className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)] mb-1"
          >
            Location Map URL
          </label>
          <div className="relative">
            <input
              id="contact-location"
              type="text"
              value={formData.locationUrl || ""}
              onChange={(e) => onChange("locationUrl", e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[var(--ink-850)] text-xs font-mono text-[var(--paper)] border border-[var(--line)] outline-none focus:border-[var(--amber)]"
            />
            <IoLocationOutline className="w-4 h-4 text-[var(--mist-dim)] absolute left-3 top-2.5" />
          </div>
        </div>

        <div>
          <label
            htmlFor="contact-resume"
            className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)] mb-1"
          >
            CV / Résumé PDF URL
          </label>
          <div className="relative">
            <input
              id="contact-resume"
              type="text"
              value={formData.resumePdfUrl || ""}
              onChange={(e) => onChange("resumePdfUrl", e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[var(--ink-850)] text-xs font-mono text-[var(--paper)] border border-[var(--line)] outline-none focus:border-[var(--amber)]"
            />
            <IoDocumentTextOutline className="w-4 h-4 text-[var(--mist-dim)] absolute left-3 top-2.5" />
          </div>
        </div>

        <div>
          <label
            htmlFor="contact-photo"
            className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)] mb-1"
          >
            Portrait Card Photo URL
          </label>
          <div className="flex items-center gap-2">
            {formData.photoUrl && (
              <img
                src={formData.photoUrl}
                alt="Portrait preview"
                className="w-8 h-8 rounded-lg object-cover border border-[var(--line)] bg-[var(--ink-900)] shrink-0"
              />
            )}
            <div className="relative flex-1">
              <input
                id="contact-photo"
                type="text"
                value={formData.photoUrl || ""}
                onChange={(e) => onChange("photoUrl", e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[var(--ink-850)] text-xs font-mono text-[var(--paper)] border border-[var(--line)] outline-none focus:border-[var(--amber)]"
              />
              <IoImageOutline className="w-4 h-4 text-[var(--mist-dim)] absolute left-3 top-2.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
