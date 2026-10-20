"use client";

import { Compass, LayoutDashboard, LogOut, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
/* Direct imports: this ships with the site header, so it must not pull in the whole design system */
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownTrigger,
} from "@/design-system/components/Dropdown";
import { useToast } from "@/design-system/components/Toast";
import type { Session } from "@/lib/auth";
import { restartTour } from "../dashboard/tour";

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
  const pathname = usePathname();
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
        {/* Replays the first-visit tour of the overview (opens the overview first when elsewhere) */}
        {pathname.startsWith("/dashboard") && (
          <DropdownItem
            icon={<Compass aria-hidden />}
            onSelect={() => {
              restartTour();
              if (pathname !== "/dashboard") router.push("/dashboard");
            }}
          >
            Take the tour
          </DropdownItem>
        )}
        <DropdownSeparator />
        <DropdownItem
          icon={<LogOut aria-hidden />}
          tone="danger"
          onSelect={() => {
            onSignOut();
            toast({
              tone: "info",
              title: "Logged out",
              description: "You’ve been logged out on this device.",
            });
          }}
        >
          Log out
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
}
