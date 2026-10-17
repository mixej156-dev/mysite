"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { safeNext, useAuth } from "@/lib/auth";

/** Sends signed-in visitors on to ?next= (or the dashboard). Used by the sign-in screens. */
export function useRedirectWhenAuthed() {
  const { status } = useAuth();
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));

  useEffect(() => {
    if (status === "authed") router.replace(next);
  }, [status, router, next]);

  return next;
}
