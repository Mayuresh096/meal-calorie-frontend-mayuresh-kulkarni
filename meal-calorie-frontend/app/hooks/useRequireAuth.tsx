"use client";

import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function useRequireAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        const fullPath =
          pathname +
          (searchParams?.toString() ? `?${searchParams.toString()}` : "");
        const encoded = encodeURIComponent(fullPath);
        router.replace(`/login?from=${encoded}`);
      }
    } catch (e) {
      router.replace("/login");
    }
  }, [router, pathname, searchParams]);
}
