import type { PortfolioState } from "@/data/portfolio";
import { getPool } from "@/data/pools";
import { USD_PRICES } from "@/data/prices";
import type { RewardEntry } from "./portfolio";
import { DEMO_TODAY, addDays, priceHistory, type Point } from "./series";

const price = (ticker: string) => USD_PRICES[ticker] ?? 0;

export function stakedUsd(state: PortfolioState): number {
  return state.positions.reduce((sum, p) => sum + p.amount * price(getPool(p.poolId)?.ticker ?? ""), 0);
}

export function walletUsd(state: PortfolioState): number {
  return Object.entries(state.wallet).reduce((sum, [t, v]) => sum + v * price(t), 0);
}

export function rewardsUsd(rewards: RewardEntry[], sinceDays?: number): number {
  const since = sinceDays === undefined ? "" : addDays(DEMO_TODAY, -sinceDays);
  return rewards.filter((r) => r.date > since).reduce((sum, r) => sum + r.amount * price(r.ticker), 0);
}

export function earnedByPosition(rewards: RewardEntry[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const r of rewards) map.set(r.positionId, (map.get(r.positionId) ?? 0) + r.amount);
  return map;
}

/**
 * Daily USD value of positions (from their start date) plus today's wallet balances, at demo prices.
 * The last point equals today's total balance.
 */
export function valueHistory(state: PortfolioState, days = 365): Point[] {
  const tickers = [
    ...new Set([...Object.keys(state.wallet), ...state.positions.map((p) => getPool(p.poolId)?.ticker ?? "")]),
  ];
  const prices = new Map(tickers.map((t) => [t, priceHistory(t, price(t), days)]));
  const start = addDays(DEMO_TODAY, -(days - 1));
  return Array.from({ length: days }, (_, i) => {
    const date = addDays(start, i);
    let value = 0;
    for (const p of state.positions) {
      const ticker = getPool(p.poolId)?.ticker ?? "";
      if (p.startedAt <= date) value += p.amount * (prices.get(ticker)?.[i].value ?? 0);
    }
    for (const [t, amount] of Object.entries(state.wallet)) value += amount * (prices.get(t)?.[i].value ?? 0);
    return { date, value: Math.round(value * 100) / 100 };
  });
}
