// presentation/admin/authorization/AuthorizedEmailsManager.tsx
// Whitelisted Administrator Access Control Management Panel.
// Flat instrument styling, 100% shadow-free, and zero emojis.
// All business logic, use-cases, and blur validation live in AuthorizedEmailsManager.hooks.ts (Rule 13).

import {
  IoCheckmarkCircleOutline,
  IoLockClosedOutline,
  IoLockOpenOutline,
  IoPersonAddOutline,
  IoPersonOutline,
  IoShieldCheckmarkOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { ActionsMenu } from "../shared/actions-menu/ActionsMenu";
import { useAuthorizedEmailsManager } from "./AuthorizedEmailsManager.hooks";
import { AUTH_EMAILS_COPY } from "./constants/auth-emails.constants";

export function AuthorizedEmailsManager() {
  const {
    admins,
    isLoading,
    isAdding,
    newEmail,
    inputError,
    feedbackMessage,
    handleNewEmailChange,
    handleNewEmailBlur,
    handleAddEmail,
    handleToggleStatus,
    handleRemoveEmail,
  } = useAuthorizedEmailsManager();

  return (
    <div className="w-full bg-[var(--ink-850)] border border-[var(--line)] rounded-2xl p-6 sm:p-8">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[var(--line)]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[var(--ink-800)] border border-[var(--line)] text-[10px] font-mono uppercase tracking-widest text-[var(--amber)] mb-2">
            <IoShieldCheckmarkOutline
              className="w-3.5 h-3.5 text-[var(--amber)]"
              aria-hidden="true"
            />
            <span>{AUTH_EMAILS_COPY.BADGE}</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-[var(--paper)]">
            {AUTH_EMAILS_COPY.TITLE}
          </h3>
          <p className="mt-1 text-xs text-[var(--mist)] leading-relaxed">
            {AUTH_EMAILS_COPY.SUBTITLE}
          </p>
        </div>

        {/* Whitelist Count Metric */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between px-3 py-2 sm:p-0 bg-[var(--ink-800)] sm:bg-transparent rounded-xl sm:rounded-none border border-[var(--line)] sm:border-0">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--mist-dim)]">
            {AUTH_EMAILS_COPY.WHITELIST_COUNT_LABEL}
          </span>
          <span className="text-lg font-mono font-bold tabular-nums text-[var(--cyan)]">
            {admins.length}
          </span>
        </div>
      </div>

      {/* Feedback Alerts */}
      {feedbackMessage && (
        <div
          className={`mt-6 p-3.5 rounded-xl border text-xs font-mono flex items-center gap-2.5 ${
            feedbackMessage.type === "success"
              ? "bg-[var(--live)]/10 border-[var(--live)]/30 text-[var(--live)]"
              : "bg-red-950/40 border-red-500/30 text-red-300"
          }`}
        >
          <IoCheckmarkCircleOutline className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* Add Administrator Form */}
      <form
        onSubmit={handleAddEmail}
        className="mt-6 p-4 bg-[var(--ink-900)] border border-[var(--line)] rounded-xl"
      >
        <label
          htmlFor="new-admin-email"
          className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)] mb-2"
        >
          {AUTH_EMAILS_COPY.ADD_HEADING}
        </label>
        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className="flex-1">
            <input
              id="new-admin-email"
              type="email"
              required
              value={newEmail}
              onChange={(e) => handleNewEmailChange(e.target.value)}
              onBlur={handleNewEmailBlur}
              placeholder={AUTH_EMAILS_COPY.INPUT_PLACEHOLDER}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-[var(--ink-800)] text-xs font-mono text-[var(--paper)] placeholder-[var(--mist-dim)]/50 border outline-none focus:border-[var(--amber)] transition-colors ${
                inputError ? "border-red-500/50" : "border-[var(--line)]"
              }`}
            />
            {inputError && <p className="mt-1 text-[11px] font-mono text-red-400">{inputError}</p>}
          </div>

          <button
            type="submit"
            disabled={isAdding || !newEmail.trim()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--amber)] hover:bg-[var(--amber-deep)] text-[var(--ink-900)] text-xs font-mono font-semibold tracking-wide transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IoPersonAddOutline className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isAdding ? AUTH_EMAILS_COPY.ADDING_BUTTON : AUTH_EMAILS_COPY.ADD_BUTTON}</span>
          </button>
        </div>
      </form>

      {/* Authorized Emails List */}
      <div className="mt-6 space-y-2.5">
        {isLoading && admins.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-[var(--mist-dim)]">
            Loading whitelist telemetry...
          </div>
        ) : (
          admins.map((admin) => {
            const isEnabled = admin.isEnabled;

            return (
              <div
                key={admin.email}
                className="flex items-center justify-between p-3.5 bg-[var(--ink-800)] border border-[var(--line)] rounded-xl hover:border-[var(--line-soft)] transition-colors gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-2 rounded-lg border ${
                      isEnabled
                        ? "bg-[var(--amber)]/10 border-[var(--amber)]/30 text-[var(--amber)]"
                        : "bg-[var(--ink-700)] border-[var(--line)] text-[var(--mist-dim)]"
                    }`}
                  >
                    {isEnabled ? (
                      <IoShieldCheckmarkOutline className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <IoPersonOutline className="w-4 h-4" aria-hidden="true" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-[var(--paper)] truncate">
                        {admin.email}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider font-semibold border ${
                          isEnabled
                            ? "bg-[var(--live)]/10 text-[var(--live)] border-[var(--live)]/30"
                            : "bg-red-500/10 text-red-400 border-red-500/30"
                        }`}
                      >
                        {isEnabled ? "ACTIVE" : "DISABLED"}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--mist-dim)] mt-0.5">
                      {admin.role || "Administrator"}
                    </div>
                  </div>
                </div>

                {/* 3-Dot Actions Menu */}
                <ActionsMenu
                  ariaLabel={`Actions for ${admin.email}`}
                  items={[
                    isEnabled
                      ? {
                          id: "disable",
                          label: "Disable Access",
                          icon: IoLockClosedOutline,
                          onClick: () => handleToggleStatus(admin.email, isEnabled),
                        }
                      : {
                          id: "enable",
                          label: "Enable Access",
                          icon: IoLockOpenOutline,
                          onClick: () => handleToggleStatus(admin.email, isEnabled),
                        },
                    {
                      id: "delete",
                      label: "Remove Admin",
                      icon: IoTrashOutline,
                      isDestructive: true,
                      onClick: () => handleRemoveEmail(admin.email),
                    },
                  ]}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
