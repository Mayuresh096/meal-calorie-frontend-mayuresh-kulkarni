'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type ThemeContextShape = { theme: Theme; setTheme: (t: Theme | ((prev: Theme) => Theme)) => void; toggle: () => void };

const ThemeContext = createContext<ThemeContextShape | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = typeof window !== 'undefined' ? window.localStorage.getItem('theme') : null;
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {}
    try {
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {}
    return 'light';
  });

  useEffect(() => {
    try {
      if (theme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      window.localStorage.setItem('theme', theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === 'theme') {
        const v = e.newValue as Theme | null;
        if (v === 'dark' || v === 'light') setThemeState(v);
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setTheme = (v: Theme | ((prev: Theme) => Theme)) => {
    setThemeState((prev) => (typeof v === 'function' ? (v as any)(prev) : v));
  };
  const toggle = () => setThemeState((s) => (s === 'dark' ? 'light' : 'dark'));

  return <ThemeContext.Provider value={{ theme, setTheme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
