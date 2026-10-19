"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu, Moon, Plus, Sun, X } from "lucide-react";
import { useState } from "react";
import { Link } from "@/components/Link";
import { buttonClasses, useDashboardTheme } from "@/design-system";
import { useAuth } from "@/lib/auth";
import { AccountMenu } from "../layout/AccountMenu";
import { Logo } from "../layout/Logo";
import { NotificationsMenu } from "./notifications";
import { Sidebar } from "./Sidebar";

/** Light / dark switch for the dashboard; the icon turns as the theme flips. Settings also offer "System". */
function ThemeToggle() {
  const { theme, setPreference } = useDashboardTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={() => setPreference(dark ? "light" : "dark")}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className="relative grid size-10 place-items-center overflow-hidden rounded-field text-text transition-colors duration-fast hover:bg-surface-2"
    >
      <Sun
        aria-hidden
        className="absolute size-5 transition-[rotate,scale,opacity] duration-slow ease-brand dark:scale-50 dark:-rotate-90 dark:opacity-0"
      />
      <Moon
        aria-hidden
        className="absolute size-5 scale-50 rotate-90 opacity-0 transition-[rotate,scale,opacity] duration-slow ease-brand dark:scale-100 dark:rotate-0 dark:opacity-100"
      />
    </button>
  );
}

export function Topbar() {
  const { session, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header
      data-enter-scope="bar"
      className="sticky top-0 z-header flex h-14 items-center gap-2 border-b border-rule bg-bg/90 pr-4 pl-1.5 backdrop-blur-md sm:h-16 sm:gap-3 sm:px-6 lg:px-7"
    >
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger
          aria-label="Open navigation"
          className="grid size-10 place-items-center rounded-field text-text transition-colors duration-fast hover:bg-surface-2 lg:hidden"
        >
          <Menu aria-hidden className="size-5" />
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-overlay bg-scrim data-[state=open]:animate-fade-in lg:hidden" />
          <Dialog.Content
            aria-describedby={undefined}
            data-enter-scope="nav"
            className="fixed inset-y-0 left-0 z-modal w-72 max-w-[85vw] border-r border-rule bg-bg text-text shadow-overlay outline-none data-[state=open]:animate-fade-in lg:hidden"
          >
            <Dialog.Title className="sr-only">Dashboard navigation</Dialog.Title>
            <Dialog.Close
              aria-label="Close navigation"
              className="absolute top-4 right-3 grid size-9 place-items-center rounded-field text-muted hover:bg-surface-2 hover:text-text"
            >
              <X aria-hidden className="size-5" />
            </Dialog.Close>
            <Sidebar onNavigate={() => setOpen(false)} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Link href="/dashboard" aria-label="Dashboard home" data-enter className="rounded-sm lg:hidden">
        <Logo />
      </Link>

      <div data-enter className="ml-auto flex items-center gap-1.5">
        <Link href="/dashboard/stake" className={buttonClasses({ size: "sm", className: "max-sm:hidden" })}>
          <Plus aria-hidden />
          New stake
        </Link>
        <ThemeToggle />
        <NotificationsMenu />
        {session && <AccountMenu session={session} onSignOut={signOut} />}
      </div>
    </header>
  );
}
