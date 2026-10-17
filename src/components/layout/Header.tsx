"use client";

import * as Nav from "@radix-ui/react-navigation-menu";
import { Link } from "@/components/Link";
import { useEffect, useState } from "react";
import { buttonClasses } from "@/design-system";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/cn";
import { AccountMenu } from "./AccountMenu";
import { Logo } from "./Logo";
import { MegaMenu } from "./MegaMenu";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { session, status, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="container-page sticky top-0 z-header pt-3 [view-transition-name:site-header]">
      <Nav.Root
        aria-label="Main"
        delayDuration={120}
        onValueChange={(value) => setMenuOpen(value !== "")}
        data-scrolled={scrolled || menuOpen || undefined}
        className={cn(
          // Negative margin = left padding, so the logo lines up with the page content edge
          "relative -mx-3 flex h-14 items-center gap-2 rounded-field border border-transparent pr-2 pl-3 sm:-mx-4 sm:pl-4",
          "transition-[background-color,border-color,box-shadow] duration-base",
          "data-scrolled:border-rule data-scrolled:bg-surface data-scrolled:shadow-float",
        )}
      >
        <Link href="/" aria-label="LONAR ECO. home" className="mr-auto rounded-sm lg:mr-6">
          <Logo />
        </Link>

        <MegaMenu className="max-lg:hidden" />

        <div className="ml-auto flex items-center gap-1">
          {status === "loading" && (
            /* Holds the space of the guest buttons so nothing jumps once the session is read */
            <span aria-hidden className="h-10 w-48 max-sm:hidden" />
          )}
          {status === "guest" && (
            <>
              <Link href="/login" className={buttonClasses({ variant: "ghost", className: "max-sm:hidden" })}>
                Log in
              </Link>
              <Link href="/register" className={buttonClasses({ className: "max-sm:hidden" })}>
                Start staking
              </Link>
            </>
          )}
          {status === "authed" && session && (
            <>
              <Link href="/dashboard" className={buttonClasses({ className: "max-sm:hidden" })}>
                Dashboard
              </Link>
              <span className="max-lg:hidden">
                <AccountMenu session={session} onSignOut={signOut} />
              </span>
            </>
          )}
          <MobileMenu />
        </div>

        <div className="absolute inset-x-0 top-full flex justify-center pt-2">
          <Nav.Viewport
            className={cn(
              "w-full overflow-hidden rounded-card border border-rule bg-surface text-text shadow-overlay",
              "h-(--radix-navigation-menu-viewport-height) origin-top transition-[height] duration-base",
              "data-[state=open]:animate-pop-in data-[state=closed]:hidden",
            )}
          />
        </div>
      </Nav.Root>
    </header>
  );
}
