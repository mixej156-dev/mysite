"use client";

import Image from "next/image";
import { BlogCard } from "@/components/blocks/BlogCard";
import { GrowthRings } from "@/components/blocks/GrowthRings";
import { MacWindow } from "@/components/blocks/MacWindow";
import { Newsletter } from "@/components/blocks/Newsletter";
import { PhoneMockup } from "@/components/blocks/PhoneMockup";
import { PoolCard } from "@/components/blocks/PoolCard";
import { StatCard } from "@/components/blocks/StatCard";
import { StakeSteps } from "@/components/home/HowItWorks";
import { MetricsPanel, NetworksMarquee } from "@/components/home/Metrics";
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
            <Example label="MetricsPanel: one panel, short hairline separators (2×2 on phones)">
              <MetricsPanel />
            </Example>
            <Example label="LogoMarquee: networks we validate on, real logos in brand colours; pauses on hover">
              <NetworksMarquee />
            </Example>
            <Example label="MacWindow: product screenshot frame (home hero), desktop and phone shots">
              <div className="flex flex-wrap items-start gap-6">
                <MacWindow address="lonar.eco/dashboard" className="w-full max-w-xl">
                  <Image
                    src="/screens/dashboard-desktop.webp"
                    alt="The dashboard on desktop"
                    width={2560}
                    height={1600}
                    unoptimized
                    className="block h-auto w-full"
                  />
                </MacWindow>
                <MacWindow address="lonar.eco/dashboard" className="w-full max-w-[14rem]">
                  <Image
                    src="/screens/dashboard-mobile.webp"
                    alt="The dashboard on a phone"
                    width={1170}
                    height={2280}
                    unoptimized
                    className="block h-auto w-full"
                  />
                </MacWindow>
              </div>
            </Example>
            <Example label="PhoneMockup: iPhone 17 Pro Max in 3D, leaning back and turned right (home hero on desktop)">
              <div className="flex justify-center py-6">
                <PhoneMockup className="[--pw:14rem]">
                  <Image
                    src="/screens/dashboard-phone.webp"
                    alt="The dashboard on a phone"
                    width={1320}
                    height={2580}
                    unoptimized
                    className="block h-full w-full object-cover object-top"
                  />
                </PhoneMockup>
              </div>
            </Example>
            <Example label="StakeSteps: illustrated steps (StakeStoryCover), one story from coin to wallet">
              <StakeSteps />
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
