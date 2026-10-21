"use client";

import { useReducedMotion } from "framer-motion";
import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight, Bell, Coins, Layers, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { buttonClasses } from "@/design-system/components/Button";
import { getPool } from "@/data/pools";
import { SEED_PORTFOLIO, demoHash, type Tx } from "@/data/portfolio";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";
import { positionRewards, priceOf, type RewardEntry } from "@/lib/portfolio";
import { earnedByPosition, rewardsUsd, stakedUsd, valueHistory, walletUsd } from "@/lib/portfolioStats";
import { DEMO_TODAY } from "@/lib/series";
import { TimeSeriesChart } from "../charts/TimeSeriesChart";
import { ActivityList } from "../dashboard/ActivityList";
import { BalanceCard } from "../dashboard/BalanceCard";
import { DASHBOARD_NAV } from "../dashboard/nav";
import { Panel } from "../dashboard/Panel";
import { RewardsFeed } from "../dashboard/RewardsFeed";
import { StakePositionsTable } from "../dashboard/StakePositionsTable";
import { tokenAmount } from "../dashboard/txMeta";
import { useEnterSequence } from "../dashboard/useEnterSequence";
import { Logo } from "../layout/Logo";

/*
 * The real dashboard overview, built from the same components and the demo account, playing by itself: it rises in
 * as it scrolls into view, then a cursor reads the chart, switches its period, and rewards keep landing (a toast,
 * the bell, the balance, the feeds). Visitors can't click into it (inert); a sentence beside it describes it.
 */

const STATE = SEED_PORTFOLIO;
const BASE_REWARDS = STATE.positions.flatMap(positionRewards);
const HISTORY = valueHistory(STATE);
const BASE_ACTIVITY = [...STATE.activity].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
/* Positions that earn, in the order the live rewards cycle through them */
const EARNING = STATE.positions.filter((p) => p.status === "active");
const lastPayout = (positionId: string) => BASE_REWARDS.filter((r) => r.positionId === positionId).at(-1)?.amount ?? 0;

type Landed = { entry: RewardEntry; tx: Tx; usd: number };

const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

