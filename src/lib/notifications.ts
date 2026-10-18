"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { PortfolioState } from "@/data/portfolio";
import { getPool } from "@/data/pools";
import { INCIDENTS } from "@/data/validators";
import { formatDate, formatNumber } from "@/lib/format";
import type { RewardEntry } from "@/lib/portfolio";
import { DEMO_TODAY, addDays } from "@/lib/series";

export type NotificationCategory = "rewards" | "activity" | "security" | "network";

export type AppNotification = {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  /** ISO date-time */
  at: string;
  href?: string;
  cta?: string;
};

export const CATEGORY_LABELS: Record<NotificationCategory, string> = {
  rewards: "Rewards",
  activity: "Positions & wallet",
  security: "Security",
  network: "Network & product",
};

const amount = (value: number, ticker: string) =>
  `${formatNumber(value, value >= 100 ? 2 : value >= 1 ? 3 : 4)} ${ticker}`;

/**
 * In-app notifications derived from the account: daily payouts, unbonding, wallet activity, security prompts,
 * incidents on networks the account holds, and product news. Newest first.
 */
export function buildNotifications(state: PortfolioState, rewards: RewardEntry[]): AppNotification[] {
  const list: AppNotification[] = [];

  /* Last three daily payouts, one notification per day */
  const byDay = new Map<string, Map<string, number>>();
  for (const r of rewards) {
    const day = byDay.get(r.date) ?? new Map<string, number>();
    day.set(r.ticker, (day.get(r.ticker) ?? 0) + r.amount);
    byDay.set(r.date, day);
  }
  [...byDay.keys()]
    .sort()
    .slice(-3)
    .forEach((date) => {
      const parts = [...(byDay.get(date) ?? new Map()).entries()].map(([t, v]) => `+${amount(v, t)}`);
      list.push({
        id: `payout-${date}`,
        category: "rewards",
        title: "Daily payout received",
        body: parts.join(", "),
        at: `${addDays(date, 1)}T00:05:00Z`,
        href: "/dashboard/rewards",
        cta: "View rewards",
      });
    });

  for (const p of state.positions) {
    const pool = getPool(p.poolId);
    if (!pool || p.status !== "unbonding" || !p.unbondingSince || !p.unlockAt) continue;
    list.push({
      id: `unbonding-${p.id}-${p.unbondingSince}`,
      category: "activity",
      title: `Unbonding started: ${pool.name}`,
      body: `${amount(p.amount, pool.ticker)} stops earning and unlocks on ${formatDate(p.unlockAt)}.`,
      at: `${p.unbondingSince}T09:00:00Z`,
      href: "/dashboard/positions",
      cta: "View position",
    });
  }

  state.activity
    .filter((t) => t.type === "deposit" || t.type === "withdraw")
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)
    .forEach((t) => {
      const deposit = t.type === "deposit";
      list.push({
        id: `tx-${t.id}`,
        category: "activity",
        title: deposit ? "Deposit confirmed" : t.status === "pending" ? "Withdrawal on its way" : "Withdrawal sent",
        body: `${deposit ? "+" : "−"}${amount(t.amount, t.ticker)} ${deposit ? "is in your wallet" : "left your wallet"}.`,
        at: t.date,
        href: "/dashboard/transactions",
        cta: "View transaction",
      });
    });

  if (!state.prefs.twoFactor) {
    list.push({
      id: "security-2fa-off",
      category: "security",
      title: "Turn on two-factor authentication",
      body: "It’s required for withdrawals and protects your account if your password leaks.",
      at: `${DEMO_TODAY}T08:00:00Z`,
      href: "/dashboard/settings",
      cta: "Set it up",
    });
  }
  list.push({
    id: `security-signin-${DEMO_TODAY}`,
    category: "security",
    title: "New sign-in",
    body: "This browser signed in to your account. If it wasn’t you, change your password now.",
    at: `${DEMO_TODAY}T07:42:00Z`,
    href: "/dashboard/settings",
    cta: "Review devices",
  });

  /* Incidents in the last 30 days on networks this account has stake in */
  const held = new Set(state.positions.map((p) => p.poolId));
  INCIDENTS.filter((i) => held.has(i.poolId) && i.date >= addDays(DEMO_TODAY, -30)).forEach((i) => {
    const pool = getPool(i.poolId);
    list.push({
      id: `incident-${i.poolId}-${i.date}`,
      category: "network",
      title: `${pool?.name ?? i.poolId}: incident review published`,
      body: `${i.title}, ${i.durationMinutes} min. ${i.impact.split(". ").pop()}`,
      at: `${addDays(i.date, 1)}T14:00:00Z`,
      href: "/validators",
      cta: "Read the review",
    });
  });

  list.push({
    id: "product-daily-payouts",
    category: "network",
    title: "Daily payouts on every pool",
    body: "Polkadot and Avalanche now pay out daily, like every other pool. Nothing changes in how rewards are calculated.",
    at: "2026-09-18T10:00:00Z",
    href: "/blog/daily-payouts-now-default",
    cta: "Read the update",
  });

  return list.sort((a, b) => b.at.localeCompare(a.at));
}

/** "Today, 08:00", "Yesterday, 14:00" or "Oct 9", relative to the dashboard's fixed today. */
export function notificationTime(at: string): string {
  const date = at.slice(0, 10);
  const time = at.slice(11, 16);
  if (date === DEMO_TODAY) return `Today, ${time}`;
  if (date === addDays(DEMO_TODAY, -1)) return `Yesterday, ${time}`;
  return formatDate(date);
}

/* Read state per notification id, kept in this browser */
const READ_KEY = "notifications_read";
const listeners = new Set<() => void>();

function readRaw(): string {
  try {
    return localStorage.getItem(READ_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function writeIds(ids: string[]) {
  try {
    localStorage.setItem(READ_KEY, JSON.stringify([...new Set(ids)]));
  } catch {
    // Storage blocked: read state lasts for this page view only
  }
  listeners.forEach((l) => l());
}

export function useNotificationReads() {
  const raw = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    readRaw,
    () => "[]",
  );
  const read = useMemo(() => {
    try {
      return new Set(JSON.parse(raw) as string[]);
    } catch {
      return new Set<string>();
    }
  }, [raw]);
  const markRead = useCallback((id: string) => writeIds([...JSON.parse(readRaw()), id]), []);
  const markAllRead = useCallback((ids: string[]) => writeIds([...JSON.parse(readRaw()), ...ids]), []);
  return { read, markRead, markAllRead };
}
