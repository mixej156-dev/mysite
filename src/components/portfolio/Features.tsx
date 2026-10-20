"use client";

import { useReducedMotion } from "framer-motion";
import { Activity, CircleCheck, Coins, LockOpen, ShieldCheck, type LucideIcon } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { getPool } from "@/data/pools";
import { SEED_PORTFOLIO } from "@/data/portfolio";
import { cn } from "@/lib/cn";
import { formatCurrency, formatDate } from "@/lib/format";
import { positionRewards, priceOf } from "@/lib/portfolio";
import { DEMO_TODAY, addDays, daysBetween } from "@/lib/series";
import { CountUp } from "../blocks/CountUp";
import { useInViewOnce } from "../blocks/useInViewOnce";
import { AnimatedNumber } from "../dashboard/AnimatedNumber";
import { IconChip, POOL_TONES, TONE_FILL, type Tone } from "../dashboard/tones";

/*
 * What the dashboard shows, one small working piece each, on the demo account. Each plays when it scrolls in:
 * bars grow, the split fills, days tick off, alerts keep arriving.
 */

const STATE = SEED_PORTFOLIO;

/* Rewards in USD per day, the last two weeks */
const DAYS = 14;
const DAILY = (() => {
  const byDate = new Map<string, number>();
  for (const r of STATE.positions.flatMap(positionRewards))
    byDate.set(r.date, (byDate.get(r.date) ?? 0) + r.amount * priceOf(r.ticker));
  return Array.from({ length: DAYS }, (_, i) => {
    const date = addDays(DEMO_TODAY, i - DAYS);
    return { date, usd: byDate.get(date) ?? 0 };
  });
})();
/* Bars span the range of the fortnight, so day-to-day changes show (a zero baseline would make them all look equal) */
const DAILY_MIN = Math.min(...DAILY.map((d) => d.usd));
const DAILY_MAX = Math.max(...DAILY.map((d) => d.usd));
const barHeight = (usd: number) => 25 + (75 * (usd - DAILY_MIN)) / (DAILY_MAX - DAILY_MIN || 1);

/* Value per network, positions only */
const SPLIT = (() => {
  const rows = STATE.positions.map((p) => {
    const pool = getPool(p.poolId)!;
    return { id: pool.id, name: pool.name, usd: p.amount * priceOf(pool.ticker) };
  });
  const total = rows.reduce((s, r) => s + r.usd, 0);
  return rows.map((r) => ({ ...r, share: (r.usd / total) * 100 })).sort((a, b) => b.share - a.share);
})();
const SPLIT_TOTAL = SPLIT.reduce((s, r) => s + r.usd, 0);

/* The unbonding position: how far through its wait it is */
const UNBONDING = (() => {
  const p = STATE.positions.find((x) => x.status === "unbonding" && x.unbondingSince && x.unlockAt)!;
  const total = daysBetween(p.unbondingSince!, p.unlockAt!);
  const done = daysBetween(p.unbondingSince!, DEMO_TODAY);
  return { pool: getPool(p.poolId)!, amount: p.amount, unlockAt: p.unlockAt!, total, done };
})();

const ALERTS: { icon: LucideIcon; tone: Tone; title: string; body: string }[] = [
  { icon: Coins, tone: "amber", title: "Daily rewards paid", body: "4 positions, recorded per epoch" },
  { icon: LockOpen, tone: "teal", title: "Unbonding finished", body: "300 DOT is back in your wallet" },
  { icon: ShieldCheck, tone: "green", title: "New sign-in", body: "Chrome on macOS, Berlin" },
  { icon: Activity, tone: "rose", title: "Network incident resolved", body: "Solana: missed slots back to normal" },
  { icon: CircleCheck, tone: "blue", title: "Stake confirmed", body: "2.0000 ETH in Ethereum" },
];

function Card({ title, body, children }: { title: string; body: string; children: ReactNode }) {
  return (
    <article className="flex flex-col rounded-card border border-rule bg-surface p-5 sm:p-6">
      <div aria-hidden className="h-44 rounded-field bg-bg p-4">
        {children}
      </div>
      <h3 className="mt-6 text-h4 font-medium">{title}</h3>
      <p className="mt-2 font-serif text-body text-muted">{body}</p>
    </article>
  );
}

