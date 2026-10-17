import type { Tx, TxType } from "@/data/portfolio";
import { formatToken } from "@/lib/format";

export const TX_LABELS: Record<TxType, string> = {
  deposit: "Deposit",
  withdraw: "Withdrawal",
  stake: "Stake",
  unstake: "Unstake",
  reward: "Reward",
};

/** Sign from the wallet's point of view: money in is +, money out is −; stake moves are neutral */
export function signedAmount(tx: Tx): string {
  const value = tokenAmount(tx.amount, tx.ticker);
  if (tx.type === "deposit" || tx.type === "reward") return `+${value}`;
  if (tx.type === "withdraw") return `−${value}`;
  return value;
}

export function amountTone(tx: Tx): string {
  return tx.type === "deposit" || tx.type === "reward" ? "text-success" : "text-text";
}

/** Token amount with sensible precision for the asset */
export function tokenAmount(value: number, ticker: string): string {
  return formatToken(value, ticker, ticker === "ETH" ? 4 : value >= 1000 ? 2 : 3);
}
