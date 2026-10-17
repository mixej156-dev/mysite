/* Demo blog posts. Full article bodies are added in Stage 5. */

export type PostCategory = "Research" | "Product" | "Security" | "Guides";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: PostCategory;
  /** ISO date */
  date: string;
  readingMinutes: number;
  author: string;
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
  },
  {
    slug: "q3-validator-performance",
    title: "Q3 validator performance report",
    excerpt: "Uptime, missed attestations and the two incidents we had this quarter, with what changed afterwards.",
    category: "Research",
    date: "2026-10-01",
    readingMinutes: 11,
    author: "Tomasz Wren",
  },
  {
    slug: "daily-payouts-now-default",
    title: "Daily payouts are now the default for every pool",
    excerpt: "Rewards used to settle weekly on some networks. Here is what moving to daily changes for you.",
    category: "Product",
    date: "2026-09-18",
    readingMinutes: 4,
    author: "Ines Varga",
  },
  {
    slug: "what-slashing-means-for-stakers",
    title: "What slashing means for stakers",
    excerpt: "Why penalties exist, how often they happen in practice, and how losses would be allocated.",
    category: "Security",
    date: "2026-09-04",
    readingMinutes: 9,
    author: "Ade Okafor",
  },
  {
    slug: "choosing-a-lock-up",
    title: "Choosing between flexible and locked pools",
    excerpt: "Unbonding periods differ by network. A short guide to matching them with when you might need funds.",
    category: "Guides",
    date: "2026-08-21",
    readingMinutes: 6,
    author: "Tomasz Wren",
  },
  {
    slug: "key-ceremony-explained",
    title: "Our validator key ceremony, explained",
    excerpt: "How signing keys are generated, split and stored, and who is in the room when it happens.",
    category: "Security",
    date: "2026-08-07",
    readingMinutes: 8,
    author: "Ade Okafor",
  },
];

export const latestPosts = (count: number) =>
  [...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, count);
