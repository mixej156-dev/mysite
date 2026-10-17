import type { ReactNode } from "react";
import { Link } from "@/components/Link";
import { Logo } from "../layout/Logo";

const POINTS = [
  "Terms shown before you stake",
  "Rewards recorded per epoch, paid out daily",
  "Withdraw any time, after the network’s unbonding period",
];

/** Two-panel frame for sign-in screens: a quiet brand panel and the form. */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <aside data-tone="inverse" className="flex flex-col justify-between bg-bg p-8 text-text max-lg:hidden xl:p-12">
        <Link href="/" aria-label="LONAR ECO. home" className="self-start rounded-sm">
          <Logo />
        </Link>
        <div>
          <p className="max-w-[14ch] text-h1 font-semibold">Staking, kept to account.</p>
          <ul className="mt-8 flex flex-col gap-3 font-serif text-body text-muted">
            {POINTS.map((p) => (
              <li key={p} className="flex gap-3">
                <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-pill bg-accent" />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-caption text-muted">Staking involves risk, including loss of principal.</p>
      </aside>

      <div className="flex flex-col">
        <div className="flex h-16 items-center justify-between px-6 sm:px-7">
          <Link href="/" aria-label="LONAR ECO. home" className="rounded-sm lg:invisible">
            <Logo />
          </Link>
        </div>
        <main id="main" className="flex flex-1 items-center justify-center px-6 py-10 sm:px-7">
          <div className="w-full max-w-md">{children}</div>
        </main>
        <footer className="flex flex-wrap justify-center gap-x-5 gap-y-1 px-6 pb-6 text-caption text-muted">
          <Link href="/legal/terms" className="rounded-sm hover:text-text">
            Terms
          </Link>
          <Link href="/legal/privacy" className="rounded-sm hover:text-text">
            Privacy
          </Link>
          <Link href="/legal/risk-disclosure" className="rounded-sm hover:text-text">
            Risk disclosure
          </Link>
        </footer>
      </div>
    </div>
  );
}
