import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Link } from "@/components/Link";
import { buttonClasses } from "@/design-system";
import { pools } from "@/data/pools";
import { formatPercent, formatUnbonding } from "@/lib/format";
import { Section, SectionHeader } from "../blocks/Section";

/* Network | APY | Withdrawal | Minimum | arrow; phones keep the network and the APY */
const COLUMNS = "md:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))_2.5rem]";

/** Every pool on one card, one row each: the product at a glance, with each row opening the pool's page. */
export function HomePools() {
  return (
    <Section labelledBy="pools-title">
      <SectionHeader
        id="pools-title"
        title="Six networks, one account"
        lead="Estimated APY after the platform fee, how long a withdrawal takes and the minimum to start, for every pool."
        action={
          <Link href="/staking" className={buttonClasses({ variant: "secondary" })}>
            Compare all pools
          </Link>
        }
      />
      <div className="overflow-hidden rounded-card border border-rule bg-surface">
        {/* Column labels stay put while the rows rise in */}
        <div
          aria-hidden
          data-no-reveal
          className={`grid gap-x-6 border-b border-rule px-6 py-3 text-caption text-muted max-md:hidden ${COLUMNS}`}
        >
          <span>Network</span>
          <span>Estimated APY</span>
          <span>Withdrawal</span>
          <span>Minimum</span>
        </div>
        <ul className="grid divide-y divide-rule">
          {pools.map((pool) => (
            <li
              key={pool.id}
              data-reveal-item
              className={`group relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 px-4 py-4 transition-colors duration-fast hover:bg-surface-2 sm:px-6 md:gap-x-6 md:py-5 ${COLUMNS}`}
            >
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                <Image
                  src={`/logos/networks/${pool.id}.svg`}
                  alt=""
                  width={40}
                  height={40}
                  unoptimized
                  className="size-9 shrink-0 sm:size-10"
                />
                <div className="min-w-0">
                  <h3 className="text-body font-medium sm:text-h4">
                    <Link href={`/staking/${pool.id}`} className="stretched-link rounded-sm">
                      {pool.name}
                    </Link>
                  </h3>
                  <p className="truncate text-caption text-muted sm:text-small">
                    {pool.ticker}
                    {/* Phones: the two figures that have no column */}
                    <span className="md:hidden">
                      {" "}
                      · {formatUnbonding(pool.unbondingDays)} · from {pool.minStake} {pool.ticker}
                    </span>
                  </p>
                </div>
              </div>
              <dl className="contents">
                <div className="text-right md:text-left">
                  <dt className="text-caption text-muted md:sr-only">Est. APY</dt>
                  <dd className="font-mono text-h4 tracking-tight sm:text-h3">{formatPercent(pool.apy)}</dd>
                </div>
                <div className="max-md:hidden">
                  <dt className="sr-only">Withdrawal</dt>
                  <dd className="font-mono text-small">{formatUnbonding(pool.unbondingDays)}</dd>
                </div>
                <div className="max-md:hidden">
                  <dt className="sr-only">Minimum</dt>
                  <dd className="font-mono text-small">
                    {pool.minStake} {pool.ticker}
                  </dd>
                </div>
              </dl>
              <span
                aria-hidden
                className="grid size-10 place-items-center rounded-pill border border-rule text-muted transition-colors duration-fast group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent max-md:hidden"
              >
                <ArrowUpRight className="size-4" />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
