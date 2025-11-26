import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = { first_name?: string; last_name?: string; email?: string } | null;

type AuthState = {
  token: string | null;
  user: User;
  isHydrated: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isHydrated: false,
      setAuth: (token: any, user: any) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),
    }),
    {
      name: 'meal-calorie-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state) => {
        // called after hydrate finished; state is the restored state
        // we can't call set here directly so we will set isHydrated via a small timeout in the app
      },
    }
  )
);
