import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = { firstName?: string; lastName?: string; email?: string } | null;

type AuthState = {
  token: string | null;
  user: User;
  setAuth: (token: string, user?: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => {
        set({ token, user: user ?? null });
        try {
          if (typeof window !== "undefined") {
            // persist a non-http cookie as fallback so middleware can work if backend can't set HttpOnly cookie
            document.cookie = `accessToken=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax; ${location.protocol === "https:" ? "Secure;" : ""}`;
            localStorage.setItem("accessToken", token);
            if (user) localStorage.setItem("user", JSON.stringify(user));
          }
        } catch (e) {}
      },
      logout: () => {
        set({ token: null, user: null });
        try {
          if (typeof window !== "undefined") {
            // remove cookie by setting max-age=0
            document.cookie = "accessToken=; path=/; max-age=0";
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
          }
        } catch (e) {}
      },
    }),
    { name: "meal-calorie-auth" }
  )
);