function DailyBars({ on }: { on: boolean }) {
  const today = DAILY[DAILY.length - 1];
  return (
    <div className="flex h-full flex-col">
      <p className="flex items-baseline justify-between text-caption text-muted">
        Last 14 days
        <span className="font-mono text-small text-text">
          +$
          <CountUp value={today.usd} decimals={2} />
        </span>
      </p>
      <div className="mt-3 flex min-h-0 flex-1 items-end gap-1.5">
        {DAILY.map((d, i) => (
          <span
            key={d.date}
            className={cn(
              "relative flex-1 origin-bottom rounded-t-sm transition-transform duration-slow ease-brand",
              i === DAILY.length - 1 ? "bg-accent" : "tint-accent",
              on ? "scale-y-100" : "scale-y-0",
            )}
            style={{ height: `${barHeight(d.usd)}%`, transitionDelay: `${i * 45}ms` }}
          >
            {i === DAILY.length - 1 && on && (
              <span className="absolute -top-2.5 left-1/2 size-2 -translate-x-1/2 animate-ping rounded-pill bg-accent" />
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

function Split({ on }: { on: boolean }) {
  return (
    <div className="flex h-full flex-col justify-between">
      <p className="flex items-baseline justify-between text-caption text-muted">
        Staked across {SPLIT.length} networks
        <span className="font-mono text-small text-text">
          {on ? <AnimatedNumber value={SPLIT_TOTAL} format={formatCurrency} /> : formatCurrency(0)}
        </span>
      </p>
      <div className="flex h-3 gap-0.5 overflow-hidden rounded-pill">
        {SPLIT.map((s, i) => (
          <span
            key={s.id}
            className={cn("h-full transition-[width] duration-slow ease-brand", TONE_FILL[POOL_TONES[s.id] ?? "blue"])}
            style={{ width: on ? `${s.share}%` : "0%", transitionDelay: `${i * 120}ms` }}
          />
        ))}
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
        {SPLIT.map((s) => (
          <li key={s.id} className="flex items-center gap-2 text-small">
            {/* eslint-disable-next-line @next/next/no-img-element -- tiny local SVG */}
            <img src={`/logos/networks/${s.id}.svg`} alt="" className="size-5" />
            <span className="min-w-0 flex-1 truncate">{s.name}</span>
            <span className="font-mono text-caption text-muted">
              <CountUp value={s.share} decimals={1} suffix="%" />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Unlock({ on }: { on: boolean }) {
  const { pool, amount, unlockAt, total, done } = UNBONDING;
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element -- tiny local SVG */}
        <img src={`/logos/networks/${pool.id}.svg`} alt="" className="size-8" />
        <div className="min-w-0 flex-1">
          <p className="text-small font-medium">
            {amount} {pool.ticker} unbonding
          </p>
          <p className="text-caption text-muted">Back in your wallet on {formatDate(unlockAt)}</p>
        </div>
        <p className="text-right">
          <span className="block font-mono text-h4">
            <CountUp value={total - done} />
          </span>
          <span className="text-caption text-muted">days left</span>
        </p>
      </div>
      {/* One cell per day of the wait; the days gone light up in turn */}
      <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}>
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-7 rounded-[3px] transition-colors duration-base",
              on && i < done ? TONE_FILL[POOL_TONES[pool.id] ?? "blue"] : "bg-rule",
            )}
            style={{ transitionDelay: `${300 + i * 60}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function Alerts({ on }: { on: boolean }) {
  const reduceMotion = useReducedMotion();
  /* Index of the newest alert; three are always shown */
  const [head, setHead] = useState(2);
  useEffect(() => {
    if (!on || reduceMotion) return;
    const id = window.setInterval(() => setHead((h) => h + 1), 2600);
    return () => window.clearInterval(id);
  }, [on, reduceMotion]);
  /* Newest on top: three visible, each new one pushes the rest down */
  const shown = [0, 1, 2].map((k) => head - k);

  return (
    <ul className="flex h-full flex-col gap-2 overflow-hidden [mask-image:linear-gradient(to_bottom,black_75%,transparent)]">
      {shown.map((n) => {
        const a = ALERTS[((n % ALERTS.length) + ALERTS.length) % ALERTS.length];
        return (
          <li
            key={n}
            className={cn(
              "flex items-center gap-3 rounded-field border border-rule bg-surface px-3 py-2",
              n === head && head > 2 && "alert-in",
            )}
          >
            <IconChip icon={a.icon} tone={a.tone} size="sm" />
            <span className="min-w-0">
              <span className="block truncate text-small font-medium">{a.title}</span>
              <span className="block truncate text-caption text-muted">{a.body}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function Features() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  return (
    <div ref={ref} className="grid gap-6 md:grid-cols-2">
      <Card
        title="Rewards, every day"
        body="Each payout is recorded per epoch and added up daily, so you can see what every position earned and when."
      >
        <DailyBars on={inView} />
      </Card>
      <Card
        title="Every network, one balance"
        body="Ethereum, Solana, Cosmos and the rest in a single total at reference prices, with the split at a glance."
      >
        <Split on={inView} />
      </Card>
      <Card
        title="Know when funds unlock"
        body="Unstaking follows each network’s unbonding period. The days left and the release date are always in view."
      >
        <Unlock on={inView} />
      </Card>
      <Card
        title="Alerts that matter"
        body="Payouts, finished unbonding, new sign-ins and network incidents arrive as they happen, nothing else."
      >
        <Alerts on={inView} />
      </Card>
    </div>
  );
}
