import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import Cookies from "js-cookie";
import type { UserRole } from "@/types/auth";
import { decodeToken } from "@/lib/decode-token";

type AuthState = {
  token: string | null;
  role: UserRole | null;
  userId: number | null;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  login: (token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      userId: null,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      login: (token) => {
        const decoded = decodeToken(token);

        Cookies.set("token", token, {
          expires: 1,
          sameSite: "lax",
        });

        set({
          token,
          role: decoded.role,
          userId: decoded.user_id,
        });
      },
      logout: () => {
        Cookies.remove("token");
        set({
          token: null,
          role: null,
          userId: null,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);