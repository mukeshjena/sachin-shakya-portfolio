// presentation/providers/auth/useAuth.ts
// Consumer hook for admin authentication and session state.

import { useContext } from "react";
import { AuthContext, type AuthContextValue } from "./authContext";

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("[useAuth] Hook must be used within an <AuthProvider>");
  }
  return context;
}
