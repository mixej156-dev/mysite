import { BookOpen, GraduationCap, Newspaper, type LucideIcon } from "lucide-react";
import { DOC_ARTICLES } from "@/data/docs";
import { FAQ } from "@/data/faq";
import { GUIDES } from "@/data/learn";
import { pools } from "@/data/pools";
import { sortedPosts } from "@/data/posts";
import { formatPercent, formatUnbonding } from "@/lib/format";
import { DASHBOARD_NAV } from "../dashboard/nav";
import { FAQ_CATEGORY_ICONS } from "../faq/categories";
import { NAV_SECTIONS, type NavTone } from "../layout/nav";

/*
 * What the site search looks through. Built from the same data the pages render, so it never drifts; loaded
 * only when the search opens (it pulls in the guide and doc texts), see SearchDialog.
 */

export type SearchGroup = "Pages" | "Pools" | "Your account" | "ECO. LEARN" | "Blog" | "Docs" | "FAQ";

export type SearchEntry = {
  id: string;
  group: SearchGroup;
  title: string;
  /** One line under the title */
  detail: string;
  href: string;
  /** The menu section it sits in; a match here ranks above one in the detail line */
  section?: string;
  /** Extra words that should find it without being shown */
  keywords?: string;
  /** Icon chip in the menu style; pools show their network logo instead */
  icon?: LucideIcon;
  tone: NavTone;
  poolId?: string;
};

export const GROUP_ORDER: SearchGroup[] = ["Pages", "Pools", "Your account", "ECO. LEARN", "Blog", "Docs", "FAQ"];

const pages: SearchEntry[] = NAV_SECTIONS.flatMap((section) =>
  section.links.map((link) => ({
    id: `page:${link.href}`,
    group: "Pages" as const,
    title: link.label,
    detail: link.description ?? section.label,
    href: link.href,
    section: section.label,
    icon: link.icon,
    tone: link.tone ?? "blue",
  })),
);

const poolEntries: SearchEntry[] = pools.map((pool) => ({
  id: `pool:${pool.id}`,
  group: "Pools",
  title: `${pool.name} (${pool.ticker})`,
  detail: `${formatPercent(pool.apy)} est. APY, ${formatUnbonding(pool.unbondingDays)} to withdraw`,
  href: `/staking/${pool.id}`,
  keywords: `stake staking pool ${pool.ticker} ${pool.description}`,
  tone: "blue",
  poolId: pool.id,
}));

const account: SearchEntry[] = DASHBOARD_NAV.map((item) => ({
  id: `account:${item.href}`,
  group: "Your account",
  title: item.label,
  detail: "Dashboard",
  href: item.href,
  keywords: "dashboard account",
  icon: item.icon,
  tone: "violet",
}));

const guides: SearchEntry[] = GUIDES.map((guide) => ({
  id: `learn:${guide.slug}`,
  group: "ECO. LEARN",
  title: guide.title,
  detail: `${guide.topic}, ${guide.level.toLowerCase()}, ${guide.minutes} min`,
  href: `/learn/${guide.slug}`,
  keywords: `guide learn ${guide.excerpt}`,
  icon: GraduationCap,
  tone: "amber",
}));

const posts: SearchEntry[] = sortedPosts.map((post) => ({
  id: `blog:${post.slug}`,
  group: "Blog",
  title: post.title,
  detail: `${post.category}, ${post.readingMinutes} min read`,
  href: `/blog/${post.slug}`,
  keywords: `blog article ${post.excerpt}`,
  icon: Newspaper,
  tone: "rose",
}));

const docs: SearchEntry[] = DOC_ARTICLES.map((doc) => ({
  id: `docs:${doc.slug}`,
  group: "Docs",
  title: doc.title,
  detail: doc.description,
  href: `/docs/${doc.slug}`,
  keywords: `docs documentation ${doc.section}`,
  icon: BookOpen,
  tone: "blue",
}));

/* FAQ answers open in place on /faq: the hash names the answer (FaqBrowser reads it) */
const faq: SearchEntry[] = FAQ.flatMap((category) =>
  category.items.map((item) => ({
    id: `faq:${category.id}-${item.id}`,
    group: "FAQ" as const,
    title: item.question,
    detail: category.title,
    href: `/faq#q-${category.id}-${item.id}`,
    keywords: `question ${item.answer}`,
    icon: FAQ_CATEGORY_ICONS[category.id].icon,
    tone: FAQ_CATEGORY_ICONS[category.id].tone,
  })),
);

export const SEARCH_ENTRIES: SearchEntry[] = [
  ...pages,
  ...poolEntries,
  ...account,
  ...guides,
  ...posts,
  ...docs,
  ...faq,
];

/** Shown before anything is typed */
export const SUGGESTED_IDS = ["page:/staking", "pool:eth", "page:/tools/calculator", "page:/fees", "page:/faq"];

const PER_GROUP = 4;

/**
 * Every word of the query has to appear somewhere in the entry. Titles count most (a title that starts with the
 * query first), then the menu section, the detail line and the hidden keywords. At most four per group, groups in a fixed order.
 */
export function searchEntries(query: string): SearchEntry[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return SUGGESTED_IDS.map((id) => SEARCH_ENTRIES.find((e) => e.id === id)!);
  const phrase = words.join(" ");

  const scored = SEARCH_ENTRIES.flatMap((entry) => {
    const title = entry.title.toLowerCase();
    const detail = entry.detail.toLowerCase();
    const section = (entry.section ?? "").toLowerCase();
    const all = `${title} ${detail} ${section} ${(entry.keywords ?? "").toLowerCase()}`;
    if (!words.every((w) => all.includes(w))) return [];
    let score = 0;
    if (title.startsWith(phrase)) score += 100;
    else if (title.includes(phrase)) score += 60;
    score += words.filter((w) => title.includes(w)).length * 20;
    score += words.filter((w) => section.includes(w)).length * 10;
    score += words.filter((w) => detail.includes(w)).length * 5;
    return [{ entry, score }];
  });

  return GROUP_ORDER.flatMap((group) =>
    scored
      .filter((s) => s.entry.group === group)
      .sort((a, b) => b.score - a.score)
      .slice(0, PER_GROUP)
      .map((s) => s.entry),
  );
}
