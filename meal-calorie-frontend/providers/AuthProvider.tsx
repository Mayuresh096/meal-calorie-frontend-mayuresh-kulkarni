"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";

type Props = {
  children: ReactNode;
};

export default function AuthProvider({ children }: Props) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const token = typeof window !== "undefined" ? (localStorage.getItem("accessToken") || localStorage.getItem("token")) : null;
      const userRaw = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      const user = userRaw ? JSON.parse(userRaw) : null;

      if (token) {
        setAuth(token, user);
      }
    } catch (e) {
      console.warn("AuthProvider hydration error:", e);
    } finally {
      setHydrated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run only once


  return <>{children}</>;
}
