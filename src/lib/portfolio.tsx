"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { SEED_PORTFOLIO, demoHash, type PortfolioState, type Position, type Prefs, type Tx } from "@/data/portfolio";
import { getPool, pools } from "@/data/pools";
import { USD_PRICES } from "@/data/prices";
import * as accountApi from "@/lib/api/account";
import type { AccountResult } from "@/lib/api/account";
import { DEMO_TODAY, addDays, apyHistory, daysBetween } from "@/lib/series";

/*
 * Demo account state (CLAUDE.md §7), stored in localStorage. Stake, unstake, deposit and withdraw go through the
 * account API (lib/api/account), which for now changes only this local state. Nothing is sent anywhere.
 */

export const PORTFOLIO_KEY = "demo_portfolio";

const listeners = new Set<() => void>();
let cache: { raw: string | null; state: PortfolioState } | null = null;

function readRaw(): string | null {
  try {
    return localStorage.getItem(PORTFOLIO_KEY);
  } catch {
    return null;
  }
}

function snapshot(): PortfolioState {
  const raw = readRaw();
  if (cache && cache.raw === raw) return cache.state;
  let state = SEED_PORTFOLIO;
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as PortfolioState;
      if (parsed.version === 1) state = parsed;
    } catch {
      // Corrupt value: fall back to the seed
    }
  }
  cache = { raw, state };
  return state;
}

/** Whether two-factor is turned on in Settings. Read by the login screen, outside the dashboard provider. */
export function isTwoFactorEnabled(): boolean {
  return snapshot().prefs.twoFactor;
}

