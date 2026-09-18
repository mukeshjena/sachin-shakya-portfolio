// presentation/admin/authorization/AuthorizedEmailsManager.hooks.ts
// Hook managing whitelisted administrator email queries, additions, revocations, and blur validation.
// Zero debounced inputs (Rule 4 / Rule 12): validate on blur and submit only.

import { useCallback, useEffect, useState } from "react";
import type {
  AuthorizedAdminRecord,
  IAdminAccessRepository,
} from "../../../domain/repositories/admin/IAdminAccessRepository";
import { DI_TOKENS } from "../../../infrastructure/di/tokens";
import { useContainer } from "../../shared/useContainer";
import type { AuthorizedEmailsViewModel, FeedbackMessage } from "./AuthorizedEmailsManager.types";
import { AUTH_EMAILS_COPY } from "./constants/auth-emails.constants";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useAuthorizedEmailsManager(): AuthorizedEmailsViewModel {
  const adminAccessRepo = useContainer<IAdminAccessRepository>(DI_TOKENS.AdminAccessRepository);

  const [admins, setAdmins] = useState<AuthorizedAdminRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newEmail, setNewEmail] = useState<string>("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage | null>(null);

  const fetchAdmins = useCallback(async () => {
    setIsLoading(true);
    try {
      const records = await adminAccessRepo.getAuthorizedAdminRecords();
      setAdmins(records);
    } catch (err) {
      setFeedbackMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to load authorized administrator list.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [adminAccessRepo]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleNewEmailChange = useCallback((value: string) => {
    setNewEmail(value);
    setInputError(null);
  }, []);

  const handleNewEmailBlur = useCallback(() => {
    const trimmed = newEmail.trim().toLowerCase();
    if (trimmed && !EMAIL_REGEX.test(trimmed)) {
      setInputError("Please enter a valid email address.");
    }
  }, [newEmail]);

  const handleAddEmail = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = newEmail.trim().toLowerCase();

      if (!EMAIL_REGEX.test(trimmed)) {
        setInputError("Please enter a valid corporate or personal email.");
        return;
      }

      if (admins.some((a) => a.email === trimmed)) {
        setInputError("This email is already an authorized administrator.");
        return;
      }

      setIsAdding(true);
      setFeedbackMessage(null);
      setInputError(null);

      try {
        await adminAccessRepo.addAuthorizedEmail(trimmed);
        setNewEmail("");
        setFeedbackMessage({
          type: "success",
          text: AUTH_EMAILS_COPY.SUCCESS_ADDED,
        });
        await fetchAdmins();
      } catch (err) {
        setFeedbackMessage({
          type: "error",
          text: err instanceof Error ? err.message : "Failed to add administrator email.",
        });
      } finally {
        setIsAdding(false);
      }
    },
    [adminAccessRepo, admins, fetchAdmins, newEmail]
  );

  const handleToggleStatus = useCallback(
    async (emailToToggle: string, currentEnabled: boolean) => {
      const nextEnabled = !currentEnabled;
      setIsLoading(true);
      setFeedbackMessage(null);

      try {
        await adminAccessRepo.setAdminEnabled(emailToToggle, nextEnabled);
        setFeedbackMessage({
          type: "success",
          text: `Administrator '${emailToToggle}' is now ${nextEnabled ? "ACTIVE" : "DISABLED"}.`,
        });
        await fetchAdmins();
      } catch (err) {
        setFeedbackMessage({
          type: "error",
          text: err instanceof Error ? err.message : "Failed to update administrator status.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [adminAccessRepo, fetchAdmins]
  );

  const [emailToDelete, setEmailToDelete] = useState<string | null>(null);

  const promptRemoveEmail = useCallback((email: string) => {
    setEmailToDelete(email.trim().toLowerCase());
  }, []);

  const cancelRemoveEmail = useCallback(() => {
    setEmailToDelete(null);
  }, []);

  const confirmRemoveEmail = useCallback(async () => {
    if (!emailToDelete) return;
    const trimmed = emailToDelete;
    setEmailToDelete(null);
    setIsLoading(true);
    setFeedbackMessage(null);

    try {
      await adminAccessRepo.removeAuthorizedEmail(trimmed);
      setFeedbackMessage({
        type: "success",
        text: AUTH_EMAILS_COPY.SUCCESS_REMOVED,
      });
      await fetchAdmins();
    } catch (err) {
      setFeedbackMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to revoke administrator access.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [adminAccessRepo, emailToDelete, fetchAdmins]);

  return {
    admins,
    isLoading,
    isAdding,
    newEmail,
    inputError,
    feedbackMessage,
    emailToDelete,
    handleNewEmailChange,
    handleNewEmailBlur,
    handleAddEmail,
    handleToggleStatus,
    handleRemoveEmail: promptRemoveEmail,
    promptRemoveEmail,
    cancelRemoveEmail,
    confirmRemoveEmail,
  };
}
