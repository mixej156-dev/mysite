"use client";

import { buttonClasses } from "@/design-system";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main" className="container-page grid min-h-dvh content-center py-24">
      <p className="font-mono text-h3 text-warning" aria-hidden>
        Error
      </p>
      <h1 className="mt-4 text-h1 md:text-display">Something went wrong</h1>
      <p className="mt-6 max-w-[52ch] font-serif text-lead text-muted">
        The page failed to load. Nothing in this demo was changed. Try again, or return to the home page.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" onClick={reset} className={buttonClasses({ size: "lg" })}>
          Try again
        </button>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- full reload clears a broken client state */}
        <a href="/" className={buttonClasses({ variant: "secondary", size: "lg" })}>
          Back to home
        </a>
      </div>
    </main>
  );
}
