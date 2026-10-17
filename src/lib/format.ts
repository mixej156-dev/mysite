/** 3.8 -> "3.80%" */
export function formatPercent(value: number, digits = 2): string {
  return `${value.toFixed(digits)}%`;
}

/** Unbonding period in words: 0 -> "No lock-up", 1 -> "1 day", 21 -> "21 days" */
export function formatUnbonding(days: number): string {
  if (days === 0) return "No lock-up";
  return `${days} day${days === 1 ? "" : "s"}`;
}

/** Compact form for lists: 0 -> "no lock-up", 21 -> "21-day unbonding" */
export function formatUnbondingShort(days: number): string {
  return days === 0 ? "no lock-up" : `${days}-day unbonding`;
}
