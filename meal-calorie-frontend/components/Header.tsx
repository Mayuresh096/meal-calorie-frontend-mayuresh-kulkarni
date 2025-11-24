"use client";

import { LogOut, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Header: React.FC = () => {
  const router = useRouter();

  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") setIsDark(true);
      else if (saved === "light") setIsDark(false);
      else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setIsDark(true);
      }
    } catch {
      // ignore
    }
  }, []);

  // apply/remove the `dark` class and persist whenever isDark changes
  useEffect(() => {
    try {
      if (isDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    } catch {
      // ignore
    }
  }, [isDark]);

  const handleLogout = () => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      // remove cookie if you set it earlier (safe noop if none)
      document.cookie = "accessToken=; path=/; max-age=0";
    } catch {}
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--primary)" }}>
          NutriFinder
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsDark((s) => !s)}
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
