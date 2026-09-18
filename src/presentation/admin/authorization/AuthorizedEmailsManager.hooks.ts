// presentation/admin/authorization/AuthorizedEmailsManager.hooks.ts
// Hook managing whitelisted administrator email queries, additions, revocations, and blur validation.
// Zero debounced inputs (Rule 4 / Rule 12): validate on blur and submit only.

import { useCallback, useEffect, useState } from "react";
import type { IAddAdminEmailUseCase } from "../../../application/use-cases/admin-users/AddAdminEmailUseCase";
import type { IGetAuthorizedEmailsUseCase } from "../../../application/use-cases/admin-users/GetAuthorizedEmailsUseCase";
import type { IRemoveAdminEmailUseCase } from "../../../application/use-cases/admin-users/RemoveAdminEmailUseCase";
import { DI_TOKENS } from "../../../infrastructure/di/tokens";
import { useContainer } from "../../shared/useContainer";
import type { AuthorizedEmailsViewModel, FeedbackMessage } from "./AuthorizedEmailsManager.types";
import { AUTH_EMAILS_COPY, isPermanentRootAdmin } from "./constants/auth-emails.constants";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useAuthorizedEmailsManager(): AuthorizedEmailsViewModel {
  const getAuthorizedEmails = useContainer<IGetAuthorizedEmailsUseCase>(
    DI_TOKENS.GetAuthorizedEmails
  );
  const addAdminEmail = useContainer<IAddAdminEmailUseCase>(DI_TOKENS.AddAdminEmail);
  const removeAdminEmail = useContainer<IRemoveAdminEmailUseCase>(DI_TOKENS.RemoveAdminEmail);

  const [emails, setEmails] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newEmail, setNewEmail] = useState<string>("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage | null>(null);

  const fetchEmails = useCallback(async () => {
    setIsLoading(true);
    try {
      const list = await getAuthorizedEmails.execute();
      setEmails(list);
    } catch (err) {
      setFeedbackMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to load authorized administrator list.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [getAuthorizedEmails]);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

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

      if (emails.includes(trimmed)) {
        setInputError("This email is already an authorized administrator.");
        return;
      }

      setIsAdding(true);
      setFeedbackMessage(null);
      setInputError(null);

      try {
        await addAdminEmail.execute({ email: trimmed });
        setNewEmail("");
        setFeedbackMessage({
          type: "success",
          text: AUTH_EMAILS_COPY.SUCCESS_ADDED,
        });
        await fetchEmails();
      } catch (err) {
        setFeedbackMessage({
          type: "error",
          text: err instanceof Error ? err.message : "Failed to add administrator email.",
        });
      } finally {
        setIsAdding(false);
      }
    },
    [addAdminEmail, emails, fetchEmails, newEmail]
  );

  const handleRemoveEmail = useCallback(
    async (emailToRemove: string) => {
      const trimmed = emailToRemove.trim().toLowerCase();
      if (isPermanentRootAdmin(trimmed)) {
        setFeedbackMessage({
          type: "error",
          text: AUTH_EMAILS_COPY.ROOT_CANNOT_DELETE,
        });
        return;
      }

      const confirmed = window.confirm(
        `Are you sure you want to revoke administrative access for '${trimmed}'?`
      );
      if (!confirmed) return;

      setIsLoading(true);
      setFeedbackMessage(null);

      try {
        await removeAdminEmail.execute({ email: trimmed });
        setFeedbackMessage({
          type: "success",
          text: AUTH_EMAILS_COPY.SUCCESS_REMOVED,
        });
        await fetchEmails();
      } catch (err) {
        setFeedbackMessage({
          type: "error",
          text: err instanceof Error ? err.message : "Failed to revoke administrator access.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [fetchEmails, removeAdminEmail]
  );

  return {
    emails,
    isLoading,
    isAdding,
    newEmail,
    inputError,
    feedbackMessage,
    handleNewEmailChange,
    handleNewEmailBlur,
    handleAddEmail,
    handleRemoveEmail,
  };
}
