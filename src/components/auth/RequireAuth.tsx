"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";

/**
 * Client-side guard for /dashboard/*. Guests are sent to /login with a return path (path and query).
 * `fallback` shows while the session is read or the redirect is in flight. Children are always
 * rendered (hidden until signed in) so the server can prerender the page segment; they only ever
 * contain demo data.
 */
export function RequireAuth({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    /* The query is kept too, e.g. /dashboard/stake?pool=eth from a pool page */
    if (status === "guest") router.replace(`/login?next=${encodeURIComponent(pathname + window.location.search)}`);
  }, [status, router, pathname]);

  const authed = status === "authed";
  return (
    <>
      {!authed && fallback}
      {/* The key remounts the page once signed in, so state initialised from the session or stored data is fresh */}
      <div key={authed ? "authed" : "pending"} hidden={!authed} className="contents">
        {children}
      </div>
    </>
  );
}
