// presentation/admin/content/sections/fields/CredentialsFields.tsx
// Pure declarative sub-editor for certifications, education, and awards.
// Strictly adheres to shadow-free surfaces, token colors, and zero emojis (Rule 13).

import { useState } from "react";
import {
  IoAddOutline,
  IoMedalOutline,
  IoRibbonOutline,
  IoSchoolOutline,
  IoTrashOutline,
} from "react-icons/io5";
import type {
  AwardItem,
  CertificationItem,
  EducationItem,
} from "../../../../sections/credentials/constants/credentials.constants";

interface CredentialsFieldsProps {
  readonly certifications: readonly CertificationItem[];
  readonly education: readonly EducationItem[];
  readonly awards: readonly AwardItem[];
  readonly onChangeCertifications: (certs: readonly CertificationItem[]) => void;
  readonly onChangeEducation: (edu: readonly EducationItem[]) => void;
  readonly onChangeAwards: (awards: readonly AwardItem[]) => void;
}

export function CredentialsFields({
  certifications,
  education,
  awards,
  onChangeCertifications,
  onChangeEducation,
  onChangeAwards,
}: CredentialsFieldsProps) {
  const [activeTab, setActiveTab] = useState<"certs" | "edu" | "awards">("certs");

  const handleAddCert = () => {
    const newCert: CertificationItem = {
      code: "NEW-CERT",
      title: "New Cloud Certification",
      issuer: "Amazon Web Services / Microsoft",
      year: new Date().getFullYear().toString(),
      badgeColor: "var(--amber)",
    };
    onChangeCertifications([newCert, ...certifications]);
  };

  const handleUpdateCert = (index: number, updated: Partial<CertificationItem>) => {
    const next = [...certifications];
    next[index] = { ...next[index], ...updated };
    onChangeCertifications(next);
  };

  const handleRemoveCert = (index: number) => {
    onChangeCertifications(certifications.filter((_, i) => i !== index));
  };

  const handleAddEdu = () => {
    const newEdu: EducationItem = {
      degree: "Master / Bachelor Degree",
      field: "Computer Science & Engineering",
      institution: "University / Institute Name",
      period: "2018 — 2022",
    };
    onChangeEducation([newEdu, ...education]);
  };

  const handleUpdateEdu = (index: number, updated: Partial<EducationItem>) => {
    const next = [...education];
    next[index] = { ...next[index], ...updated };
    onChangeEducation(next);
  };

  const handleRemoveEdu = (index: number) => {
    onChangeEducation(education.filter((_, i) => i !== index));
  };

  const handleAddAward = () => {
    const newAward: AwardItem = {
      title: "Excellence in Cloud Delivery",
      organization: "Enterprise Organization",
      year: new Date().getFullYear().toString(),
      description: "Recognized for exemplary automation delivery and cost optimization.",
    };
    onChangeAwards([newAward, ...awards]);
  };

  const handleUpdateAward = (index: number, updated: Partial<AwardItem>) => {
    const next = [...awards];
    next[index] = { ...next[index], ...updated };
    onChangeAwards(next);
  };

  const handleRemoveAward = (index: number) => {
    onChangeAwards(awards.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4 p-4 rounded-xl bg-[var(--ink-800)] border border-[var(--line)]">
      {/* Sub-tab Navigation */}
      <div className="flex items-center justify-between border-b border-[var(--line-soft)] pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("certs")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "certs"
                ? "bg-[var(--ink-700)] text-[var(--amber)] font-semibold border border-[var(--line)]"
                : "text-[var(--mist)] hover:text-[var(--paper)]"
            }`}
          >
            <IoRibbonOutline className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Certifications ({certifications.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("edu")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "edu"
                ? "bg-[var(--ink-700)] text-[var(--cyan)] font-semibold border border-[var(--line)]"
                : "text-[var(--mist)] hover:text-[var(--paper)]"
            }`}
          >
            <IoSchoolOutline className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Education ({education.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("awards")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "awards"
                ? "bg-[var(--ink-700)] text-[var(--live)] font-semibold border border-[var(--line)]"
                : "text-[var(--mist)] hover:text-[var(--paper)]"
            }`}
          >
            <IoMedalOutline className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Awards ({awards.length})</span>
          </button>
        </div>

        {activeTab === "certs" && (
          <button
            type="button"
            onClick={handleAddCert}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--ink-700)] text-[var(--amber)] text-xs font-mono border border-[var(--line)] cursor-pointer"
          >
            <IoAddOutline className="w-3.5 h-3.5" />
            <span>Add Cert</span>
          </button>
        )}

        {activeTab === "edu" && (
          <button
            type="button"
            onClick={handleAddEdu}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--ink-700)] text-[var(--cyan)] text-xs font-mono border border-[var(--line)] cursor-pointer"
          >
            <IoAddOutline className="w-3.5 h-3.5" />
            <span>Add Degree</span>
          </button>
        )}

        {activeTab === "awards" && (
          <button
            type="button"
            onClick={handleAddAward}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--ink-700)] text-[var(--live)] text-xs font-mono border border-[var(--line)] cursor-pointer"
          >
            <IoAddOutline className="w-3.5 h-3.5" />
            <span>Add Award</span>
          </button>
        )}
      </div>

      {/* Certifications Tab */}
      {activeTab === "certs" && (
        <div className="space-y-3">
          {certifications.map((c, idx) => (
            <div
              key={c.code || idx}
              className="p-3 rounded-lg bg-[var(--ink-850)] border border-[var(--line)] space-y-2"
            >
              <div className="flex items-center justify-between gap-2 border-b border-[var(--line-soft)] pb-1.5">
                <span className="text-[11px] font-mono font-semibold text-[var(--amber)]">
                  {c.code || "CERT"} — {c.title}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveCert(idx)}
                  className="p-1 text-[var(--mist-dim)] hover:text-red-400 cursor-pointer"
                >
                  <IoTrashOutline className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <div>
                  <label
                    htmlFor={`cert-code-${idx}`}
                    className="block text-[10px] font-mono text-[var(--mist-dim)] mb-0.5"
                  >
                    Code
                  </label>
                  <input
                    id={`cert-code-${idx}`}
                    type="text"
                    value={c.code}
                    onChange={(e) => handleUpdateCert(idx, { code: e.target.value })}
                    className="w-full px-2 py-1 rounded bg-[var(--ink-800)] text-xs font-mono text-[var(--paper)] border border-[var(--line)]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor={`cert-title-${idx}`}
                    className="block text-[10px] font-mono text-[var(--mist-dim)] mb-0.5"
                  >
                    Certification Title
                  </label>
                  <input
                    id={`cert-title-${idx}`}
                    type="text"
                    value={c.title}
                    onChange={(e) => handleUpdateCert(idx, { title: e.target.value })}
                    className="w-full px-2 py-1 rounded bg-[var(--ink-800)] text-xs font-mono text-[var(--paper)] border border-[var(--line)]"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`cert-issuer-${idx}`}
                    className="block text-[10px] font-mono text-[var(--mist-dim)] mb-0.5"
                  >
                    Issuer
                  </label>
                  <input
                    id={`cert-issuer-${idx}`}
                    type="text"
                    value={c.issuer}
                    onChange={(e) => handleUpdateCert(idx, { issuer: e.target.value })}
                    className="w-full px-2 py-1 rounded bg-[var(--ink-800)] text-xs font-mono text-[var(--paper)] border border-[var(--line)]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Education Tab */}
      {activeTab === "edu" && (
        <div className="space-y-3">
          {education.map((ed, idx) => (
            <div
              key={ed.degree || idx}
              className="p-3 rounded-lg bg-[var(--ink-850)] border border-[var(--line)] space-y-2"
            >
              <div className="flex items-center justify-between gap-2 border-b border-[var(--line-soft)] pb-1.5">
                <span className="text-[11px] font-mono font-semibold text-[var(--cyan)]">
                  {ed.degree} in {ed.field}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveEdu(idx)}
                  className="p-1 text-[var(--mist-dim)] hover:text-red-400 cursor-pointer"
                >
                  <IoTrashOutline className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label
                    htmlFor={`edu-degree-${idx}`}
                    className="block text-[10px] font-mono text-[var(--mist-dim)] mb-0.5"
                  >
                    Degree
                  </label>
                  <input
                    id={`edu-degree-${idx}`}
                    type="text"
                    value={ed.degree}
                    onChange={(e) => handleUpdateEdu(idx, { degree: e.target.value })}
                    className="w-full px-2 py-1 rounded bg-[var(--ink-800)] text-xs font-mono text-[var(--paper)] border border-[var(--line)]"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`edu-field-${idx}`}
                    className="block text-[10px] font-mono text-[var(--mist-dim)] mb-0.5"
                  >
                    Field of Study
                  </label>
                  <input
                    id={`edu-field-${idx}`}
                    type="text"
                    value={ed.field}
                    onChange={(e) => handleUpdateEdu(idx, { field: e.target.value })}
                    className="w-full px-2 py-1 rounded bg-[var(--ink-800)] text-xs font-mono text-[var(--paper)] border border-[var(--line)]"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`edu-institution-${idx}`}
                    className="block text-[10px] font-mono text-[var(--mist-dim)] mb-0.5"
                  >
                    Institution
                  </label>
                  <input
                    id={`edu-institution-${idx}`}
                    type="text"
                    value={ed.institution}
                    onChange={(e) => handleUpdateEdu(idx, { institution: e.target.value })}
                    className="w-full px-2 py-1 rounded bg-[var(--ink-800)] text-xs font-mono text-[var(--paper)] border border-[var(--line)]"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`edu-period-${idx}`}
                    className="block text-[10px] font-mono text-[var(--mist-dim)] mb-0.5"
                  >
                    Period
                  </label>
                  <input
                    id={`edu-period-${idx}`}
                    type="text"
                    value={ed.period}
                    onChange={(e) => handleUpdateEdu(idx, { period: e.target.value })}
                    className="w-full px-2 py-1 rounded bg-[var(--ink-800)] text-xs font-mono text-[var(--paper)] border border-[var(--line)]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Awards Tab */}
      {activeTab === "awards" && (
        <div className="space-y-3">
          {awards.map((aw, idx) => (
            <div
              key={aw.title || idx}
              className="p-3 rounded-lg bg-[var(--ink-850)] border border-[var(--line)] space-y-2"
            >
              <div className="flex items-center justify-between gap-2 border-b border-[var(--line-soft)] pb-1.5">
                <span className="text-[11px] font-mono font-semibold text-[var(--live)]">
                  {aw.title} ({aw.year})
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveAward(idx)}
                  className="p-1 text-[var(--mist-dim)] hover:text-red-400 cursor-pointer"
                >
                  <IoTrashOutline className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor={`award-title-${idx}`}
                    className="block text-[10px] font-mono text-[var(--mist-dim)] mb-0.5"
                  >
                    Award Title
                  </label>
                  <input
                    id={`award-title-${idx}`}
                    type="text"
                    value={aw.title}
                    onChange={(e) => handleUpdateAward(idx, { title: e.target.value })}
                    className="w-full px-2 py-1 rounded bg-[var(--ink-800)] text-xs font-mono text-[var(--paper)] border border-[var(--line)]"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`award-year-${idx}`}
                    className="block text-[10px] font-mono text-[var(--mist-dim)] mb-0.5"
                  >
                    Year
                  </label>
                  <input
                    id={`award-year-${idx}`}
                    type="text"
                    value={aw.year}
                    onChange={(e) => handleUpdateAward(idx, { year: e.target.value })}
                    className="w-full px-2 py-1 rounded bg-[var(--ink-800)] text-xs font-mono text-[var(--paper)] border border-[var(--line)]"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor={`award-org-${idx}`}
                  className="block text-[10px] font-mono text-[var(--mist-dim)] mb-0.5"
                >
                  Organization
                </label>
                <input
                  id={`award-org-${idx}`}
                  type="text"
                  value={aw.organization}
                  onChange={(e) => handleUpdateAward(idx, { organization: e.target.value })}
                  className="w-full px-2 py-1 rounded bg-[var(--ink-800)] text-xs font-mono text-[var(--paper)] border border-[var(--line)]"
                />
              </div>
              <div>
                <label
                  htmlFor={`award-desc-${idx}`}
                  className="block text-[10px] font-mono text-[var(--mist-dim)] mb-0.5"
                >
                  Description
                </label>
                <input
                  id={`award-desc-${idx}`}
                  type="text"
                  value={aw.description}
                  onChange={(e) => handleUpdateAward(idx, { description: e.target.value })}
                  className="w-full px-2 py-1 rounded bg-[var(--ink-800)] text-xs font-mono text-[var(--mist)] border border-[var(--line)]"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
