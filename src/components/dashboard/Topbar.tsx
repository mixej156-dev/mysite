"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu, Plus, X } from "lucide-react";
import { useState } from "react";
import { Link } from "@/components/Link";
import { Badge, buttonClasses } from "@/design-system";
import { useAuth } from "@/lib/auth";
import { AccountMenu } from "../layout/AccountMenu";
import { Logo } from "../layout/Logo";
import { Sidebar } from "./Sidebar";

export function Topbar() {
  const { session, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-header flex h-16 items-center gap-3 border-b border-rule bg-bg/90 px-4 backdrop-blur-md sm:px-6 lg:px-10">
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger
          aria-label="Open navigation"
          className="grid size-10 place-items-center rounded-pill text-text transition-colors duration-fast hover:bg-surface-2 lg:hidden"
        >
          <Menu aria-hidden className="size-5" />
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-overlay bg-scrim data-[state=open]:animate-fade-in lg:hidden" />
          <Dialog.Content
            aria-describedby={undefined}
            className="fixed inset-y-0 left-0 z-modal w-72 max-w-[85vw] border-r border-rule bg-bg text-text shadow-overlay outline-none data-[state=open]:animate-fade-in lg:hidden"
          >
            <Dialog.Title className="sr-only">Dashboard navigation</Dialog.Title>
            <Dialog.Close
              aria-label="Close navigation"
              className="absolute top-4 right-3 grid size-9 place-items-center rounded-pill text-muted hover:bg-surface-2 hover:text-text"
            >
              <X aria-hidden className="size-5" />
            </Dialog.Close>
            <Sidebar onNavigate={() => setOpen(false)} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Link href="/dashboard" aria-label="Dashboard home" className="rounded-sm lg:hidden">
        <Logo />
      </Link>
      <Badge tone="warning" className="max-sm:hidden">
        Demo data
      </Badge>

      <div className="ml-auto flex items-center gap-1.5">
        <Link href="/dashboard/stake" className={buttonClasses({ size: "sm", className: "max-sm:hidden" })}>
          <Plus aria-hidden />
          New stake
        </Link>
        {session && <AccountMenu session={session} onSignOut={signOut} />}
      </div>
    </header>
  );
}
