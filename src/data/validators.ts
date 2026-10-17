import { DEMO_TODAY } from "@/lib/series";

/* Validator performance for /validators. Fictional figures; incidents match the Q3 report in data/posts.ts. */

export type DayStatus = "operational" | "degraded" | "outage";

export type NetworkPerformance = {
  poolId: string;
  network: string;
  validators: number;
  /** Stake-weighted uptime over the last 30 days, % */
  uptime30d: number;
  /** Share of assigned duties performed on time over 30 days, % */
  effectiveness: number;
  /** What a missed duty is called on this network, and its 30-day rate */
  missedLabel: string;
  missedRate: number;
  clients: string[];
  regions: string[];
  slashingEvents: number;
};

export const NETWORK_PERFORMANCE: NetworkPerformance[] = [
  {
    poolId: "eth",
    network: "Ethereum",
    validators: 1240,
    uptime30d: 99.97,
    effectiveness: 98.6,
    missedLabel: "Missed attestations",
    missedRate: 0.19,
    clients: ["Lighthouse", "Teku", "Nethermind", "Besu"],
    regions: ["Frankfurt", "Virginia", "Singapore"],
    slashingEvents: 0,
  },
  {
    poolId: "sol",
    network: "Solana",
    validators: 6,
    uptime30d: 99.95,
    effectiveness: 97.9,
    missedLabel: "Skipped slots",
    missedRate: 0.41,
    clients: ["Agave", "Firedancer"],
    regions: ["Amsterdam", "New York", "Tokyo"],
    slashingEvents: 0,
  },
  {
    poolId: "atom",
    network: "Cosmos Hub",
    validators: 3,
    uptime30d: 99.99,
    effectiveness: 99.8,
    missedLabel: "Missed blocks",
    missedRate: 0.02,
    clients: ["Gaia (CometBFT)"],
    regions: ["Frankfurt", "Toronto"],
    slashingEvents: 0,
  },
  {
    poolId: "dot",
    network: "Polkadot",
    validators: 8,
    uptime30d: 99.93,
    effectiveness: 98.9,
    missedLabel: "Missed blocks",
    missedRate: 0.09,
    clients: ["Polkadot SDK node"],
    regions: ["Helsinki", "Virginia"],
    slashingEvents: 0,
  },
  {
    poolId: "avax",
    network: "Avalanche",
    validators: 4,
    uptime30d: 99.98,
    effectiveness: 99.6,
    missedLabel: "Missed responses",
    missedRate: 0.05,
    clients: ["AvalancheGo"],
    regions: ["Frankfurt", "Oregon"],
    slashingEvents: 0,
  },
  {
    poolId: "ada",
    network: "Cardano",
    validators: 5,
    uptime30d: 99.99,
    effectiveness: 99.7,
    missedLabel: "Missed block slots",
    missedRate: 0.03,
    clients: ["cardano-node"],
    regions: ["London", "Singapore"],
    slashingEvents: 0,
  },
];

export type Incident = {
  date: string;
  poolId: string;
  title: string;
  severity: "degraded" | "outage";
  durationMinutes: number;
  /** Share of the pool's stake affected, for stake-weighted uptime */
  stakeShare: number;
  impact: string;
  fix: string;
};

export const INCIDENTS: Incident[] = [
  {
    date: "2026-10-09",
    poolId: "dot",
    title: "Slow resync after a runtime upgrade",
    severity: "degraded",
    durationMinutes: 12,
    stakeShare: 0.25,
    impact: "Two validators missed block production while their databases caught up. Rewards for the day were about 0.01% lower.",
    fix: "Snapshots are now taken before every runtime upgrade so a node can restart from a recent state.",
  },
  {
    date: "2026-09-02",
    poolId: "sol",
    title: "Hosting provider outage",
    severity: "degraded",
    durationMinutes: 18,
    stakeShare: 1 / 3,
    impact: "One provider lost connectivity. Validators failed over as designed, but two missed votes during the switch.",
    fix: "A third hosting provider is being added for Solana.",
  },
  {
    date: "2026-08-14",
    poolId: "eth",
    title: "Slow consensus client upgrade",
    severity: "degraded",
    durationMinutes: 41,
    stakeShare: 1 / 3,
    impact: "One region’s validators attested late. Estimated effect on the Ethereum pool: 0.004% of that day’s rewards.",
    fix: "Upgrades now roll out one region at a time with a timed rollback.",
  },
];

export const HISTORY_DAYS = 90;

function isoDaysBefore(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

export type UptimeDay = { date: string; uptime: number; status: DayStatus };

/** Daily uptime for the last HISTORY_DAYS days. Deterministic; incident days take their recorded downtime. */
export function uptimeHistory(poolId: string): UptimeDay[] {
  let seed = [...poolId].reduce((h, c) => h * 31 + c.charCodeAt(0), 11);
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  return Array.from({ length: HISTORY_DAYS }, (_, i) => {
    const date = isoDaysBefore(DEMO_TODAY, HISTORY_DAYS - 1 - i);
    const incident = INCIDENTS.find((x) => x.poolId === poolId && x.date === date);
    const uptime = incident
      ? 100 - (incident.durationMinutes / 1440) * 100 * incident.stakeShare
      : 99.95 + rand() * 0.05;
    const status: DayStatus = uptime >= 99.9 ? "operational" : uptime >= 99 ? "degraded" : "outage";
    return { date, uptime, status };
  });
}

export const LATEST_REPORT = { title: "Q3 validator performance report", href: "/blog/q3-validator-performance" };
