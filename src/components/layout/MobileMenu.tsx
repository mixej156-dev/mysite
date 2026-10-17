"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link } from "@/components/Link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { buttonClasses } from "@/design-system";
import { transition } from "@/design-system/motion";
import { featuredPools } from "@/data/pools";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/cn";
import { formatPercent } from "@/lib/format";
import { Logo } from "./Logo";
import { NAV_SECTIONS, isSectionActive, type NavLink } from "./nav";
import { ThemeToggle } from "./ThemeToggle";

const iconButton =
  "grid size-10 place-items-center rounded-pill text-text transition-colors duration-fast hover:bg-surface-2";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const { session, status, signOut } = useAuth();

  const close = () => setOpen(false);

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    // Start with the current section expanded
    if (next) setExpanded(NAV_SECTIONS.find((s) => isSectionActive(s, pathname))?.id ?? null);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger aria-label="Open menu" className={cn(iconButton, "lg:hidden")}>
        <Menu aria-hidden className="size-5" />
      </Dialog.Trigger>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            {/* Overlay carries Radix's body scroll lock; the panel itself covers it */}
            <Dialog.Overlay forceMount className="fixed inset-0 z-modal lg:hidden" />
            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <motion.div
                className="fixed inset-0 z-modal flex flex-col overflow-y-auto overscroll-contain bg-bg text-text lg:hidden"
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={transition.base}
              >
                <Dialog.Title className="sr-only">Menu</Dialog.Title>
                <div className="container-page flex h-[4.25rem] shrink-0 items-end">
                  <div className="-mx-3 flex h-14 flex-1 items-center justify-between pr-2 pl-3 sm:-mx-4 sm:pl-4">
                    <Link href="/" onClick={close} aria-label="{BRAND_NAME} home" className="rounded-sm">
                      <Logo />
                    </Link>
                    <Dialog.Close aria-label="Close menu" className={iconButton}>
                      <X aria-hidden className="size-5" />
                    </Dialog.Close>
                  </div>
                </div>

                <nav aria-label="Main" className="container-page flex-1 pt-8">
                  <ul className="border-t border-rule">
                    {NAV_SECTIONS.map((section) => {
                      const isOpen = expanded === section.id;
                      const links: NavLink[] =
                        section.id === "staking"
                          ? [
                              ...featuredPools.map((pool) => ({
                                label: pool.name,
                                href: `/staking/${pool.id}`,
                                description: `${formatPercent(pool.apy)} APY`,
                              })),
                              ...section.links,
                            ]
                          : section.links;
                      return (
                        <li key={section.id} className="border-b border-rule">
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            aria-controls={`mobile-${section.id}`}
                            onClick={() => setExpanded(isOpen ? null : section.id)}
                            className="flex w-full items-center justify-between py-4 text-left text-h4 font-medium"
                          >
                            {section.label}
                            <ChevronDown
                              aria-hidden
                              className={cn(
                                "size-5 text-muted transition-transform duration-base",
                                isOpen && "rotate-180",
                              )}
                            />
                          </button>
                          <ul id={`mobile-${section.id}`} hidden={!isOpen} className="flex flex-col pb-4">
                            {links.map((link) => (
                              <li key={link.href}>
                                <Link
                                  href={link.href}
                                  onClick={close}
                                  aria-current={pathname === link.href ? "page" : undefined}
                                  className="flex items-baseline justify-between gap-4 py-2.5 text-body text-muted transition-colors duration-fast hover:text-text aria-[current=page]:text-text"
                                >
                                  {link.label}
                                  {section.id === "staking" && link.description && (
                                    <span className="font-mono text-small">{link.description}</span>
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                <div className="container-page flex flex-col gap-3 pt-8 pb-8">
                  <div className="flex items-center justify-between">
                    <span className="text-small text-muted">Theme</span>
                    <ThemeToggle />
                  </div>
                  {status === "authed" && session ? (
                    <>
                      <p className="border-t border-rule pt-4 text-small">
                        <span className="block font-medium">{session.name}</span>
                        <span className="block text-muted">{session.email}</span>
                      </p>
                      <Link href="/dashboard" onClick={close} className={buttonClasses({ size: "lg" })}>
                        Dashboard
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          signOut();
                          close();
                        }}
                        className={buttonClasses({ variant: "secondary", size: "lg" })}
                      >
                        Log out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={close}
                        className={buttonClasses({ variant: "secondary", size: "lg" })}
                      >
                        Log in
                      </Link>
                      <Link href="/register" onClick={close} className={buttonClasses({ size: "lg" })}>
                        Start staking
                      </Link>
                    </>
                  )}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
