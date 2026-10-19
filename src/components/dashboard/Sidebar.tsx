"use client";

import { LayoutGroup, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useId } from "react";
import { Link } from "@/components/Link";
import { transition } from "@/design-system/motion";
import { cn } from "@/lib/cn";
import { Logo } from "../layout/Logo";
import { DASHBOARD_NAV, isNavActive } from "./nav";

/** Dashboard navigation. Rendered in a fixed column on desktop and in a sheet on smaller screens. */
export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  /* The desktop column and the sheet can both be mounted: each keeps its own sliding highlight */
  const group = useId();

  return (
    <div className="flex h-full flex-col gap-8 px-4 py-5">
      <Link href="/" aria-label="LONAR ECO. home" className="self-start rounded-sm px-2" onClick={onNavigate}>
        <Logo />
      </Link>
      <nav aria-label="Dashboard">
        <LayoutGroup id={group}>
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
                      "relative flex h-11 items-center gap-3 rounded-field px-3 text-small font-medium transition-colors duration-fast lg:h-10",
                      /* Touch: pressing flashes the brand blue, like the site menu */
                      "[-webkit-tap-highlight-color:transparent] active:bg-accent active:text-on-accent",
                      active ? "text-text" : "text-muted hover:bg-surface-2/60 hover:text-text",
                    )}
                  >
                    {/* Highlight glides to the new section; brand-tinted with an accent edge */}
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        transition={transition.base}
                        aria-hidden
                        className="absolute inset-0 rounded-field tint-accent before:absolute before:inset-y-2.5 before:left-0 before:w-0.75 before:rounded-pill before:bg-accent"
                      />
                    )}
                    <Icon aria-hidden className={cn("relative size-[1.125rem]", active && "text-accent-text")} />
                    <span className="relative">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </LayoutGroup>
      </nav>
    </div>
  );
}
