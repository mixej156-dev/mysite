import {
  ArrowLeftRight,
  BookOpen,
  Building2,
  Calculator,
  CircleHelp,
  Columns2,
  GraduationCap,
  Layers,
  LayoutDashboard,
  MessageCircle,
  Newspaper,
  Receipt,
  ShieldCheck,
  Activity,
  Users,
  type LucideIcon,
} from "lucide-react";

/** Hue an icon takes on hover in the mega-menu, from the decorative topic palette */
export type NavTone = "blue" | "green" | "teal" | "orange" | "amber" | "violet" | "rose";

export type NavLink = {
  label: string;
  href: string;
  /** One line under the label in the mega-menu */
  description?: string;
  /** Mega-menu icon: grey at rest, `tone` on hover */
  icon?: LucideIcon;
  tone?: NavTone;
};

export type NavSection = {
  id: "staking" | "tools" | "company" | "resources";
  label: string;
  /** Pathname prefixes that mark this section as current */
  match: string[];
  links: NavLink[];
};

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "staking",
    label: "Staking",
    match: ["/staking", "/portfolio", "/validators", "/fees"],
    links: [
      {
        label: "All pools",
        href: "/staking",
        description: "Compare yield, lock-up and minimums",
        icon: Layers,
        tone: "blue",
      },
      {
        label: "Portfolio",
        href: "/portfolio",
        description: "Every stake and reward in one view",
        icon: LayoutDashboard,
        tone: "violet",
      },
      {
        label: "Validator performance",
        href: "/validators",
        description: "Uptime, missed duties and incidents",
        icon: Activity,
        tone: "green",
      },
      { label: "Fees", href: "/fees", description: "One fee on rewards, nothing else", icon: Receipt, tone: "amber" },
    ],
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
        icon: Calculator,
        tone: "violet",
      },
      {
        label: "Compare pools",
        href: "/tools/compare",
        description: "Side-by-side terms and yield",
        icon: Columns2,
        tone: "teal",
      },
      {
        label: "Converter",
        href: "/tools/converter",
        description: "Rates, network fees and arrival times",
        icon: ArrowLeftRight,
        tone: "orange",
      },
    ],
  },
  {
    id: "company",
    label: "Company",
    match: ["/about", "/team", "/security", "/contact"],
    links: [
      { label: "About", href: "/about", description: "Mission, history and figures", icon: Building2, tone: "blue" },
      {
        label: "Team & careers",
        href: "/team",
        description: "The people running the platform",
        icon: Users,
        tone: "violet",
      },
      {
        label: "Security",
        href: "/security",
        description: "Custody, processes and bug bounty",
        icon: ShieldCheck,
        tone: "green",
      },
      {
        label: "Contact",
        href: "/contact",
        description: "Support and partnership enquiries",
        icon: MessageCircle,
        tone: "teal",
      },
    ],
  },
  {
    id: "resources",
    label: "Resources",
    match: ["/learn", "/blog", "/docs", "/faq", "/legal"],
    links: [
      {
        label: "ECO. LEARN",
        href: "/learn",
        description: "Guides and courses, from basics to DeFi",
        icon: GraduationCap,
        tone: "amber",
      },
      {
        label: "Blog",
        href: "/blog",
        description: "Research, product notes and updates",
        icon: Newspaper,
        tone: "rose",
      },
      { label: "Docs", href: "/docs", description: "How staking on the platform works", icon: BookOpen, tone: "blue" },
      { label: "FAQ", href: "/faq", description: "Short answers to common questions", icon: CircleHelp, tone: "teal" },
    ],
  },
];

export const FOOTER_COLUMNS: { title: string; links: NavLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Staking pools", href: "/staking" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Fees", href: "/fees" },
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
      { label: "Validator performance", href: "/validators" },
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
