import type { LearnTopic } from "@/data/learn";
import type { NavArtSpec } from "./NavArt";

export type NavLink = {
  label: string;
  href: string;
  /** One line under the label in the mega-menu */
  description?: string;
  /** Small illustration beside the link in the mega-menu */
  art?: NavArtSpec;
};

/** Promo card on the right of a mega-menu panel */
export type NavFeature = {
  title: string;
  body: string;
  href: string;
  cta: string;
  /** Cover motif and colours, shared with ECO. LEARN covers */
  topic: LearnTopic;
  seed: string;
};

export type NavSection = {
  id: "staking" | "tools" | "company" | "resources";
  label: string;
  /** Pathname prefixes that mark this section as current */
  match: string[];
  links: NavLink[];
  feature: NavFeature;
};

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "staking",
    label: "Staking",
    match: ["/staking"],
    links: [
      {
        label: "All pools",
        href: "/staking",
        description: "Compare yield, lock-up and minimums",
        art: { kind: "pools", color: "blue", secondary: "amber" },
      },
    ],
    feature: {
      title: "Estimate your rewards",
      body: "Pick a pool and an amount to see projected earnings by month and year.",
      href: "/tools/calculator",
      cta: "Open calculator",
      topic: "Staking",
      seed: "nav-staking",
    },
  },
  {
    id: "tools",
    label: "Tools",
    match: ["/tools"],
    links: [
      {
        label: "Rewards calculator",
        href: "/tools/calculator",
        description: "Project earnings over time",
        art: { kind: "rings", color: "teal", secondary: "orange" },
      },
      {
        label: "Compare pools",
        href: "/tools/compare",
        description: "Side-by-side terms and yield",
        art: { kind: "bars", color: "amber", secondary: "blue" },
      },
      {
        label: "Converter",
        href: "/tools/converter",
        description: "Rates, network fees and arrival times",
        art: { kind: "exchange", color: "orange", secondary: "violet" },
      },
    ],
    feature: {
      title: "New to staking yields?",
      body: "APR, APY and fees explained with worked numbers, before you run the figures.",
      href: "/learn/apr-vs-apy",
      cta: "Read the guide",
      topic: "Markets",
      seed: "nav-tools",
    },
  },
  {
    id: "company",
    label: "Company",
    match: ["/about", "/team", "/security", "/contact"],
    links: [
      {
        label: "About",
        href: "/about",
        description: "Mission, history and figures",
        art: { kind: "timeline", color: "blue", secondary: "amber" },
      },
      {
        label: "Team & careers",
        href: "/team",
        description: "The people running the platform",
        art: { kind: "people", color: "violet", secondary: "teal" },
      },
      {
        label: "Security",
        href: "/security",
        description: "Custody, processes and bug bounty",
        art: { kind: "lock", color: "green", secondary: "blue" },
      },
      {
        label: "Contact",
        href: "/contact",
        description: "Support and partnership enquiries",
        art: { kind: "message", color: "rose", secondary: "amber" },
      },
    ],
    feature: {
      title: "We’re hiring",
      body: "Open roles in engineering, validator operations, security and client operations.",
      href: "/team#careers",
      cta: "See open roles",
      topic: "Technology",
      seed: "nav-company",
    },
  },
  {
    id: "resources",
    label: "Resources",
    match: ["/learn", "/blog", "/docs", "/faq", "/legal"],
    links: [
      {
        label: "ECO. LEARN",
        href: "/learn",
        description: "Guides from basics to DeFi",
        art: { kind: "stairs", color: "orange", secondary: "teal" },
      },
      {
        label: "Blog",
        href: "/blog",
        description: "Research, product notes and updates",
        art: { kind: "article", color: "blue", secondary: "amber" },
      },
      {
        label: "Docs",
        href: "/docs",
        description: "How staking on the platform works",
        art: { kind: "doc", color: "teal", secondary: "violet" },
      },
      {
        label: "FAQ",
        href: "/faq",
        description: "Short answers to common questions",
        art: { kind: "question", color: "amber", secondary: "rose" },
      },
    ],
    feature: {
      title: "Start with ECO. LEARN",
      body: "24 guides on wallets, staking, DeFi and markets, with worked examples and the risks named plainly.",
      href: "/learn",
      cta: "Browse guides",
      topic: "Fundamentals",
      seed: "nav-resources",
    },
  },
];

/** Illustration per staking pool in the mega-menu: abstract shapes, not network logos */
export const POOL_ART: Record<string, NavArtSpec> = {
  eth: { kind: "layers", color: "blue", secondary: "violet" },
  sol: { kind: "speed", color: "violet", secondary: "teal" },
  atom: { kind: "orbits", color: "teal", secondary: "amber" },
  dot: { kind: "dots", color: "rose", secondary: "blue" },
  avax: { kind: "peaks", color: "orange", secondary: "amber" },
  ada: { kind: "arcs", color: "green", secondary: "blue" },
};

export const FOOTER_COLUMNS: { title: string; links: NavLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Staking pools", href: "/staking" },
      { label: "Rewards calculator", href: "/tools/calculator" },
      { label: "Compare pools", href: "/tools/compare" },
      { label: "Converter", href: "/tools/converter" },
      { label: "All tools", href: "/tools" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Team & careers", href: "/team" },
      { label: "Security", href: "/security" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "ECO. LEARN", href: "/learn" },
      { label: "Blog", href: "/blog" },
      { label: "Docs", href: "/docs" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of use", href: "/legal/terms" },
      { label: "Privacy policy", href: "/legal/privacy" },
      { label: "Risk disclosure", href: "/legal/risk-disclosure" },
    ],
  },
];

export const SOCIAL_LINKS = ["X", "GitHub", "LinkedIn"];

export function isSectionActive(section: NavSection, pathname: string): boolean {
  return section.match.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}
