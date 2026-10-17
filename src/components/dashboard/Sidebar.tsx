"use client";

import { usePathname } from "next/navigation";
import { Link } from "@/components/Link";
import { cn } from "@/lib/cn";
import { Logo } from "../layout/Logo";
import { DASHBOARD_NAV, isNavActive } from "./nav";

/** Dashboard navigation. Rendered in a fixed column on desktop and in a sheet on smaller screens. */
export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-8 px-4 py-5">
      <Link href="/" aria-label="LONAR ECO. home" className="self-start rounded-sm px-2" onClick={onNavigate}>
        <Logo />
      </Link>
      <nav aria-label="Dashboard">
        <ul className="flex flex-col gap-0.5">
          {DASHBOARD_NAV.map(({ href, label, icon: Icon }) => {
            const active = isNavActive(href, pathname);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-10 items-center gap-3 rounded-field px-3 text-small font-medium transition-colors duration-fast",
                    active ? "bg-surface-2 text-text" : "text-muted hover:bg-surface-2/60 hover:text-text",
                  )}
                >
                  <Icon aria-hidden className={cn("size-[1.125rem]", active && "text-accent-text")} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
