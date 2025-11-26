'use client';
import { useTheme } from "@/app/hooks/useTheme";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { LogOut, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const Header: React.FC = () => {
  const router = useRouter();
  const { theme, toggle } = useTheme();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const handleLogout = async () => {
    try {
      clearAuth();
      try {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("meal-calorie-auth");
      } catch (e) {
        // ignore storage errors
      }
      try {
        if (api && (api as any).defaults && (api as any).defaults.headers) {
          delete (api as any).defaults.headers.common.Authorization;
        }
      } catch (e) {}

      document.cookie = "accessToken=; path=/; max-age=0; SameSite=Lax;";
    } catch (err) {
      console.warn('logout error', err);
    } finally {
      router.replace("/login");
    }
  };

  const isDark = theme === 'dark';

  return (
    <header className="flex items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--primary)" }}>
          NutriFinder
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => toggle()}
          aria-label="Toggle theme"
          aria-pressed={isDark}
          className="px-3 py-2 rounded border text-sm transition-transform duration-150 hover:scale-105 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "transparent",
            color: "var(--foreground)",
            cursor: "pointer",
          }}
        >
          {isDark ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <button
          onClick={handleLogout}
          aria-label="Logout"
          className="px-3 py-2 rounded border text-sm transition-transform duration-150 hover:scale-105 hover:bg-slate-100 dark:hover:bg-slate-700 inline-flex items-center gap-2"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "transparent",
            color: "var(--foreground)",
            cursor: "pointer",
          }}
        >
          <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
