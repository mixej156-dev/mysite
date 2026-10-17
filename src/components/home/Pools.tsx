import { Link } from "@/components/Link";
import { buttonClasses } from "@/design-system";
import { featuredPools } from "@/data/pools";
import { PoolCard } from "../blocks/PoolCard";
import { Section, SectionHeader } from "../blocks/Section";

export function Pools() {
  return (
    <Section tone="inverse" labelledBy="pools-title">
      <SectionHeader
        id="pools-title"
        title="Terms up front, before you stake"
        lead="Each pool shows its estimated yield after fees, how long withdrawals take, and the minimum to start."
        action={
          <Link href="/staking" className={buttonClasses({ variant: "secondary" })}>
            All pools
          </Link>
        }
      />
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {featuredPools.map((pool) => (
          <li key={pool.id}>
            <PoolCard pool={pool} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
