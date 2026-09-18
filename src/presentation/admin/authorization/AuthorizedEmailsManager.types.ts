// presentation/admin/authorization/AuthorizedEmailsManager.types.ts
// View model interface and types for the AuthorizedEmailsManager component.
// Pure TypeScript — zero framework or JSX markup.

import type React from "react";
import type { AuthorizedAdminRecord } from "../../../domain/repositories/admin/IAdminAccessRepository";

export interface FeedbackMessage {
  readonly type: "success" | "error";
  readonly text: string;
}

export interface AuthorizedEmailsViewModel {
  readonly admins: readonly AuthorizedAdminRecord[];
  readonly isLoading: boolean;
  readonly isAdding: boolean;
  readonly newEmail: string;
  readonly inputError: string | null;
  readonly feedbackMessage: FeedbackMessage | null;
  readonly handleNewEmailChange: (value: string) => void;
  readonly handleNewEmailBlur: () => void;
  readonly handleAddEmail: (e: React.FormEvent) => Promise<void>;
  readonly handleToggleStatus: (email: string, currentEnabled: boolean) => Promise<void>;
  readonly handleRemoveEmail: (email: string) => Promise<void>;
}
