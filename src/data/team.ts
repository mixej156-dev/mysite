/* Fictional team and open roles for the prototype. No real people. */

export type Department = "Leadership" | "Engineering" | "Validator operations" | "Security" | "Operations";

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  department: Department;
  /** Two or three sentences, shown for leadership on /team */
  bio?: string;
};

export const DEPARTMENTS: Department[] = [
  "Leadership",
  "Engineering",
  "Validator operations",
  "Security",
  "Operations",
];

export const TEAM: TeamMember[] = [
  {
    id: "lena",
    name: "Lena Marsh",
    role: "Chief Executive Officer",
    department: "Leadership",
    bio: "Co-founded LONAR ECO. after a decade in payments and distributed-systems infrastructure. Ran the first validators and still reads every incident review.",
  },
  {
    id: "omar",
    name: "Omar Haddad",
    role: "Chief Technology Officer",
    department: "Leadership",
    bio: "Leads engineering and validator operations. Built the per-epoch rewards ledger and owns the rule that every figure in the dashboard can be traced to its source.",
  },
  {
    id: "ines",
    name: "Ines Varga",
    role: "Head of Research",
    department: "Leadership",
    bio: "Studies how each network pays and penalises validators, and writes the quarterly performance reports. Decides which networks we add, and which we don’t.",
  },
  { id: "tomasz", name: "Tomasz Wren", role: "Staff Engineer, Protocols", department: "Engineering" },
  { id: "keiko", name: "Keiko Arai", role: "Frontend Engineer", department: "Engineering" },
  { id: "dev", name: "Dev Raman", role: "Backend Engineer, Rewards", department: "Engineering" },
  { id: "sara", name: "Sara Lindqvist", role: "Validator Operations Lead", department: "Validator operations" },
  { id: "mateo", name: "Mateo Ruiz", role: "Site Reliability Engineer", department: "Validator operations" },
  { id: "ade", name: "Ade Okafor", role: "Head of Security", department: "Security" },
  { id: "nora", name: "Nora Brandt", role: "Security Engineer", department: "Security" },
  { id: "felix", name: "Felix Osei", role: "Head of Client Operations", department: "Operations" },
  { id: "priya", name: "Priya Nair", role: "Compliance Manager", department: "Operations" },
];

export type Role = {
  id: string;
  title: string;
  department: Department;
  location: string;
  type: "Remote" | "Hybrid" | "On-site";
  /** One sentence on why the role exists */
  summary: string;
  responsibilities: string[];
  /** Experience that helps; none of it is a hard requirement */
  helps: string[];
};

export const OPEN_ROLES: Role[] = [
  {
    id: "sre",
    title: "Site Reliability Engineer",
    department: "Validator operations",
    location: "Europe",
    type: "Remote",
    summary: "Keep validators on six networks signing on time, and make the next incident smaller than the last.",
    responsibilities: [
      "Run and upgrade validator and sentry nodes across regions and hosting providers",
      "Share the on-call rota and write the incident reviews we publish",
      "Automate client upgrades so they never need a late-night manual step",
    ],
    helps: [
      "Production Linux and Kubernetes",
      "Running nodes for at least one proof-of-stake network",
      "Prometheus and Grafana",
    ],
  },
  {
    id: "be",
    title: "Senior Backend Engineer, Ledger",
    department: "Engineering",
    location: "Lisbon",
    type: "Hybrid",
    summary: "Own the ledger that records every reward per epoch, per position, before it reaches a dashboard.",
    responsibilities: [
      "Extend the rewards ledger to new networks and payout schedules",
      "Reconcile on-chain rewards against what the ledger recorded, every day",
      "Design the exports and APIs that funds use for their accounting",
    ],
    helps: ["Go or Rust", "PostgreSQL at scale", "Double-entry bookkeeping or payments systems"],
  },
  {
    id: "fe",
    title: "Product Designer",
    department: "Engineering",
    location: "Europe or Americas",
    type: "Remote",
    summary: "Make staking terms, risks and rewards as easy to read as a bank statement, and easier to check.",
    responsibilities: [
      "Design the dashboard, staking flows and public pages end to end",
      "Look after the design system and its documentation",
      "Test new flows with stakers before they ship",
    ],
    helps: ["A portfolio with data-heavy product work", "Writing interface copy", "Working closely with engineers"],
  },
  {
    id: "sec",
    title: "Detection Engineer",
    department: "Security",
    location: "Berlin",
    type: "Hybrid",
    summary: "Spot the unusual sign-in, withdrawal or key access before it becomes an incident.",
    responsibilities: [
      "Build detections across infrastructure, key management and account activity",
      "Run tabletop exercises with validator operations",
      "Triage bug bounty reports with the engineers who own the code",
    ],
    helps: ["Detection engineering or threat hunting", "Cloud audit logs", "Python or Go"],
  },
  {
    id: "ops",
    title: "Client Operations Specialist",
    department: "Operations",
    location: "Singapore",
    type: "On-site",
    summary: "Be the person funds talk to about onboarding, reporting and anything that looks off.",
    responsibilities: [
      "Onboard business accounts and their members",
      "Answer reward and withdrawal questions with the ledger open",
      "Turn repeated questions into docs and product fixes",
    ],
    helps: [
      "Client operations at a fund, bank or exchange",
      "Comfort with spreadsheets and CSV exports",
      "Mandarin or Bahasa",
    ],
  },
];

export type LeaderProfile = {
  memberId: string;
  /** Path under /public. Without one, a drawn portrait placeholder is shown. */
  photo?: string;
  bio: string;
  quote: string;
  achievements: { value: string; label: string }[];
  social: { network: string; href: string }[];
};

export const CEO: LeaderProfile = {
  memberId: "lena",
  bio: "Lena co-founded LONAR ECO. after a decade building payments and distributed-systems infrastructure. Before running the company, Lena ran its first validators and still reads every incident review.",
  quote:
    "Staking should feel like a ledger you can check, not a number you have to trust. If a reward can’t be traced to the epoch that earned it, we haven’t finished the job.",
  achievements: [
    { value: "14 yrs", label: "Building payments and distributed-systems infrastructure" },
    { value: "6 networks", label: "Supported today, up from the first two public pools" },
    { value: "40+ people", label: "On the team, grown from three founding engineers" },
    { value: "2025", label: "Introduced public quarterly validator reports" },
  ],
  social: [
    { network: "LinkedIn", href: "#" },
    { network: "X", href: "#" },
    { network: "GitHub", href: "#" },
  ],
};
