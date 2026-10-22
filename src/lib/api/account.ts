import type { PortfolioState } from "@/data/portfolio";
import { getPool } from "@/data/pools";
import { DEMO_TODAY, addDays } from "@/lib/series";

/*
 * Account operations: what a backend would do for the signed-in account. The dashboard's PortfolioProvider calls
 * these and stores the account they return; nothing else changes account state.
 *
 * Today they run in the browser against the account kept in localStorage: each takes the current account, waits a
 * moment like a network call would, and returns the account after the change. To connect a backend, replace a body
 * with a request (`POST /stakes`, `POST /positions/:id/unstake`, …) that returns the updated account in the same
 * shape; the `current` argument is then unused.
 */

export type AccountResult = { ok: true; message: string; id?: string; account: PortfolioState } | AccountError;
export type AccountError = { ok: false; error: string };

const LATENCY_MS = 900;
/** How long a withdrawal stays pending before it settles */
const WITHDRAW_SETTLE_MS = 8000;

const latency = () => new Promise((resolve) => window.setTimeout(resolve, LATENCY_MS));

function nowIso(): string {
  /* The demo clock stays on DEMO_TODAY so new activity sorts with the seeded history */
  return `${DEMO_TODAY}T${new Date().toISOString().slice(11)}`;
}

function newHash(seed: string): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return `0x${[...bytes].map((b) => b.toString(16).padStart(2, "0")).join("")}${seed.length.toString(16)}`;
}

export async function stake(current: PortfolioState, poolId: string, amount: number): Promise<AccountResult> {
  const pool = getPool(poolId);
  if (!pool) return { ok: false, error: "That pool doesn’t exist." };
  if (amount < pool.minStake) return { ok: false, error: `The minimum is ${pool.minStake} ${pool.ticker}.` };
  if (amount > (current.wallet[pool.ticker] ?? 0))
    return { ok: false, error: `Not enough ${pool.ticker} in your wallet.` };
  await latency();
  const id = `pos-${Date.now().toString(36)}`;
  return {
    ok: true,
    id,
    message: `${amount} ${pool.ticker} is now staked in the ${pool.name} pool.`,
    account: {
      ...current,
      wallet: { ...current.wallet, [pool.ticker]: (current.wallet[pool.ticker] ?? 0) - amount },
      positions: [
        { id, poolId, amount, startedAt: DEMO_TODAY, status: "active", autoRestake: false },
        ...current.positions,
      ],
      activity: [
        {
          id: `tx-${id}`,
          type: "stake",
          ticker: pool.ticker,
          amount,
          date: nowIso(),
          status: "completed",
          hash: newHash(id),
          poolId,
        },
        ...current.activity,
      ],
    },
  };
}

export async function unstake(current: PortfolioState, positionId: string): Promise<AccountResult> {
  const position = current.positions.find((p) => p.id === positionId);
  const pool = position && getPool(position.poolId);
  if (!position || !pool) return { ok: false, error: "That position no longer exists." };
  if (position.status !== "active") return { ok: false, error: "This position is already unbonding." };
  await latency();
  const instant = pool.unbondingDays === 0;
  return {
    ok: true,
    message: instant
      ? `${position.amount} ${pool.ticker} is back in your wallet.`
      : `Unbonding started. Funds unlock on ${addDays(DEMO_TODAY, pool.unbondingDays)}.`,
    account: {
      ...current,
      wallet: instant
        ? { ...current.wallet, [pool.ticker]: (current.wallet[pool.ticker] ?? 0) + position.amount }
        : current.wallet,
      positions: instant
        ? current.positions.filter((p) => p.id !== positionId)
        : current.positions.map((p) =>
            p.id === positionId
              ? {
                  ...p,
                  status: "unbonding",
                  unbondingSince: DEMO_TODAY,
                  unlockAt: addDays(DEMO_TODAY, pool.unbondingDays),
                }
              : p,
          ),
      activity: [
        {
          id: `tx-un-${Date.now().toString(36)}`,
          type: "unstake",
          ticker: pool.ticker,
          amount: position.amount,
          date: nowIso(),
          status: "completed",
          hash: newHash(positionId),
          poolId: pool.id,
        },
        ...current.activity,
      ],
    },
  };
}

export async function deposit(current: PortfolioState, ticker: string, amount: number): Promise<AccountResult> {
  if (!(amount > 0)) return { ok: false, error: "Enter an amount greater than 0." };
  await latency();
  return {
    ok: true,
    message: `${amount} ${ticker} added to your wallet.`,
    account: {
      ...current,
      wallet: { ...current.wallet, [ticker]: (current.wallet[ticker] ?? 0) + amount },
      activity: [
        {
          id: `tx-dep-${Date.now().toString(36)}`,
          type: "deposit",
          ticker,
          amount,
          date: nowIso(),
          status: "completed",
          hash: newHash(ticker),
        },
        ...current.activity,
      ],
    },
  };
}

export async function withdraw(
  current: PortfolioState,
  ticker: string,
  amount: number,
  address: string,
): Promise<AccountResult> {
  if (!(amount > 0)) return { ok: false, error: "Enter an amount greater than 0." };
  if (amount > (current.wallet[ticker] ?? 0)) return { ok: false, error: `Not enough ${ticker} in your wallet.` };
  await latency();
  return {
    ok: true,
    message: `Withdrawal of ${amount} ${ticker} is on its way.`,
    account: {
      ...current,
      wallet: { ...current.wallet, [ticker]: (current.wallet[ticker] ?? 0) - amount },
      activity: [
        {
          id: `tx-wd-${Date.now().toString(36)}`,
          type: "withdraw",
          ticker,
          amount,
          date: nowIso(),
          status: "pending",
          hash: newHash(address),
          address,
          completesAt: Date.now() + WITHDRAW_SETTLE_MS,
        },
        ...current.activity,
      ],
    },
  };
}
