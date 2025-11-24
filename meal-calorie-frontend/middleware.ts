// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isAssetPath(pathname: string) {
  return (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/static/") ||
    pathname === "/favicon.ico" ||
    pathname.includes(".")
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (isAssetPath(pathname)) return NextResponse.next();

  // Don't block client-side-only auth (localStorage)
  return NextResponse.next();
}

export const config = {
  // Leave matcher empty or include only static non-protected patterns
  matcher: ["/((?!api|_next|static).*)"],
};
