// presentation/providers/auth/authContext.ts
// Context definition for admin authentication and session state.

import { createContext } from "react";

export interface AuthUser {
  readonly email: string;
  readonly role: "admin";
}

export interface AuthContextValue {
  readonly isAuthenticated: boolean;
  readonly user: AuthUser | null;
  readonly tokenExpiresAt: number | null;
  readonly isLoading: boolean;
  readonly login: (email: string, code: string) => Promise<boolean>;
  readonly logout: () => void;
}

export const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  user: null,
  tokenExpiresAt: null,
  isLoading: false,
  login: async () => false,
  logout: () => {},
});
