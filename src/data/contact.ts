/* Contact channels, topics and offices. Fictional company; addresses use the reserved example.com domain. */

export type ContactTopic = "support" | "partnerships" | "press" | "careers" | "other";

export const CONTACT_TOPICS: { id: ContactTopic; label: string; hint: string; reply: string }[] = [
  { id: "support", label: "Support", hint: "Account, staking, rewards, withdrawals", reply: "within one business day" },
  {
    id: "partnerships",
    label: "Partnerships",
    hint: "Funds, custodians, integrations",
    reply: "within two business days",
  },
  { id: "press", label: "Press", hint: "Interviews and media", reply: "the same day on weekdays" },
  { id: "careers", label: "Careers", hint: "Roles and applications", reply: "within a week" },
  { id: "other", label: "Something else", hint: "Anything not listed", reply: "within two business days" },
];

export const CHANNELS = [
  {
    id: "support",
    title: "Support",
    email: "support@example.com",
    note: "Account access and withdrawals: every day, around the clock. Other questions: Monday to Friday, 08:00–20:00 UTC.",
  },
  {
    id: "partnerships",
    title: "Partnerships",
    email: "partners@example.com",
    note: "Institutional staking, custody and integrations. Custom fees for large balances.",
  },
  { id: "press", title: "Press", email: "press@example.com", note: "Interviews, data requests and brand assets." },
] as const;

export type Office = {
  city: string;
  country: string;
  teams: string;
  utc: string;
  lon: number;
  lat: number;
  /** Put the map label above the pin to avoid a nearby office */
  labelAbove?: boolean;
};

export const OFFICES: Office[] = [
  {
    city: "Lisbon",
    country: "Portugal",
    teams: "Engineering, client operations",
    utc: "UTC+0 / +1",
    lon: -9.14,
    lat: 38.72,
  },
  {
    city: "Berlin",
    country: "Germany",
    teams: "Security, validator operations",
    utc: "UTC+1 / +2",
    lon: 13.4,
    lat: 52.52,
    labelAbove: true,
  },
  {
    city: "Singapore",
    country: "Singapore",
    teams: "Client operations, APAC support",
    utc: "UTC+8",
    lon: 103.82,
    lat: 1.35,
  },
];
