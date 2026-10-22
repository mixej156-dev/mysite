"use client";

import { LearnCard } from "@/components/blocks/LearnCard";
import { LearnCover } from "@/components/blocks/LearnCover";
import { PostCover } from "@/components/blocks/PostCover";
import { Prose } from "@/components/blocks/Prose";
import { Swap } from "@/components/swap/Swap";
import { ASSETS, CONVERSION_FEE, NETWORKS, SLIPPAGE_OPTIONS } from "@/data/networks";
import { CHANGE_24H, USD_PRICES } from "@/data/prices";
import { TOPICS, type GuideSummary } from "@/data/learn-meta";
import { POST_CATEGORIES } from "@/data/posts-meta";
import type { ContentBlock } from "@/lib/content";
import { Example, Section } from "../_components/Section";
import { Preview } from "../_components/Preview";

/* Literal sample so the styleguide bundle doesn't pull in every guide's text */
const SAMPLE_GUIDE: GuideSummary = {
  slug: "how-amms-work",
  title: "How automated market makers set prices",
  excerpt: "No order book, just a formula and a pool. Why big trades move the price and who earns the fees.",
  topic: "DeFi",
  level: "Intermediate",
  minutes: 9,
};

const PROSE_SAMPLE: ContentBlock[] = [
  { type: "p", text: "Long-form text for articles, guides and docs. The first paragraph can be set as a lead." },
  { type: "h2", text: "Steps" },
  { type: "steps", items: ["Open Stake and choose a pool", "Enter an amount", "Review the terms and confirm"] },
  { type: "note", title: "Note", text: "A callout for a warning, a tip or a rule the reader shouldn’t miss." },
  { type: "code", label: "example", code: "10 ETH × 4% APR = 0.400 ETH a year\nRestaked daily ≈ 0.408 ETH" },
  { type: "quote", text: "A pull quote, set larger with an accent rule.", cite: "Source" },
];

export function ContentSection() {
  return (
    <Section
      id="content"
      description="Generated cover art and long-form blocks. Covers are SVG drawn from a slug, so every article gets its own variation of its topic's motif. Blog covers are monochrome; ECO. LEARN and the home news use the topic palette."
    >
      <Preview>
        {() => (
          <>
            <Example label="LearnCover: one motif per topic">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {TOPICS.map((t) => (
                  <figure key={t.name} className="flex flex-col gap-2">
                    <div className="aspect-[16/10] overflow-hidden rounded-card border border-rule">
                      <LearnCover slug={`styleguide-${t.name}`} topic={t.name} />
                    </div>
                    <figcaption className="text-caption text-muted">{t.name}</figcaption>
                  </figure>
                ))}
              </div>
            </Example>
            <Example label="PostCover: monochrome (blog) and colored (home news)">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {POST_CATEGORIES.map((c) => (
                  <figure key={c} className="flex flex-col gap-2">
                    <div className="aspect-[16/10] overflow-hidden rounded-card border border-rule">
                      <PostCover slug={`styleguide-${c}`} category={c} />
                    </div>
                    <div className="aspect-[16/10] overflow-hidden rounded-card border border-rule">
                      <PostCover slug={`styleguide-${c}`} category={c} colored />
                    </div>
                    <figcaption className="text-caption text-muted">{c}</figcaption>
                  </figure>
                ))}
              </div>
            </Example>
            <Example label="LearnCard">
              <div className="max-w-sm">
                <LearnCard guide={SAMPLE_GUIDE} />
              </div>
            </Example>
            <Example label="Prose: paragraph, heading, steps, note, code, quote">
              <Prose blocks={PROSE_SAMPLE} idPrefix="styleguide-" />
            </Example>
          </>
        )}
      </Preview>
      <Preview>
        {() => (
          <Example label="Swap (/swap)">
            <Swap
              terms={{ networks: NETWORKS, assets: ASSETS, fee: CONVERSION_FEE, slippageOptions: SLIPPAGE_OPTIONS }}
              prices={{ usd: USD_PRICES, change24h: CHANGE_24H }}
            />
          </Example>
        )}
      </Preview>
    </Section>
  );
}
