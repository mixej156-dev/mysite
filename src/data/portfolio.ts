/*
 * Seed for the demo account: wallet balances, positions and past account activity.
 * Daily reward payouts are not stored; they are derived from positions (see lib/portfolio.tsx).
 */

export type PositionStatus = "active" | "unbonding";

export type Position = {
  id: string;
  poolId: string;
  amount: number;
  /** ISO date the stake started earning */
  startedAt: string;
  status: PositionStatus;
  /** ISO date unstake was requested; rewards stop from this day */
  unbondingSince?: string;
  /** ISO date funds return to the wallet */
  unlockAt?: string;
  autoRestake: boolean;
};

export type TxType = "deposit" | "withdraw" | "stake" | "unstake" | "reward";

export type Tx = {
  id: string;
  type: TxType;
  ticker: string;
  /** Always positive; the type says which way it moved */
  amount: number;
  /** ISO date-time */
  date: string;
  status: "completed" | "pending";
  hash: string;
  poolId?: string;
  address?: string;
  /** Epoch ms when a pending transaction completes (simulated) */
  completesAt?: number;
};

export type ApiKey = { id: string; label: string; last4: string; createdAt: string };

export type Prefs = {
  twoFactor: boolean;
  notifications: Record<"rewards" | "unbonding" | "security" | "product", boolean>;
  apiKeys: ApiKey[];
};

export type PortfolioState = {
  version: 1;
  wallet: Record<string, number>;
  positions: Position[];
  /** Account activity other than daily rewards */
  activity: Tx[];
  prefs: Prefs;
};

/** Deterministic 32-byte-looking hex hash for demo transactions. Not a real hash function. */
export const demoHash = (seed: string) => {
  let x = 2166136261;
  for (const c of seed) x = Math.imul(x ^ c.charCodeAt(0), 16777619);
  const hex = (n: number) => (n >>> 0).toString(16).padStart(8, "0");
  return `0x${hex(x)}${hex(Math.imul(x, 31))}${hex(Math.imul(x, 131))}${hex(Math.imul(x, 977))}`;
};

const tx = (id: string, type: TxType, ticker: string, amount: number, date: string, extra: Partial<Tx> = {}): Tx => ({
  id,
  type,
  ticker,
  amount,
  date,
  status: "completed",
  hash: demoHash(id),
  ...extra,
});

export const SEED_PORTFOLIO: PortfolioState = {
  version: 1,
  wallet: { ETH: 3.2, SOL: 120, ATOM: 85, DOT: 40, AVAX: 0, ADA: 0 },
  positions: [
    { id: "pos-eth", poolId: "eth", amount: 12.5, startedAt: "2026-03-02", status: "active", autoRestake: true },
    { id: "pos-sol", poolId: "sol", amount: 840, startedAt: "2026-05-20", status: "active", autoRestake: false },
    { id: "pos-atom", poolId: "atom", amount: 1200, startedAt: "2026-07-01", status: "active", autoRestake: false },
    {
      id: "pos-dot",
      poolId: "dot",
      amount: 300,
      startedAt: "2026-04-14",
      status: "unbonding",
      unbondingSince: "2026-10-05",
      unlockAt: "2026-11-02",
      autoRestake: false,
    },
  ],
  activity: [
    tx("seed-1", "deposit", "ETH", 16, "2026-02-27T09:14:00Z", { address: "0x9a4c…e21b" }),
    tx("seed-2", "stake", "ETH", 12.5, "2026-03-02T10:02:00Z", { poolId: "eth" }),
    tx("seed-3", "deposit", "DOT", 340, "2026-04-12T16:40:00Z", { address: "15Hc…Wq8n" }),
    tx("seed-4", "stake", "DOT", 300, "2026-04-14T08:21:00Z", { poolId: "dot" }),
    tx("seed-5", "deposit", "SOL", 960, "2026-05-18T12:05:00Z", { address: "7nVx…3PkQ" }),
    tx("seed-6", "stake", "SOL", 840, "2026-05-20T07:48:00Z", { poolId: "sol" }),
    tx("seed-7", "deposit", "ATOM", 1285, "2026-06-29T14:30:00Z", { address: "cosmos1…8fz3" }),
    tx("seed-8", "stake", "ATOM", 1200, "2026-07-01T09:10:00Z", { poolId: "atom" }),
    tx("seed-9", "withdraw", "ETH", 0.8, "2026-08-22T18:12:00Z", { address: "0x51e0…77ad" }),
    tx("seed-10", "unstake", "DOT", 300, "2026-10-05T11:26:00Z", { poolId: "dot" }),
  ],
  prefs: {
    twoFactor: false,
    notifications: { rewards: true, unbonding: true, security: true, product: false },
    apiKeys: [{ id: "key-1", label: "Accounting export", last4: "9f2c", createdAt: "2026-08-03" }],
  },
};
