// presentation/admin/authorization/constants/auth-emails.constants.ts
// Static copy, aria labels, and badges for Authorized Emails management.
// Zero JSX or business logic (Universal Separation of Concerns — Rule 13).

export const AUTH_EMAILS_COPY = {
  TITLE: "Administrator Access Control",
  SUBTITLE: "Manage whitelisted team members authorized to request cryptographic OTP entry.",
  BADGE: "ACCESS CONTROL POLICY",
  ROOT_ADMIN_EMAIL: "sachin.shakya@live.com",
  ROOT_ADMIN_EMAILS: ["sachin.shakya@live.com", "muk3shjena@gmail.com"] as readonly string[],
  ROOT_BADGE: "ROOT ARCHITECT (PERMANENT)",
  TEAM_BADGE: "DELEGATED ADMIN",
  ADD_HEADING: "Authorize New Administrator",
  INPUT_LABEL: "Team Member Email",
  INPUT_PLACEHOLDER: "co.architect@eptura.com",
  ADD_BUTTON: "Grant Access",
  ADDING_BUTTON: "Authorizing...",
  DELETE_CONFIRM_TITLE: "Revoke Administrator Access",
  DELETE_BUTTON_ARIA: "Revoke administrative access for",
  EMPTY_LIST: "No secondary administrators authorized. Only root administrator active.",
  WHITELIST_COUNT_LABEL: "TOTAL AUTHORIZED OPERATORS",
  SUCCESS_ADDED: "Administrator email successfully added to security whitelist.",
  SUCCESS_REMOVED: "Administrator authorization successfully revoked.",
  ROOT_CANNOT_DELETE: "Security Lock: Primary root administrator cannot be revoked.",
} as const;

export function isPermanentRootAdmin(email: string): boolean {
  return (AUTH_EMAILS_COPY.ROOT_ADMIN_EMAILS as readonly string[]).includes(
    email.trim().toLowerCase()
  );
}
