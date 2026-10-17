"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";

/**
 * Client-side guard for /dashboard/*. Guests are sent to /login with a return path.
 * `fallback` shows while the session is read or the redirect is in flight. Children are always
 * rendered (hidden until signed in) so the server can prerender the page segment; they only ever
 * contain demo data.
 */
export function RequireAuth({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "guest") router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [status, router, pathname]);

  const authed = status === "authed";
  return (
    <>
      {!authed && fallback}
      <div hidden={!authed} className="contents">
        {children}
      </div>
    </>
  );
}
