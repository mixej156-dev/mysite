"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";

/*
 * Fake authentication for the prototype (CLAUDE.md §7). Any email and password "work".
 * The session lives in localStorage under `demo_session`; nothing leaves the browser.
 */

export const SESSION_KEY = "demo_session";

export type Session = { name: string; email: string; createdAt: string };
export type AuthStatus = "loading" | "guest" | "authed";

type AuthApi = {
  session: Session | null;
  status: AuthStatus;
  signIn: (email: string) => Promise<Session>;
  signUp: (name: string, email: string) => Promise<Session>;
  signOut: () => void;
};

/* Server render (and the first client render) can't see localStorage */
const SERVER = "__server__";
const listeners = new Set<() => void>();

function read(): string {
  try {
    return localStorage.getItem(SESSION_KEY) ?? "";
  } catch {
    return "";
  }
}

function write(value: Session | null) {
  try {
    if (value) localStorage.setItem(SESSION_KEY, JSON.stringify(value));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    // Storage unavailable (private mode): the session lasts only for this page view
  }
  listeners.forEach((l) => l());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // Other tabs signing in or out
  const onStorage = (e: StorageEvent) => {
    if (e.key === SESSION_KEY || e.key === null) onChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function parse(raw: string): Session | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<Session>;
    return typeof value.email === "string" && typeof value.name === "string" ? (value as Session) : null;
  } catch {
    return null;
  }
}

/** "alex.morgan@demo.io" -> "Alex Morgan" */
export function nameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  const words = local.split(/[._\-+0-9]+/).filter(Boolean);
  if (words.length === 0) return "Demo user";
  return words.map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

const delay = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

const AuthContext = createContext<AuthApi | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(subscribe, read, () => SERVER);
  const session = useMemo(() => (raw === SERVER ? null : parse(raw)), [raw]);
  const status: AuthStatus = raw === SERVER ? "loading" : session ? "authed" : "guest";

  const signIn = useCallback(async (email: string) => {
    await delay(700);
    const next = { name: nameFromEmail(email), email: email.trim(), createdAt: new Date().toISOString() };
    write(next);
    return next;
  }, []);

  const signUp = useCallback(async (name: string, email: string) => {
    await delay(900);
    const next = {
      name: name.trim() || nameFromEmail(email),
      email: email.trim(),
      createdAt: new Date().toISOString(),
    };
    write(next);
    return next;
  }, []);

  const signOut = useCallback(() => write(null), []);

  const api = useMemo(() => ({ session, status, signIn, signUp, signOut }), [session, status, signIn, signUp, signOut]);
  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthApi {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}

/** Only same-site paths are allowed as a post-login destination. */
export function safeNext(next: string | null, fallback = "/dashboard"): string {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}
