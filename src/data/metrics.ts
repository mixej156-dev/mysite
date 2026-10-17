/* Platform-level demo metrics for the home page. Not live data. */

export type MetricFormat = "currency-compact" | "number" | "percent";

export type Metric = {
  id: string;
  label: string;
  value: number;
  format: MetricFormat;
  /** Short qualifier under the figure */
  caption: string;
};

export const metrics: Metric[] = [
  { id: "tvl", label: "Total staked", value: 1_840_000_000, format: "currency-compact", caption: "Across 6 networks" },
  { id: "rewards", label: "Rewards paid, 30 days", value: 6_210_000, format: "currency-compact", caption: "Net of platform fee" },
  { id: "stakers", label: "Active stakers", value: 48_210, format: "number", caption: "Accounts with an open position" },
  { id: "uptime", label: "Validator uptime, 90 days", value: 99.94, format: "percent", caption: "Weighted by stake" },
];
