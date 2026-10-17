import { pools } from "@/data/pools";

export type PayoutRow = {
  id: number;
  epoch: number;
  ticker: string;
  amount: number;
  /** Shortened recipient address, e.g. 0x7a3f…c91e */
  address: string;
};

/** Small deterministic PRNG so server and client render the same rows. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Typical single payout size per asset, so amounts look plausible */
const PAYOUT_SCALE: Record<string, number> = { ETH: 0.006, SOL: 0.4, ATOM: 1.8, DOT: 3.2, AVAX: 0.9, ADA: 14 };

const HEX = "0123456789abcdef";
const FIRST_EPOCH = 312_840;

/** Payout row #index of an endless, reproducible ledger. */
export function payoutAt(index: number): PayoutRow {
  const rand = mulberry32(index * 7919 + 17);
  const pool = pools[Math.floor(rand() * pools.length)];
  const hex = (n: number) => Array.from({ length: n }, () => HEX[Math.floor(rand() * 16)]).join("");
  return {
    id: index,
    epoch: FIRST_EPOCH + Math.floor(index / 3),
    ticker: pool.ticker,
    amount: PAYOUT_SCALE[pool.ticker] * (0.4 + rand() * 1.4),
    address: `0x${hex(4)}…${hex(4)}`,
  };
}