/** Static stand-ins for the shell: the same look as Sidebar and Topbar, without the session they need */
function PreviewSidebar() {
  return (
    <div data-enter-scope="nav" className="w-56 shrink-0 border-r border-rule bg-bg px-4 py-5 max-lg:hidden">
      <span className="block px-2">
        <Logo />
      </span>
      <ul className="mt-8 flex flex-col gap-0.5">
        {DASHBOARD_NAV.map(({ href, label, icon: Icon }, i) => (
          <li
            key={href}
            className={cn(
              "flex h-10 items-center gap-3 rounded-field px-3 text-small font-medium",
              i === 0 ? "tint-accent text-accent-text" : "text-muted",
            )}
          >
            <Icon aria-hidden className="size-[1.125rem]" />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PreviewTopbar({ unread, ring }: { unread: number; ring: number }) {
  return (
    <div
      data-enter
      className="flex h-14 items-center gap-2 border-b border-rule bg-bg/90 px-4 sm:h-16 sm:gap-3 sm:px-6"
    >
      <span className="lg:hidden">
        <Logo />
      </span>
      <span className="ml-auto flex h-10 w-48 items-center gap-2 rounded-field border border-rule bg-surface px-3 text-small text-muted max-xl:hidden">
        <Search aria-hidden className="size-4" />
        Search
      </span>
      <span className={buttonClasses({ size: "sm", className: "max-sm:hidden xl:ml-1.5" })}>
        <Plus aria-hidden />
        New stake
      </span>
      {/* key: the bell rings again with each new reward */}
      <span key={ring} className="relative grid size-10 place-items-center max-sm:ml-auto">
        <Bell aria-hidden className={cn("size-5", ring > 0 && "preview-ring")} />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 grid h-4 min-w-4 place-items-center rounded-pill bg-accent px-1 font-mono text-caption leading-none text-on-accent">
            {unread}
          </span>
        )}
      </span>
      <span className="grid size-9 place-items-center rounded-field tint-accent text-caption font-semibold text-accent-text">
        AM
      </span>
    </div>
  );
}

function Overview({ landed, period }: { landed: Landed[]; period: number }) {
  /* Live payouts to the same position on the same day add up into one row, as the real feed records them */
  const rewards = useMemo(() => {
    const today = new Map<string, RewardEntry>();
    for (const { entry } of landed) {
      const prev = today.get(entry.positionId);
      today.set(entry.positionId, prev ? { ...prev, amount: prev.amount + entry.amount } : entry);
    }
    return [...BASE_REWARDS, ...today.values()];
  }, [landed]);
  const earned = useMemo(() => earnedByPosition(rewards), [rewards]);
  const bonus = landed.reduce((sum, l) => sum + l.usd, 0);
  const staked = stakedUsd(STATE) + bonus;
  const wallet = walletUsd(STATE);
  const total = staked + wallet;
  const monthAgo = HISTORY[HISTORY.length - 31]?.value ?? total;
  const history = useMemo(
    () => HISTORY.map((p, i) => (i === HISTORY.length - 1 ? { ...p, value: p.value + bonus } : p)),
    [bonus],
  );
  const rows = STATE.positions.map((p) => ({ ...p, earned: earned.get(p.id) ?? 0 }));
  const activity = [...landed.map((l) => l.tx).reverse(), ...BASE_ACTIVITY].slice(0, 5);

  return (
    <div className="flex flex-col gap-6 px-4 py-5 sm:px-6 sm:py-8">
      <div data-enter>
        <p className="text-h3">Good to see you, Alex</p>
        <p className="mt-1 text-small text-muted">Here’s where your stake stands on {formatDate(DEMO_TODAY)}.</p>
      </div>
      <BalanceCard
        total={total}
        change={total - monthAgo}
        periodLabel="past 30 days"
        breakdown={[
          { label: "Staked", value: staked, note: `${rows.length} positions`, tone: "blue", inTotal: true },
          { label: "In wallet", value: wallet, note: "Available to stake or withdraw", tone: "teal", inTotal: true },
          {
            label: "30-day rewards",
            shortLabel: "30d rewards",
            value: rewardsUsd(rewards, 30) + bonus,
            note: "Paid out daily",
            tone: "amber",
          },
        ]}
        actions={
          <>
            <span className={buttonClasses({ className: "gap-1.5 px-1" })}>
              <Plus aria-hidden />
              Stake
            </span>
            <span className={buttonClasses({ variant: "secondary", className: "gap-1.5 px-1" })}>
              <ArrowDownLeft aria-hidden />
              Deposit
            </span>
            <span className={buttonClasses({ variant: "secondary", className: "gap-1.5 px-1" })}>
              <ArrowUpRight aria-hidden />
              Withdraw
            </span>
          </>
        }
      />
      <div className="grid gap-6 xl:grid-cols-3">
        <div data-preview="chart" className="min-w-0 xl:col-span-2">
          <TimeSeriesChart
            title="Balance"
            series={[{ id: "value", label: "Balance", color: "var(--series-1)", points: history }]}
            valueFormat="usd"
            period={period}
            animate
          />
        </div>
        <Panel title="Latest rewards" icon={Coins} tone="amber">
          <div className="max-sm:[&_ol>li:nth-child(3)]:hidden">
            <RewardsFeed entries={rewards} days={3} />
          </div>
        </Panel>
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Recent activity" icon={ArrowLeftRight} tone="violet" className="xl:order-last">
          <ActivityList items={activity} />
        </Panel>
        <Panel title="Positions" icon={Layers} className="xl:col-span-2">
          <StakePositionsTable rows={rows} compact label="Positions overview" />
        </Panel>
      </div>
    </div>
  );
}

/** Where the cursor stands, relative to the preview; `press` plays the click */
type Cursor = { x: number; y: number; shown: boolean; press: number; fast?: boolean };

export function LivePreview() {
  const reduceMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const visible = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [landed, setLanded] = useState<Landed[]>([]);
  const [period, setPeriod] = useState(90);
  const [toast, setToast] = useState<Landed | null>(null);
  const [cursor, setCursor] = useState<Cursor>({ x: 0, y: 0, shown: false, press: 0 });
  useEnterSequence();

  /* Mount (and so play the entrance) when it scrolls into view; the script only runs while it's on screen */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
        if (entry.isIntersecting) setMounted(true);
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!mounted || reduceMotion) return;
    let alive = true;
    const wrap = wrapRef.current!;
    const until = async () => {
      while (alive && !visible.current) await sleep(300);
      return alive;
    };
    /* Point at the middle of an element inside the preview */
    const pointAt = (el: Element | null | undefined, fx = 0.5, fy = 0.5) => {
      if (!el) return null;
      const box = wrap.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const point = { x: r.left - box.left + r.width * fx, y: r.top - box.top + r.height * fy };
      setCursor((c) => ({ ...c, ...point, shown: true, fast: false }));
      return point;
    };
    const tab = (label: string) =>
      [...wrap.querySelectorAll('[data-preview="chart"] [role="tab"]')].find((t) => t.textContent === label);
    const press = () => setCursor((c) => ({ ...c, press: c.press + 1 }));

    /* The chart's own crosshair and tooltip, moved by synthetic pointer events along the plot */
    const sweep = async () => {
      const plot = wrap.querySelector('[data-preview="chart"] .recharts-wrapper');
      if (!plot) return;
      const r = plot.getBoundingClientRect();
      const box = wrap.getBoundingClientRect();
      const steps = 32;
      for (let i = 0; i <= steps && alive; i++) {
        const t = 0.25 + (0.65 * i) / steps;
        const clientX = r.left + r.width * t;
        const clientY = r.top + r.height * 0.45;
        setCursor((c) => ({ ...c, x: clientX - box.left, y: clientY - box.top, fast: true }));
        plot.dispatchEvent(new MouseEvent("mousemove", { bubbles: true, clientX, clientY }));
        await sleep(50);
      }
      await sleep(600);
      plot.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
      plot.dispatchEvent(new MouseEvent("mouseout", { bubbles: true }));
    };

    const land = (n: number) => {
      const position = EARNING[n % EARNING.length];
      const pool = getPool(position.poolId)!;
      const amount = lastPayout(position.id);
      const item: Landed = {
        entry: { date: DEMO_TODAY, positionId: position.id, poolId: pool.id, ticker: pool.ticker, amount },
        tx: {
          id: `live-${n}`,
          type: "reward",
          ticker: pool.ticker,
          amount,
          date: `${DEMO_TODAY}T12:${String(n % 60).padStart(2, "0")}:00Z`,
          status: "completed",
          hash: demoHash(`live-${n}`),
          poolId: pool.id,
        },
        usd: amount * priceOf(pool.ticker),
      };
      /* Capped so a tab left open for hours stays light */
      setLanded((all) => [...all, item].slice(-200));
      setToast(item);
    };

    (async () => {
      let paid = 0;
      await sleep(1800);
      for (let n = 0; alive; n++) {
        if (!(await until())) return;
        /* 1. A reward lands */
        land(paid++);
        await sleep(1600);
        /* 2. Read the chart */
        pointAt(wrap.querySelector('[data-preview="chart"] .recharts-wrapper'), 0.25, 0.45);
        await sleep(800);
        setToast(null);
        await sweep();
        if (!(await until())) return;
        /* 3. Switch the period */
        const next = n % 2 === 0 ? 365 : 30;
        pointAt(tab(next === 365 ? "1Y" : "30D"));
        await sleep(800);
        press();
        setPeriod(next);
        await sleep(1800);
        if (!(await until())) return;
        /* 4. Another reward, then back to the default window */
        land(paid++);
        pointAt(tab("90D"));
        await sleep(900);
        press();
        setPeriod(90);
        await sleep(2400);
        setToast(null);
        setCursor((c) => ({ ...c, shown: false }));
        await sleep(1200);
      }
    })();
    return () => {
      alive = false;
    };
  }, [mounted, reduceMotion]);

  return (
    <div ref={wrapRef} className="relative">
      <div
        inert
        className="flex max-h-[50rem] min-h-[36rem] overflow-hidden bg-bg text-text select-none [mask-image:linear-gradient(to_bottom,black_88%,transparent)] sm:max-h-[60rem] xl:max-h-[76rem]"
      >
        {mounted && (
          <>
            <PreviewSidebar />
            <div data-enter-scope="page" className="min-w-0 flex-1">
              <PreviewTopbar unread={landed.length + 3} ring={landed.length} />
              <Overview landed={landed} period={period} />
            </div>
          </>
        )}
      </div>

      {/* A reward arriving, as the dashboard's toast would show it */}
      {toast && (
        <div
          key={toast.tx.id}
          aria-hidden
          className="absolute top-16 right-4 z-10 flex w-64 animate-pop-in items-start gap-3 rounded-card border border-rule bg-surface p-3 shadow-overlay sm:top-20 sm:right-6 sm:w-72"
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-pill tint-topic-amber text-topic-amber">
            <Coins aria-hidden className="size-4" />
          </span>
          <span className="min-w-0">
            <span className="block text-small font-medium">Reward recorded</span>
            <span className="block truncate font-mono text-caption text-muted">
              {getPool(toast.entry.poolId)?.name} +{tokenAmount(toast.entry.amount, toast.entry.ticker)}
            </span>
          </span>
        </div>
      )}

      {/* The cursor: an arrow on desktop, a touch dot on phones */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-0 left-0 z-20 transition-[translate,opacity] ease-brand",
          /* Glides between targets, tracks closely while it reads the chart */
          cursor.fast ? "duration-75" : "duration-[700ms]",
          cursor.shown ? "opacity-100" : "opacity-0",
        )}
        style={{ translate: `${cursor.x}px ${cursor.y}px` } as CSSProperties}
      >
        <span key={cursor.press} className={cn("block", cursor.press > 0 && "preview-press")}>
          <svg viewBox="0 0 20 20" className="size-5 drop-shadow-md max-sm:hidden">
            <path d="M3 2l13 7.2-5.6 1.3L8 16z" className="fill-text stroke-surface" strokeWidth="1.4" />
          </svg>
          <span className="block size-7 -translate-1/2 rounded-pill border-2 border-surface bg-text/30 shadow-float sm:hidden" />
        </span>
      </span>
    </div>
  );
}
