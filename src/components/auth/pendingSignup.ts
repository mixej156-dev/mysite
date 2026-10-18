"use client";

import { useSyncExternalStore } from "react";

/* A sign-up waiting for email confirmation. Lives in sessionStorage so it ends with the tab. */
const KEY = "pending_signup";
export type PendingSignup = { name: string; email: string };

const listeners = new Set<() => void>();

function read(): string {
  try {
    return sessionStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

export function setPendingSignup(value: PendingSignup | null) {
  try {
    if (value) sessionStorage.setItem(KEY, JSON.stringify(value));
    else sessionStorage.removeItem(KEY);
  } catch {
    // Storage blocked: the confirmation screen will ask to start again
  }
  listeners.forEach((l) => l());
}

/** undefined while rendering on the server, null when there is nothing to confirm */
export function usePendingSignup(): PendingSignup | null | undefined {
  const raw = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    () => "server",
  );
  if (raw === "server") return undefined;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PendingSignup;
  } catch {
    return null;
  }
}
