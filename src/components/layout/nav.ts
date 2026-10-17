export type NavLink = {
  label: string;
  href: string;
  /** One line under the label in the mega-menu */
  description?: string;
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
    match: ["/staking"],
    links: [{ label: "All pools", href: "/staking", description: "Compare yield, lock-up and minimums" }],
  },
  {
    id: "tools",
    label: "Tools",
    match: ["/tools"],
    links: [
      { label: "Rewards calculator", href: "/tools/calculator", description: "Project earnings over time" },
      { label: "Compare pools", href: "/tools/compare", description: "Side-by-side terms and yield" },
      { label: "Converter", href: "/tools#converter", description: "Convert between supported assets" },
      { label: "Gas estimate", href: "/tools#gas", description: "Typical network fees to stake and unstake" },
    ],
  },
  {
    id: "company",
    label: "Company",
    match: ["/about", "/team", "/security", "/contact"],
    links: [
      { label: "About", href: "/about", description: "Mission, history and figures" },
      { label: "Team & careers", href: "/team", description: "The people running the platform" },
      { label: "Security", href: "/security", description: "Custody, processes and bug bounty" },
      { label: "Contact", href: "/contact", description: "Support and partnership enquiries" },
    ],
  },
  {
    id: "resources",
    label: "Resources",
    match: ["/blog", "/docs", "/faq", "/legal"],
    links: [
      { label: "Blog", href: "/blog", description: "Research, product notes and updates" },
      { label: "Docs", href: "/docs", description: "How staking on the platform works" },
      { label: "FAQ", href: "/faq", description: "Short answers to common questions" },
      { label: "Risk disclosure", href: "/legal/risk-disclosure", description: "What can go wrong, in plain terms" },
    ],
  },
];

export const FOOTER_COLUMNS: { title: string; links: NavLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Staking pools", href: "/staking" },
      { label: "Rewards calculator", href: "/tools/calculator" },
      { label: "Compare pools", href: "/tools/compare" },
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
