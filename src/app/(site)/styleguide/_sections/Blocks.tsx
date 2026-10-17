"use client";

import { BlogCard } from "@/components/blocks/BlogCard";
import { GrowthRings } from "@/components/blocks/GrowthRings";
import { Newsletter } from "@/components/blocks/Newsletter";
import { PoolCard } from "@/components/blocks/PoolCard";
import { StatCard } from "@/components/blocks/StatCard";
import { metrics } from "@/data/metrics";
import { pools } from "@/data/pools";
import type { PostSummary } from "@/data/posts-meta";
import { projectBalances } from "@/lib/compound";
import { Example, Section } from "../_components/Section";
import { Preview } from "../_components/Preview";

/* Literal sample so the styleguide bundle doesn't pull in every post's text */
const SAMPLE_POST: PostSummary = {
  slug: "q3-validator-performance",
  title: "Q3 validator performance report",
  excerpt: "Uptime, missed attestations and the two incidents we had this quarter, with what changed afterwards.",
  category: "Research",
  date: "2026-10-01",
  readingMinutes: 11,
  author: "Tomasz Wren",
};

const ringScale = (1 + 0.142) ** 5 - 1;

export function BlocksSection() {
  return (
    <Section
      id="blocks"
      description="Composite blocks built from the base components, first used on the home page. They take data as props and read the same tokens, so they work on the page and inside inverse sections."
    >
      <Preview>
        {() => (
          <>
            <Example label="StatCard">
              <div className="grid grid-cols-2 gap-6">
                {metrics.slice(0, 2).map((m) => (
                  <StatCard key={m.id} label={m.label} value={m.value} format={m.format} caption={m.caption} />
                ))}
              </div>
            </Example>
            <Example label="PoolCard: with unbonding and with no lock-up">
              <div className="grid max-w-sm gap-4">
                <PoolCard pool={pools[0]} />
                <PoolCard pool={pools[5]} />
              </div>
            </Example>
            <Example label="BlogCard">
              <div className="max-w-sm">
                <BlogCard post={SAMPLE_POST} />
              </div>
            </Example>
            <Example label="GrowthRings: Cosmos Hub, 1,000 ATOM over 5 years">
              <div className="max-w-xs">
                <GrowthRings balances={projectBalances(1000, 14.2, 5)} maxYears={5} scaleRatio={ringScale}>
                  <p className="font-mono text-small">1,942.36</p>
                </GrowthRings>
              </div>
            </Example>
            <Example label="Newsletter">
              <Newsletter />
            </Example>
          </>
        )}
      </Preview>
    </Section>
  );
}
