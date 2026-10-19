"use client";

import * as Menu from "@radix-ui/react-dropdown-menu";
import { Activity, ArrowLeftRight, Bell, Coins, ShieldCheck, type LucideIcon } from "lucide-react";
import { useMemo } from "react";
import { Link } from "@/components/Link";
import { DropdownContent } from "@/design-system";
import { cn } from "@/lib/cn";
import {
  buildNotifications,
  notificationTime,
  useNotificationReads,
  type AppNotification,
  type NotificationCategory,
} from "@/lib/notifications";
import { usePortfolio } from "@/lib/portfolio";
import { TONE_CHIP, type Tone } from "./tones";

export const CATEGORY_ICONS: Record<NotificationCategory, LucideIcon> = {
  rewards: Coins,
  activity: ArrowLeftRight,
  security: ShieldCheck,
  network: Activity,
};

const CATEGORY_TONES: Record<NotificationCategory, Tone> = {
  rewards: "amber",
  activity: "blue",
  security: "rose",
  network: "teal",
};

/** Notifications for the signed-in account with read state. Must render inside PortfolioProvider. */
export function useNotifications() {
  const { state, rewards } = usePortfolio();
  const { read, markRead, markAllRead } = useNotificationReads();
  const items = useMemo(() => buildNotifications(state, rewards), [state, rewards]);
  const unread = items.filter((n) => !read.has(n.id));
  return { items, unread, read, markRead, markAllRead: () => markAllRead(items.map((n) => n.id)) };
}

/** One notification: category icon, title, body and time. Unread rows carry a dot and a bolder title. */
export function NotificationRow({
  item,
  unread,
  compact = false,
  dot = true,
}: {
  item: AppNotification;
  unread: boolean;
  compact?: boolean;
  /** Off when the parent shows the unread dot itself */
  dot?: boolean;
}) {
  const Icon = CATEGORY_ICONS[item.category];
  return (
    <span className="flex w-full gap-3 text-left">
      <span
        aria-hidden
        className={cn(
          "grid shrink-0 place-items-center rounded-pill",
          compact ? "size-8" : "size-10",
          item.category === "security" && unread
            ? "tint-warning text-warning"
            : TONE_CHIP[CATEGORY_TONES[item.category]],
        )}
      >
        <Icon className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-3">
          <span className={cn("text-small", unread ? "font-semibold text-text" : "font-medium text-text")}>
            {item.title}
          </span>
          {unread && dot && (
            <>
              <span aria-hidden className="mt-1.5 size-2 shrink-0 rounded-pill bg-accent" />
              <span className="sr-only">Unread</span>
            </>
          )}
        </span>
        <span className={cn("mt-0.5 block text-small text-muted", compact && "line-clamp-2")}>{item.body}</span>
        <span className="mt-1 block text-caption text-muted">{notificationTime(item.at)}</span>
      </span>
    </span>
  );
}

/** Bell in the dashboard top bar: unread count, the latest few notifications, and a link to all of them. */
export function NotificationsMenu() {
  const { items, unread, read, markRead, markAllRead } = useNotifications();
  const latest = items.slice(0, 5);

  return (
    <Menu.Root modal={false}>
      <Menu.Trigger
        aria-label={unread.length ? `Notifications, ${unread.length} unread` : "Notifications"}
        className="relative grid size-10 place-items-center rounded-field text-text transition-colors duration-fast hover:bg-surface-2 data-[state=open]:bg-surface-2"
      >
        <Bell aria-hidden className="size-5" />
        {unread.length > 0 && (
          <span
            aria-hidden
            className="absolute top-1.5 right-1.5 grid h-4 min-w-4 place-items-center rounded-pill bg-accent px-1 font-mono text-caption leading-none text-on-accent"
          >
            {unread.length > 9 ? "9+" : unread.length}
          </span>
        )}
      </Menu.Trigger>
      <DropdownContent align="end" className="w-[min(24rem,calc(100vw-2rem))] p-0">
        <div className="flex items-center justify-between gap-4 border-b border-rule px-4 py-3">
          <Menu.Label className="text-small font-medium">Notifications</Menu.Label>
          {unread.length > 0 && (
            <Menu.Item
              onSelect={(e) => {
                e.preventDefault();
                markAllRead();
              }}
              className="cursor-default rounded-sm text-caption font-medium text-accent-text outline-none data-highlighted:underline"
            >
              Mark all as read
            </Menu.Item>
          )}
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-1">
          {latest.map((n) => (
            <Menu.Item key={n.id} asChild onSelect={() => markRead(n.id)}>
              <Link
                href={n.href ?? "/dashboard/notifications"}
                className="block rounded-sm px-3 py-3 outline-none data-highlighted:bg-surface-2"
              >
                <NotificationRow item={n} unread={!read.has(n.id)} compact />
              </Link>
            </Menu.Item>
          ))}
        </div>
        <div className="border-t border-rule p-1">
          <Menu.Item asChild>
            <Link
              href="/dashboard/notifications"
              className="block rounded-sm px-3 py-2.5 text-center text-small font-medium text-accent-text outline-none data-highlighted:bg-surface-2"
            >
              See all notifications
            </Link>
          </Menu.Item>
        </div>
      </DropdownContent>
    </Menu.Root>
  );
}
