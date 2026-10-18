import Link from "next/link";
import { buttonClasses } from "@/design-system";

const SUGGESTIONS = [
  { href: "/staking", label: "Staking pools" },
  { href: "/tools/calculator", label: "Rewards calculator" },
  { href: "/docs", label: "Docs" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function NotFoundContent() {
  return (
    <section className="container-page pt-10 pb-14 sm:pt-16 sm:pb-24 md:pt-24 md:pb-32">
      <p className="font-mono text-h3 text-accent-text" aria-hidden>
        404
      </p>
      <h1 className="mt-4 text-h1 md:text-display">Page not found</h1>
      <p className="mt-6 max-w-[52ch] font-serif text-lead text-muted">
        The address may be mistyped or the page may have moved. Pick up from one of the places below.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className={buttonClasses({ size: "lg" })}>
          Back to home
        </Link>
        <Link href="/staking" className={buttonClasses({ variant: "secondary", size: "lg" })}>
          See pools
        </Link>
      </div>
      <nav aria-label="Popular pages" className="mt-10 sm:mt-16 max-w-[40rem] border-t border-rule">
        <ul>
          {SUGGESTIONS.map((s) => (
            <li key={s.href} className="border-b border-rule">
              <Link
                href={s.href}
                className="flex h-12 items-center justify-between rounded-sm text-body transition-colors duration-fast hover:text-accent-text"
              >
                {s.label}
                <span aria-hidden className="text-muted">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
