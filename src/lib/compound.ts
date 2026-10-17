import { pools } from "@/data/pools";

/**
 * Projected balance when rewards are restaked. APY already includes compounding,
 * so balance after t years = principal × (1 + apy)^t.
 */
export function projectBalances(principal: number, apyPercent: number, years: number): number[] {
  const rate = apyPercent / 100;
  return Array.from({ length: years + 1 }, (_, year) => principal * (1 + rate) ** year);
}

/**
 * Balance at the end of each month (index 0 = today). Rewards are paid daily at the rate implied by the APY;
 * without restaking each day's reward is paid out on the original principal only (simple interest).
 */
export function monthlyBalances(principal: number, apyPercent: number, months: number, restake: boolean): number[] {
  const rate = apyPercent / 100;
  const daily = (1 + rate) ** (1 / 365) - 1;
  return Array.from({ length: months + 1 }, (_, m) => {
    const days = (m * 365) / 12;
    return restake ? principal * (1 + daily) ** days : principal * (1 + daily * days);
  });
}

/** Platform fee taken from rewards, given net rewards and the fee share of gross rewards. */
export function feeOnRewards(netRewards: number, feePercent: number): number {
  return (netRewards / (1 - feePercent / 100)) * (feePercent / 100);
}

/** Most rings the growth-rings figure draws, and the ratio that fills it (highest APY over that span). */
export const RING_YEARS = 5;
export const RING_SCALE = (1 + Math.max(...pools.map((p) => p.apy)) / 100) ** RING_YEARS - 1;