function save(next: PortfolioState | null) {
  try {
    if (next) localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(next));
    else localStorage.removeItem(PORTFOLIO_KEY);
  } catch {
    // Storage unavailable: keep the change in memory for this page view
    cache = { raw: next ? JSON.stringify(next) : null, state: next ?? SEED_PORTFOLIO };
  }
  listeners.forEach((l) => l());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const onStorage = (e: StorageEvent) => {
    if (e.key === PORTFOLIO_KEY || e.key === null) onChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/* ---------- Derived figures ---------- */

export type RewardEntry = { date: string; positionId: string; poolId: string; ticker: string; amount: number };

const HISTORY_DAYS = 365;
const apyCache = new Map<string, Map<string, number>>();

function apyOn(poolId: string, date: string): number {
  let byDate = apyCache.get(poolId);
  if (!byDate) {
    const pool = getPool(poolId);
    byDate = new Map(pool ? apyHistory(pool, HISTORY_DAYS).map((p) => [p.date, p.value]) : []);
    apyCache.set(poolId, byDate);
  }
  return byDate.get(date) ?? getPool(poolId)?.apy ?? 0;
}

/** Daily payouts for one position: from the day after it started until unstake (or yesterday). */
export function positionRewards(position: Position): RewardEntry[] {
  const pool = getPool(position.poolId);
  if (!pool) return [];
  const end = position.unbondingSince ?? DEMO_TODAY;
  const start = addDays(position.startedAt, 1);
  const earliest = addDays(DEMO_TODAY, -(HISTORY_DAYS - 1));
  const from = start > earliest ? start : earliest;
  const days = daysBetween(from, end);
  return Array.from({ length: Math.max(0, days) }, (_, i) => {
    const date = addDays(from, i);
    const rate = (1 + apyOn(pool.id, date) / 100) ** (1 / 365) - 1;
    return { date, positionId: position.id, poolId: pool.id, ticker: pool.ticker, amount: position.amount * rate };
  });
}

export function priceOf(ticker: string): number {
  return USD_PRICES[ticker] ?? 0;
}

export function shortHash(hash: string): string {
  return `${hash.slice(0, 6)}…${hash.slice(-4)}`;
}

export type ActionResult = { ok: true; message: string; id?: string } | { ok: false; error: string };

type PortfolioApi = {
  state: PortfolioState;
  rewards: RewardEntry[];
  /** Account activity plus daily reward payouts, newest first */
  transactions: Tx[];
  stake: (poolId: string, amount: number) => Promise<ActionResult>;
  unstake: (positionId: string) => Promise<ActionResult>;
  deposit: (ticker: string, amount: number) => Promise<ActionResult>;
  withdraw: (ticker: string, amount: number, address: string) => Promise<ActionResult>;
  setAutoRestake: (positionId: string, on: boolean) => void;
  updatePrefs: (patch: Partial<Prefs>) => void;
  reset: () => void;
};

const PortfolioContext = createContext<PortfolioApi | null>(null);

/** Only rendered on the client (inside RequireAuth), so it can read storage directly. */
export function PortfolioProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, snapshot, () => SEED_PORTFOLIO);
  /* Re-render when a pending withdrawal settles. Starts at 0 so prerender never reads the clock. */
  const [clock, setClock] = useState(0);
  const nextSettle = state.activity
    .filter((t) => t.status === "pending" && t.completesAt)
    .reduce((min, t) => Math.min(min, t.completesAt!), Infinity);

  useEffect(() => {
    if (!Number.isFinite(nextSettle)) return;
    const id = window.setTimeout(() => setClock(Date.now()), Math.max(0, nextSettle - Date.now()) + 50);
    return () => window.clearTimeout(id);
  }, [nextSettle]);

  const rewards = useMemo(() => state.positions.flatMap(positionRewards), [state.positions]);

  const transactions = useMemo<Tx[]>(() => {
    const settled = state.activity.map((t) =>
      t.status === "pending" && t.completesAt && t.completesAt <= clock ? { ...t, status: "completed" as const } : t,
    );
    /* One payout row per position per day, for the last 90 days */
    const since = addDays(DEMO_TODAY, -90);
    const payouts: Tx[] = rewards
      .filter((r) => r.date >= since)
      .map((r) => ({
        id: `rw-${r.positionId}-${r.date}`,
        type: "reward",
        ticker: r.ticker,
        amount: r.amount,
        date: `${r.date}T00:05:00Z`,
        status: "completed",
        hash: demoHash(`${r.positionId}-${r.date}`),
        poolId: r.poolId,
      }));
    return [...settled, ...payouts].sort((a, b) => b.date.localeCompare(a.date));
  }, [state.activity, rewards, clock]);

  const update = useCallback((fn: (s: PortfolioState) => PortfolioState) => save(fn(snapshot())), []);

  /* Account operations go through the API layer, which returns the account after the change */
  const run = useCallback(async (call: (current: PortfolioState) => Promise<AccountResult>): Promise<ActionResult> => {
    const res = await call(snapshot());
    if (!res.ok) return res;
    save(res.account);
    return { ok: true, message: res.message, id: res.id };
  }, []);

  const stake = useCallback((poolId: string, amount: number) => run((s) => accountApi.stake(s, poolId, amount)), [run]);
  const unstake = useCallback((positionId: string) => run((s) => accountApi.unstake(s, positionId)), [run]);
  const deposit = useCallback(
    (ticker: string, amount: number) => run((s) => accountApi.deposit(s, ticker, amount)),
    [run],
  );
  const withdraw = useCallback(
    (ticker: string, amount: number, address: string) => run((s) => accountApi.withdraw(s, ticker, amount, address)),
    [run],
  );

  const setAutoRestake = useCallback(
    (positionId: string, on: boolean) =>
      update((s) => ({
        ...s,
        positions: s.positions.map((p) => (p.id === positionId ? { ...p, autoRestake: on } : p)),
      })),
    [update],
  );

  const updatePrefs = useCallback(
    (patch: Partial<Prefs>) => update((s) => ({ ...s, prefs: { ...s.prefs, ...patch } })),
    [update],
  );

  const reset = useCallback(() => save(null), []);

  const api = useMemo(
    () => ({ state, rewards, transactions, stake, unstake, deposit, withdraw, setAutoRestake, updatePrefs, reset }),
    [state, rewards, transactions, stake, unstake, deposit, withdraw, setAutoRestake, updatePrefs, reset],
  );

  return <PortfolioContext.Provider value={api}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio(): PortfolioApi {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error("usePortfolio must be used inside <PortfolioProvider>");
  return context;
}

/** Tickers that have a staking pool, in pool order */
export const PORTFOLIO_TICKERS = pools.map((p) => p.ticker);
