"use client";

import { Cookie } from "lucide-react";
import { useSyncExternalStore } from "react";
import { Link } from "@/components/Link";
import { Button } from "@/design-system";

/* Consent choice in localStorage. "unset" means the notice still needs an answer. */
const CONSENT_KEY = "cookie_consent";
type Consent = "all" | "essential" | "unset";
const SERVER = "server";

const listeners = new Set<() => void>();

function read(): string {
  try {
    return localStorage.getItem(CONSENT_KEY) ?? "unset";
  } catch {
    return "unset";
  }
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

function write(value: Consent) {
  try {
    if (value === "unset") localStorage.removeItem(CONSENT_KEY);
    else localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Storage blocked: the choice lasts for this page view only
  }
  listeners.forEach((l) => l());
}

/** Footer link that brings the notice back so the visitor can change their choice. */
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={() => write("unset")} className={className}>
      Cookie settings
    </button>
  );
}

/** Bottom-left notice (full width on phones) until the visitor picks Accept all or Essential only. */
export function CookieNotice() {
  const consent = useSyncExternalStore(subscribe, read, () => SERVER);
  if (consent !== "unset") return null;

  return (
    <section
      aria-labelledby="cookie-title"
      className="fixed inset-x-4 bottom-4 z-sticky animate-pop-in rounded-card border border-rule bg-surface p-5 text-text shadow-overlay sm:right-auto sm:bottom-6 sm:left-6 sm:max-w-sm"
    >
      <div className="flex items-start gap-3">
        <Cookie aria-hidden className="mt-0.5 size-5 shrink-0 text-accent-text" />
        <div>
          <h2 id="cookie-title" className="text-body font-medium">
            Cookies on this site
          </h2>
          <p className="mt-1 text-small text-muted">
            Essential cookies keep you signed in and remember your settings. With your consent we also use analytics
            cookies to see which pages help.{" "}
            <Link href="/legal/privacy#privacy-cookies" className="rounded-sm text-accent-text underline underline-offset-2">
              Privacy policy
            </Link>
          </p>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Button size="sm" onClick={() => write("all")}>
          Accept all
        </Button>
        <Button size="sm" variant="secondary" onClick={() => write("essential")}>
          Essential only
        </Button>
      </div>
    </section>
  );
}
