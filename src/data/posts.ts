/* Demo blog posts. Fictional authors from data/team.ts; content written for the prototype. */

export type PostCategory = "Research" | "Product" | "Security" | "Guides";

import type { ContentBlock } from "@/lib/content";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: PostCategory;
  /** ISO date */
  date: string;
  readingMinutes: number;
  author: string;
  body: ContentBlock[];
};

export const posts: Post[] = [
  {
    slug: "how-epoch-rewards-are-calculated",
    title: "How epoch rewards are calculated, step by step",
    excerpt: "From validator duties to the figure in your dashboard: where each fraction of a reward comes from.",
    category: "Guides",
    date: "2026-10-08",
    readingMinutes: 7,
    author: "Ines Varga",
    body: [
      {
        type: "p",
        text: "Every reward in your dashboard starts as a duty a validator performed on the network. This guide follows one reward from that duty to the figure you see, using Ethereum as the example.",
      },
      { type: "h2", text: "What validators are paid for" },
      {
        type: "p",
        text: "On Ethereum, validators earn rewards for three things: attesting to the chain head, proposing blocks when selected, and taking part in sync committees. Attestations happen every epoch, about every 6.4 minutes, and make up most of the income.",
      },
      {
        type: "list",
        items: [
          "Attestation rewards: small, frequent, paid every epoch",
          "Proposal rewards: larger, rare, depend on luck",
          "Sync committee rewards: steady for the period a validator is selected",
        ],
      },
      { type: "h2", text: "From the validator to the pool" },
      {
        type: "p",
        text: "Each pool runs many validators. At the end of every epoch we read the rewards and penalties each one received from the chain and record them against that validator. Penalties, such as a missed attestation, are recorded the same way, as negative entries.",
      },
      {
        type: "quote",
        text: "If you can’t trace a reward back to the validator that earned it, you can’t explain why your yield moved.",
        cite: "Ines Varga, Head of Research",
      },
      { type: "h2", text: "From the pool to you" },
      {
        type: "p",
        text: "Your share of a pool’s rewards is proportional to your share of its stake during that epoch. We deduct the platform fee, which is stated on every pool page, and add the rest to your balance. Once a day the accumulated amount is paid out.",
      },
      {
        type: "p",
        text: "That is why the APY figure is an estimate: it projects recent per-epoch rewards over a year. When network conditions change, the epochs change, and so does the estimate.",
      },
    ],
  },
  {
    slug: "q3-validator-performance",
    title: "Q3 validator performance report",
    excerpt: "Uptime, missed attestations and the two incidents we had this quarter, with what changed afterwards.",
    category: "Research",
    date: "2026-10-01",
    readingMinutes: 11,
    author: "Tomasz Wren",
    body: [
      {
        type: "p",
        text: "This quarter our validators were online for 99.94% of the time, weighted by stake. Below is what that number hides: where we lost time, and the two incidents that caused most of it.",
      },
      { type: "h2", text: "Headline figures" },
      {
        type: "list",
        items: [
          "Uptime, weighted by stake: 99.94%",
          "Missed attestations: 0.21% of all assigned",
          "Missed block proposals: 3 out of 1,412",
          "Slashing events: none",
        ],
      },
      { type: "h2", text: "Incident one: a slow client upgrade" },
      {
        type: "p",
        text: "On 14 August a consensus client upgrade took longer than planned on one region’s validators. For 41 minutes they attested late, which reduced rewards on the Ethereum pool by an estimated 0.004% for the day. We now upgrade one region at a time with a timed rollback.",
      },
      { type: "h2", text: "Incident two: a hosting provider outage" },
      {
        type: "p",
        text: "On 2 September one hosting provider lost connectivity for 18 minutes. Validators failed over to a second provider as designed, but two Solana validators missed votes during the switch.",
      },
      {
        type: "quote",
        text: "Both incidents stayed inside our failover plans. Neither came close to a slashable event, and that is the line we watch most closely.",
        cite: "Sara Lindqvist, Validator Operations Lead",
      },
      { type: "h2", text: "What changes next quarter" },
      {
        type: "p",
        text: "We are adding a third hosting provider for Solana and publishing per-validator uptime in the dashboard, so you can see the same numbers we do.",
      },
    ],
  },
  {
    slug: "daily-payouts-now-default",
    title: "Daily payouts are now the default for every pool",
    excerpt: "Rewards used to settle weekly on some networks. Here is what moving to daily changes for you.",
    category: "Product",
    date: "2026-09-18",
    readingMinutes: 4,
    author: "Ines Varga",
    body: [
      {
        type: "p",
        text: "Until this month, rewards on Polkadot and Avalanche were paid out weekly. From today every pool pays out daily.",
      },
      { type: "h2", text: "What changes for you" },
      {
        type: "list",
        items: [
          "Rewards reach your wallet once a day on every network",
          "Restaked rewards start earning sooner",
          "Your transaction history shows one payout line per day",
        ],
      },
      {
        type: "p",
        text: "Nothing changes in how rewards are calculated or in the platform fee. If you prefer fewer entries in your history, you can group payouts by week in the dashboard settings.",
      },
    ],
  },
  {
    slug: "what-slashing-means-for-stakers",
    title: "What slashing means for stakers",
    excerpt: "Why penalties exist, how often they happen in practice, and how losses would be allocated.",
    category: "Security",
    date: "2026-09-04",
    readingMinutes: 9,
    author: "Ade Okafor",
    body: [
      {
        type: "p",
        text: "Slashing is the penalty a network applies when a validator breaks a rule that could harm consensus, such as signing two conflicting blocks. It is rare, but it is the most serious risk in staking.",
      },
      { type: "h2", text: "How slashing differs from missed rewards" },
      {
        type: "p",
        text: "A validator that goes offline simply stops earning, and on some networks pays a small inactivity penalty. Slashing is different: part of the stake itself is removed, and the validator is forced to exit.",
      },
      { type: "h2", text: "How we reduce the chance of it" },
      {
        type: "list",
        items: [
          "Each signing key is active in one place only, enforced by a remote signer",
          "Failover never starts a second copy of a validator until the first is confirmed stopped",
          "Client upgrades roll out one region at a time",
        ],
      },
      {
        type: "p",
        text: "The risk disclosure describes how a slashing loss would be allocated between stakers in the affected pool.",
      },
    ],
  },
  {
    slug: "choosing-a-lock-up",
    title: "Choosing between flexible and locked pools",
    excerpt: "Unbonding periods differ by network. A short guide to matching them with when you might need funds.",
    category: "Guides",
    date: "2026-08-21",
    readingMinutes: 6,
    author: "Tomasz Wren",
    body: [
      {
        type: "p",
        text: "Every network sets its own unbonding period: the time between asking to unstake and having the funds available. On Cardano there is none; on Polkadot it is 28 days.",
      },
      { type: "h2", text: "Match the period to when you might need the funds" },
      {
        type: "p",
        text: "During unbonding your tokens earn nothing and can’t be moved. If you might need funds at short notice, a pool with a short or no unbonding period costs you some yield but keeps you flexible.",
      },
      {
        type: "list",
        items: [
          "No lock-up: Cardano",
          "Up to a week: Ethereum, Solana",
          "Longer: Avalanche (14 days), Cosmos Hub (21 days), Polkadot (28 days)",
        ],
      },
    ],
  },
  {
    slug: "key-ceremony-explained",
    title: "Our validator key ceremony, explained",
    excerpt: "How signing keys are generated, split and stored, and who is in the room when it happens.",
    category: "Security",
    date: "2026-08-07",
    readingMinutes: 8,
    author: "Ade Okafor",
    body: [
      {
        type: "p",
        text: "Before a validator can sign anything, it needs a key. How that key is created decides how hard it is to steal, so we treat it as a ceremony with fixed steps and witnesses.",
      },
      { type: "h2", text: "The steps" },
      {
        type: "list",
        items: [
          "Keys are generated on an offline machine that has never been connected to a network",
          "The key is split into shares; no single share can sign",
          "Shares go to separate hardware security modules in different locations",
          "Two people from different teams witness and record each step",
        ],
      },
      {
        type: "p",
        text: "The offline machine is wiped and the recording is kept for audit. Rotating a key follows the same ceremony.",
      },
    ],
  },
  {
    slug: "reading-your-rewards-ledger",
    title: "Reading your rewards ledger",
    excerpt: "A field-by-field guide to the ledger in your dashboard, and how to export it for your accountant.",
    category: "Guides",
    date: "2026-07-24",
    readingMinutes: 5,
    author: "Keiko Arai",
    body: [
      {
        type: "p",
        text: "The ledger lists every reward and penalty recorded for your stake, one row per epoch and validator.",
      },
      {
        type: "list",
        items: [
          "Epoch: the network period the reward belongs to",
          "Validator: which validator earned it",
          "Gross and net: before and after the platform fee",
        ],
      },
      { type: "p", text: "Use Export CSV in the dashboard to download any date range." },
    ],
  },
  {
    slug: "why-apy-moves",
    title: "Why the APY on a pool moves every day",
    excerpt: "Network inflation, total stake and fees all feed into the estimate. Here is how much each one matters.",
    category: "Research",
    date: "2026-07-09",
    readingMinutes: 8,
    author: "Ines Varga",
    body: [
      {
        type: "p",
        text: "The APY shown on each pool is an estimate based on the last 30 days of rewards. It moves because the inputs move.",
      },
      { type: "h2", text: "The main inputs" },
      {
        type: "list",
        items: [
          "Total amount staked on the network: more stake usually means a lower yield per token",
          "Network issuance or inflation schedule",
          "Transaction fees and tips paid to validators",
          "Our validators’ performance",
        ],
      },
      {
        type: "p",
        text: "Of these, total network stake has the largest effect over months; fees cause most of the day-to-day noise.",
      },
    ],
  },
  {
    slug: "two-factor-everywhere",
    title: "Two-factor authentication is now required for withdrawals",
    excerpt: "From next month every withdrawal needs a second factor. Here is how to set one up in a minute.",
    category: "Security",
    date: "2026-06-19",
    readingMinutes: 3,
    author: "Nora Brandt",
    body: [
      {
        type: "p",
        text: "Starting next month, every withdrawal will ask for a code from an authenticator app or a hardware security key.",
      },
      { type: "p", text: "Open Settings, then Security, and choose Set up two-factor. It takes about a minute." },
    ],
  },
  {
    slug: "solana-pool-validator-set",
    title: "How we chose the validators in the Solana pool",
    excerpt: "Vote credits, commission history and where each validator runs: the criteria behind the set.",
    category: "Research",
    date: "2026-05-28",
    readingMinutes: 7,
    author: "Tomasz Wren",
    body: [
      {
        type: "p",
        text: "The Solana pool delegates to 18 validators. We review the set every quarter against the same criteria.",
      },
      {
        type: "list",
        items: [
          "Vote credits in the top quartile over the last 90 days",
          "No commission increases without notice",
          "No more than a third of the set with one hosting provider or in one region",
        ],
      },
    ],
  },
  {
    slug: "dashboard-ledger-export",
    title: "CSV export and a cleaner transactions page",
    excerpt: "Download any date range, filter by pool, and see pending unstakes in their own list.",
    category: "Product",
    date: "2026-04-30",
    readingMinutes: 3,
    author: "Keiko Arai",
    body: [
      {
        type: "p",
        text: "The transactions page now separates completed activity from pending unstakes, and every table can be exported to CSV.",
      },
    ],
  },
  {
    slug: "staking-for-treasuries",
    title: "A short guide to staking for company treasuries",
    excerpt: "Approvals, reporting and withdrawal planning: what finance teams usually ask before they stake.",
    category: "Guides",
    date: "2026-03-26",
    readingMinutes: 9,
    author: "Felix Osei",
    body: [
      {
        type: "p",
        text: "Finance teams tend to ask the same questions before staking a treasury. Here are the short answers.",
      },
      { type: "h2", text: "Approvals" },
      { type: "p", text: "Business accounts can require two approvers for every stake, unstake and withdrawal." },
      { type: "h2", text: "Reporting" },
      { type: "p", text: "The rewards ledger exports per epoch, which makes monthly reconciliation straightforward." },
    ],
  },
];

export const POST_CATEGORIES: PostCategory[] = ["Research", "Product", "Security", "Guides"];

/** Newest first */
export const sortedPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date));

export const latestPosts = (count: number) => sortedPosts.slice(0, count);

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

/** Same category first, then the newest of the rest */
export function relatedPosts(post: Post, count = 3): Post[] {
  const others = sortedPosts.filter((p) => p.slug !== post.slug);
  return [
    ...others.filter((p) => p.category === post.category),
    ...others.filter((p) => p.category !== post.category),
  ].slice(0, count);
}
