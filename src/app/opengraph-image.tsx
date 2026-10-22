import { getPlatformMetrics, getPools } from "@/lib/api/catalog";
import { formatCompactCurrency } from "@/lib/format";
import { OG_SIZE, renderOgCard } from "./_og/card";

export const alt = "LONAR ECO. — Staking, kept to account";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Default link preview for every page without its own */
export default async function Image() {
  const [metrics, pools] = await Promise.all([getPlatformMetrics(), getPools()]);
  const metric = (id: string) => metrics.find((m) => m.id === id)?.value ?? 0;
  return renderOgCard({
    eyebrow: "Staking platform",
    title: "Staking, kept to account.",
    subtitle: `Stake on ${pools.length} proof-of-stake networks. Rewards recorded per epoch and paid out daily.`,
    figures: [
      { value: formatCompactCurrency(metric("tvl")), label: "Total staked" },
      { value: `${metric("uptime").toFixed(2)}%`, label: "Validator uptime, 90 days" },
      { value: "Daily", label: "Payouts" },
    ],
  });
}
