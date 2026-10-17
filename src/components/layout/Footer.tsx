import { Link } from "@/components/Link";
import { Logo } from "./Logo";
import { FOOTER_COLUMNS, SOCIAL_LINKS } from "./nav";

const linkClass = "rounded-sm text-small text-muted transition-colors duration-fast hover:text-text";

export function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[minmax(0,1.3fr)_repeat(4,minmax(0,1fr))] lg:gap-8">
        <div className="flex max-w-xs flex-col gap-4">
          <Link href="/" aria-label="LONAR ECO. home" className="self-start rounded-sm">
            <Logo />
          </Link>
          <p className="font-serif text-small text-muted">
            Staking across major networks, with rewards recorded per epoch and paid out daily.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:contents">
          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title} className="flex flex-col gap-3">
              <h2 className="text-small font-medium text-text">{column.title}</h2>
              <ul className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t border-rule">
        <div className="container-page flex flex-col gap-6 py-8 lg:flex-row lg:items-start lg:justify-between">
          <p className="max-w-[72ch] text-caption text-muted">
            <span className="font-medium text-text">Demo prototype.</span> All figures on this site are demo data, not
            an offer or a forecast. Staking involves risk, including loss of principal. Read the{" "}
            <Link href="/legal/risk-disclosure" className="text-accent-text underline underline-offset-2">
              risk disclosure
            </Link>
            .
          </p>
          <div className="flex shrink-0 items-center gap-6 text-caption text-muted">
            <ul className="flex gap-4" aria-label="Social media (placeholders)">
              {SOCIAL_LINKS.map((name) => (
                <li key={name}>
                  <a href="#" aria-disabled="true" className={linkClass}>
                    {name}
                  </a>
                </li>
              ))}
            </ul>
            <span>© 2026 LONAR ECO.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
