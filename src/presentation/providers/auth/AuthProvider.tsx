// presentation/providers/auth/AuthProvider.tsx
// Manages admin authentication session state.
// Stubbed for Step 13, wired to OTP flow in Step 20.

import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import type { IVerifyAccessCodeUseCase } from "../../../application/use-cases/auth/VerifyAccessCodeUseCase";
import { DI_TOKENS } from "../../../infrastructure/di/tokens";
import { useContainer } from "../../shared/useContainer";
import { AuthContext, type AuthContextValue, type AuthUser } from "./authContext";

const SESSION_STORAGE_KEY = "ss_admin_auth";

interface StoredAuthSession {
  readonly email: string;
  readonly tokenExpiresAt: number;
}

export interface AuthProviderProps {
  readonly children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const verifyAccessCode = useContainer<IVerifyAccessCodeUseCase>(DI_TOKENS.VerifyAccessCode);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tokenExpiresAt, setTokenExpiresAt] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize session from client storage
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as StoredAuthSession;
          if (parsed.tokenExpiresAt > Date.now()) {
            setUser({ email: parsed.email, role: "admin" });
            setTokenExpiresAt(parsed.tokenExpiresAt);
          } else {
            sessionStorage.removeItem(SESSION_STORAGE_KEY);
          }
        }
      }
    } catch {
      // Storage unavailable or corrupted
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    async (email: string, code: string): Promise<boolean> => {
      setIsLoading(true);
      try {
        const result = await verifyAccessCode.execute({ email, code });
        if (result.success) {
          const session: StoredAuthSession = {
            email: result.email,
            tokenExpiresAt: result.tokenExpiresAt,
          };
          sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
          setUser({ email: result.email, role: "admin" });
          setTokenExpiresAt(result.tokenExpiresAt);
          return true;
        }
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [verifyAccessCode]
  );

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // ignore
    }
    setUser(null);
    setTokenExpiresAt(null);
  }, []);

  const isAuthenticated = Boolean(user && tokenExpiresAt && tokenExpiresAt > Date.now());

  const contextValue: AuthContextValue = useMemo(
    () => ({
      isAuthenticated,
      user,
      tokenExpiresAt,
      isLoading,
      login,
      logout,
    }),
    [isAuthenticated, user, tokenExpiresAt, isLoading, login, logout]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
