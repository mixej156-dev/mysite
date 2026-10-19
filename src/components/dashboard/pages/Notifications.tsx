"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "@/components/Link";
import { Button, Tag } from "@/design-system";
import { cn } from "@/lib/cn";
import { CATEGORY_LABELS, type NotificationCategory } from "@/lib/notifications";
import { DEMO_TODAY, addDays } from "@/lib/series";
import { EmptyState } from "../../blocks/EmptyState";
import { NotificationRow, useNotifications } from "../notifications";
import { PageTitle } from "../PageTitle";

type Filter = "all" | "unread" | NotificationCategory;

function groupLabel(date: string) {
  if (date === DEMO_TODAY) return "Today";
  if (date === addDays(DEMO_TODAY, -1)) return "Yesterday";
  if (date >= addDays(DEMO_TODAY, -7)) return "This week";
  return "Earlier";
}

export function Notifications() {
  const { items, unread, read, markRead, markAllRead } = useNotifications();
  const [filter, setFilter] = useState<Filter>("all");

  const shown = items.filter((n) =>
    filter === "all" ? true : filter === "unread" ? !read.has(n.id) : n.category === filter,
  );
  const groups = shown.reduce<{ label: string; items: typeof shown }[]>((acc, n) => {
    const label = groupLabel(n.at.slice(0, 10));
    const last = acc[acc.length - 1];
    if (last?.label === label) last.items.push(n);
    else acc.push({ label, items: [n] });
    return acc;
  }, []);

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "All", count: items.length },
    { id: "unread", label: "Unread", count: unread.length },
    ...(Object.keys(CATEGORY_LABELS) as NotificationCategory[]).map((c) => ({
      id: c,
      label: CATEGORY_LABELS[c],
      count: items.filter((n) => n.category === c).length,
    })),
  ];

  return (
    <>
      <PageTitle
        title="Notifications"
        lead="Payouts, unbonding, wallet activity, security prompts and incidents on networks you stake on. Email preferences are in Settings."
        actions={
          <Button variant="secondary" onClick={markAllRead} disabled={unread.length === 0}>
            Mark all as read
          </Button>
        }
      />

      <div role="group" aria-label="Filter notifications" data-enter className="mb-8 flex flex-wrap gap-2">
        {filters.map((f) => (
          <Tag key={f.id} selected={filter === f.id} onClick={() => setFilter(f.id)} count={f.count}>
            {f.label}
          </Tag>
        ))}
      </div>

      {shown.length === 0 ? (
        <EmptyState
          art="notifications"
          title={filter === "unread" ? "You’re all caught up" : "Nothing here yet"}
          body={
            filter === "unread" ? "New notifications will appear here." : "Notifications of this kind will appear here."
          }
          action={
            <Button variant="secondary" onClick={() => setFilter("all")}>
              Show all
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-8">
          {groups.map((g) => (
            <section key={g.label} aria-labelledby={`notif-${g.label}`} data-enter>
              <h2 id={`notif-${g.label}`} className="mb-3 text-caption font-medium text-muted">
                {g.label}
              </h2>
              <ul className="divide-y divide-rule overflow-hidden rounded-card border border-rule bg-surface">
                {g.items.map((n) => {
                  const isUnread = !read.has(n.id);
                  return (
                    <li
                      key={n.id}
                      className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 md:p-5"
                    >
                      <div className="min-w-0 flex-1">
                        <NotificationRow item={n} unread={isUnread} dot={false} />
                      </div>
                      {/* Fixed columns so the dot, "Mark as read" and the link line up from row to row */}
                      <div className="flex shrink-0 items-center gap-4 pl-13 sm:pl-0">
                        <span
                          aria-hidden
                          className={cn("size-2 shrink-0 rounded-pill", isUnread ? "bg-accent" : "bg-transparent")}
                        />
                        {isUnread && <span className="sr-only">Unread</span>}
                        <button
                          type="button"
                          onClick={() => markRead(n.id)}
                          disabled={!isUnread}
                          aria-hidden={!isUnread}
                          className={cn(
                            "rounded-sm text-small leading-5 whitespace-nowrap text-muted transition-colors duration-fast hover:text-text",
                            !isUnread && "invisible",
                          )}
                        >
                          Mark as read
                        </button>
                        <span className="sm:w-36">
                          {n.href && (
                            <Link
                              href={n.href}
                              onClick={() => markRead(n.id)}
                              className="inline-flex items-center gap-1 rounded-sm text-small leading-5 font-medium text-accent-text hover:underline"
                            >
                              {n.cta ?? "Open"}
                              <ArrowRight aria-hidden className="size-4" />
                            </Link>
                          )}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
