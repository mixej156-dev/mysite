import type { Pool } from "@/data/pools";

/** Fixed "today" for demo series, so server and client render identical charts. */
export const DEMO_TODAY = "2026-10-17";

export type Point = { date: string; value: number };

function seeded(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function isoDaysBefore(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

/**
 * Daily estimated APY for the last `days` days, ending exactly at the pool's current APY.
 * A smoothed random walk; amplitude scales with the yield so low-yield pools stay plausible.
 */
export function apyHistory(pool: Pool, days = 365): Point[] {
  const rand = seeded([...pool.id].reduce((h, c) => h * 31 + c.charCodeAt(0), 7));
  const swing = pool.apy * 0.012;
  const raw: number[] = [0];
  for (let i = 1; i < days; i++) raw.push(raw[i - 1] * 0.97 + (rand() - 0.5) * swing);
  const offset = raw[raw.length - 1];
  return raw.map((v, i) => ({
    date: isoDaysBefore(DEMO_TODAY, days - 1 - i),
    value: Math.round((pool.apy + (v - offset)) * 100) / 100,
  }));
}
