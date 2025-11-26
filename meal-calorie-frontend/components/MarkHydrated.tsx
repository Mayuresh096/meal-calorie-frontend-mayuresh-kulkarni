// src/components/MarkHydrated.tsx
'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export default function MarkHydrated() {
  useEffect(() => {
    const state = (useAuthStore as any).getState?.();
    if (!state || state.isHydrated !== true) {
      const t = setTimeout(() => {
        (useAuthStore as any).setState({ isHydrated: true });
      }, 50);
      return () => clearTimeout(t);
    }
  }, []);
  return null;
}
