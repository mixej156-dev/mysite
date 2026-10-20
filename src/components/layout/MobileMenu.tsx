"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, m, useDragControls, useReducedMotion, type PanInfo } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link } from "@/components/Link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { buttonClasses } from "@/design-system/components/Button";
import { transition } from "@/design-system/motion";
import { featuredPools } from "@/data/pools";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/cn";
import { formatPercent } from "@/lib/format";
import { MenuIcon, PoolMenuIcon } from "./MenuIcon";
import { NAV_SECTIONS, type NavLink } from "./nav";

const iconButton =
  "grid size-10 place-items-center rounded-field text-text transition-colors duration-fast hover:bg-surface-2";

/*
 * Rows bleed into the gutter (-mx-3 px-3) so the pressed highlight has room while the text stays on the
 * content edge. Pressing flashes the brand blue; the grey system tap flash is turned off.
 */
const pressedPrimary = "[-webkit-tap-highlight-color:transparent] active:bg-accent-hover";
const pressedButton =
  "[-webkit-tap-highlight-color:transparent] active:border-accent active:bg-accent active:text-on-accent";

const pressable =
  "-mx-3 rounded-field px-3 transition-colors duration-fast [-webkit-tap-highlight-color:transparent] active:bg-accent active:text-on-accent";

/* Pull the sheet down this far, or flick it, to close */
const CLOSE_OFFSET = 96;
const CLOSE_VELOCITY = 500;

/* Every section's links in one list; Staking leads with the featured pools and their APY */
const SECTIONS = NAV_SECTIONS.map((section) => ({
  ...section,
  links: (section.id === "staking"
    ? [
        ...featuredPools.map((pool) => ({
          label: pool.name,
          href: `/staking/${pool.id}`,
          figure: `${formatPercent(pool.apy)} APY`,
          poolId: pool.id,
        })),
        ...section.links,
      ]
    : section.links) as (NavLink & { figure?: string; poolId?: string })[],
}));

/**
 * Phones and tablets: a sheet that slides up from the bottom over the blurred page, sized to its content (up to
 * 85% of the screen, then it scrolls). All menu links are listed under their section names, no accordions.
 * Close with the cross, a tap outside, Esc, or by pulling the handle down.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const drag = useDragControls();
  const { session, status, signOut } = useAuth();

  const close = () => setOpen(false);
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > CLOSE_OFFSET || info.velocity.y > CLOSE_VELOCITY) close();
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger aria-label="Open menu" className={cn(iconButton, "lg:hidden")}>
        <Menu aria-hidden className="size-5" />
      </Dialog.Trigger>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <m.div
                className="fixed inset-0 z-overlay bg-scrim/60 backdrop-blur-md lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={transition.base}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <m.div
                className={cn(
                  "fixed inset-x-0 bottom-0 z-modal mx-auto flex max-h-[85dvh] w-full max-w-xl flex-col",
                  "rounded-t-card border border-b-0 border-rule bg-surface text-text shadow-overlay outline-none lg:hidden",
                )}
                initial={reduceMotion ? { opacity: 0 } : { y: "100%" }}
                animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { y: "100%" }}
                transition={reduceMotion ? transition.base : { type: "spring", damping: 34, stiffness: 340 }}
                drag={reduceMotion ? false : "y"}
                dragControls={drag}
                dragListener={false}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0, bottom: 0.6 }}
                onDragEnd={onDragEnd}
              >
                <Dialog.Title className="sr-only">Menu</Dialog.Title>
                {/* Handle: the part you pull down to close */}
                <div
                  onPointerDown={(e) => drag.start(e)}
                  className="flex shrink-0 cursor-grab touch-none items-center justify-between px-5 pt-2 pb-1 sm:px-6"
                >
                  <span className="size-10" />
                  <span aria-hidden className="h-1.5 w-10 rounded-pill bg-rule-strong" />
                  <Dialog.Close aria-label="Close menu" className={cn(iconButton, "-mr-2")}>
                    <X aria-hidden className="size-5" />
                  </Dialog.Close>
                </div>

                {/* Icons act out their meaning as the sheet opens (no hover on touch screens) */}
                <nav
                  aria-label="Main"
                  data-menu-play
                  className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-4 sm:px-6"
                >
                  {SECTIONS.map((section) => (
                    <section key={section.id} aria-labelledby={`mobile-${section.id}`} className="pt-3 first:pt-0">
                      <h2 id={`mobile-${section.id}`} className="pb-1 text-caption text-muted">
                        {section.label}
                      </h2>
                      <ul className="grid sm:grid-cols-2 sm:gap-x-8">
                        {section.links.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              onClick={close}
                              aria-current={pathname === link.href ? "page" : undefined}
                              className={cn(
                                "group/link flex min-h-11 items-center gap-3 py-1.5 text-body aria-[current=page]:font-medium",
                                pressable,
                              )}
                            >
                              {link.poolId ? (
                                <PoolMenuIcon poolId={link.poolId} />
                              ) : (
                                link.icon && <MenuIcon icon={link.icon} tone={link.tone ?? "blue"} />
                              )}
                              <span className="min-w-0 flex-1">{link.label}</span>
                              {link.figure && (
                                <span className="font-mono text-small text-muted group-active/link:text-on-accent">
                                  {link.figure}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </nav>

                <div className="flex shrink-0 flex-col gap-3 border-t border-rule px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
                  {status === "authed" && session ? (
                    <>
                      <p className="text-small">
                        <span className="font-medium">{session.name}</span>{" "}
                        <span className="text-muted">{session.email}</span>
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            signOut();
                            close();
                          }}
                          className={buttonClasses({ variant: "secondary", size: "lg", className: pressedButton })}
                        >
                          Log out
                        </button>
                        <Link
                          href="/dashboard"
                          onClick={close}
                          className={buttonClasses({ size: "lg", className: pressedPrimary })}
                        >
                          Dashboard
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        href="/login"
                        onClick={close}
                        className={buttonClasses({ variant: "secondary", size: "lg", className: pressedButton })}
                      >
                        Log in
                      </Link>
                      <Link
                        href="/register"
                        onClick={close}
                        className={buttonClasses({ size: "lg", className: pressedPrimary })}
                      >
                        Start staking
                      </Link>
                    </div>
                  )}
                </div>
              </m.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
