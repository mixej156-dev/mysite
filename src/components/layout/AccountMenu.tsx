"use client";

import { LayoutDashboard, LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownTrigger,
  useToast,
} from "@/design-system";
import type { Session } from "@/lib/auth";

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AccountMenu({ session, onSignOut }: { session: Session; onSignOut: () => void }) {
  const router = useRouter();
  const { toast } = useToast();

  return (
    <Dropdown>
      <DropdownTrigger
        aria-label={`Account menu for ${session.name}`}
        className="grid size-9 place-items-center rounded-field tint-accent text-caption font-semibold text-accent-text transition-colors duration-fast hover:bg-surface-2"
      >
        {initials(session.name)}
      </DropdownTrigger>
      <DropdownContent align="end" className="min-w-56">
        <DropdownLabel>
          <span className="block text-small font-medium text-text">{session.name}</span>
          <span className="block truncate">{session.email}</span>
        </DropdownLabel>
        <DropdownSeparator />
        <DropdownItem icon={<LayoutDashboard aria-hidden />} onSelect={() => router.push("/dashboard")}>
          Dashboard
        </DropdownItem>
        <DropdownItem icon={<Settings aria-hidden />} onSelect={() => router.push("/dashboard/settings")}>
          Settings
        </DropdownItem>
        <DropdownSeparator />
        <DropdownItem
          icon={<LogOut aria-hidden />}
          tone="danger"
          onSelect={() => {
            onSignOut();
            toast({
              tone: "info",
              title: "Logged out",
              description: "The demo session was cleared from this browser.",
            });
          }}
        >
          Log out
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
}
