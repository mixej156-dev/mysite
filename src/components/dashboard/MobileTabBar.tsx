"use client";

import { usePathname } from "next/navigation";
import { Link } from "@/components/Link";
import { cn } from "@/lib/cn";
import { MOBILE_TABS, isNavActive } from "./nav";

/**
 * Bottom tab bar on phones and tablets: the five sections used most, one thumb away. The rest of the
 * navigation stays in the menu sheet. Sits above the home indicator via the safe-area inset.
 */
export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Dashboard shortcuts"
      className="fixed inset-x-0 bottom-0 z-sticky border-t border-rule bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <ul className="mx-auto grid h-16 max-w-xl grid-cols-5 px-2">
        {MOBILE_TABS.map(({ href, label, icon: Icon }) => {
          const active = isNavActive(href, pathname);
          return (
            <li key={href} className="flex">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "my-1.5 flex flex-1 flex-col items-center justify-center gap-1 rounded-field text-caption font-medium",
                  "transition-colors duration-fast [-webkit-tap-highlight-color:transparent]",
                  "active:bg-accent active:text-on-accent",
                  active ? "text-accent-text" : "text-muted",
                )}
              >
                <Icon aria-hidden className="size-5" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
