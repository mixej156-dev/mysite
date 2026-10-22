import type { Metric, Pool } from "@/lib/api/catalog";
import { cn } from "@/lib/cn";
import { LogoMarquee, type MarqueeItem } from "../blocks/LogoMarquee";
import { StatCard } from "../blocks/StatCard";

/** The four platform figures in one panel, with short hairline separators between them. */
export function MetricsPanel({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid grid-cols-2 rounded-card bg-surface-2 px-1 py-2 sm:px-3 sm:py-3 lg:grid-cols-4 lg:py-6">
      {metrics.map((m, i) => (
        <StatCard
          key={m.id}
          label={m.label}
          value={m.value}
          format={m.format}
          caption={m.caption}
          className={cn(
            /* Short hairline separators, inset from the panel edges: between columns, and between rows on phones */
            "relative px-4 py-5 sm:px-6 sm:py-6 lg:px-8",
            "before:absolute before:inset-y-6 before:left-0 before:w-px before:bg-rule-strong lg:before:inset-y-3",
            i === 0 && "before:hidden",
            i === 2 && "before:hidden lg:before:block",
            i >= 2 &&
              "after:absolute after:inset-x-4 after:top-0 after:h-px after:bg-rule-strong sm:after:inset-x-6 lg:after:hidden",
          )}
        />
      ))}
    </div>
  );
}

/** Networks the platform validates on, one per pool, with the network's own logo */
export function NetworksMarquee({ pools }: { pools: Pool[] }) {
  const items: MarqueeItem[] = pools.map((pool) => ({ name: pool.name, logo: `/logos/networks/${pool.id}.svg` }));
  return <LogoMarquee items={items} label="Networks we validate on" />;
}

export function Metrics({ metrics, pools }: { metrics: Metric[]; pools: Pool[] }) {
  return (
    <section aria-labelledby="metrics-title" className="pb-14 sm:pb-24 md:pb-32">
      <h2 id="metrics-title" className="sr-only">
        Platform figures
      </h2>
      <div className="container-page">
        <MetricsPanel metrics={metrics} />
      </div>
      <div className="mt-10 flex flex-col gap-6 sm:mt-16 md:mt-20">
        <p className="container-page text-small text-muted">Networks we validate on</p>
        <NetworksMarquee pools={pools} />
      </div>
    </section>
  );
}
