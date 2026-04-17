import { useMemo } from "react";
import { useAuthStore } from "@/store/auth-store";

export function useAuth() {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.role);
  const userId = useAuthStore((state) => state.userId);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  return useMemo(
    () => ({
      token,
      role,
      userId,
      hasHydrated,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, role, userId, hasHydrated, login, logout]
  );
}