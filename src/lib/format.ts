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

const compactCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
});

/** 1_840_000_000 -> "$1.84B" */
export function formatCompactCurrency(value: number): string {
  return compactCurrency.format(value);
}

/** 12486.3 -> "$12,486" (no cents above $1,000) */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: Math.abs(value) >= 1000 ? 0 : 2,
  }).format(value);
}

/** 48210 -> "48,210" */
export function formatNumber(value: number, maximumFractionDigits = 0): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(value);
}

/** Token amount with a fixed number of decimals: (2.5, "ETH") -> "2.5000 ETH" */
export function formatToken(value: number, ticker: string, digits = 4): string {
  return `${new Intl.NumberFormat("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value)} ${ticker}`;
}

/** "2026-10-08" -> "Oct 8, 2026". Fixed locale and UTC so server and client agree. */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );
}
