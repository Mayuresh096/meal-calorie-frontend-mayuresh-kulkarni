// src/hooks/useAuthGuard.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

/**
 * useAuthGuard - redirects to `redirectTo` if user is not authenticated.
 *
 * Usage:
 *  - call inside a client page or component: useAuthGuard('/login')
 *  - it waits for `isHydrated` to be true (prevents flashes)
 */
export default function useAuthGuard(redirectTo = '/login') {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  useEffect(() => {
    if (isHydrated === false) return;
    if (!token) {
      router.replace(redirectTo);
    }
  }, [isHydrated, token, router, redirectTo]);
}
