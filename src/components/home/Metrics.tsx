import { metrics } from "@/data/metrics";
import { pools } from "@/data/pools";
import { LogoMarquee, type MarqueeItem } from "../blocks/LogoMarquee";
import { StatCard } from "../blocks/StatCard";

/* Networks the platform validates on, one per pool, with the network's own logo */
const NETWORKS: MarqueeItem[] = pools.map((pool) => ({ name: pool.name, logo: `/logos/networks/${pool.id}.svg` }));

export function Metrics() {
  return (
    <section aria-labelledby="metrics-title" className="pb-14 sm:pb-24 md:pb-32">
      <h2 id="metrics-title" className="sr-only">
        Platform figures
      </h2>
      <div className="container-page">
        <div className="grid grid-cols-2 gap-x-5 gap-y-7 rounded-card bg-surface-2 px-5 py-7 sm:gap-x-8 sm:p-8 lg:grid-cols-4 lg:px-10 lg:py-10">
          {metrics.map((m) => (
            <StatCard key={m.id} label={m.label} value={m.value} format={m.format} caption={m.caption} />
          ))}
        </div>
      </div>
      <div className="mt-10 flex flex-col gap-6 sm:mt-16 md:mt-20">
        <p className="container-page text-small text-muted">Networks we validate on</p>
        <LogoMarquee items={NETWORKS} label="Networks we validate on" />
      </div>
    </section>
  );
}
