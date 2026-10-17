import type { ContentBlock } from "@/lib/content";

/* Template legal text for the prototype. Not legal advice; no jurisdiction or licence is claimed. */

export type LegalDoc = { slug: string; title: string; updated: string; summary: string; body: ContentBlock[] };

export const LEGAL_DOCS: LegalDoc[] = [
  {
    slug: "terms",
    title: "Terms of use",
    updated: "2026-09-01",
    summary: "The rules for using the website and the staking service.",
    body: [
      { type: "h2", text: "Who these terms are for" },
      {
        type: "p",
        text: "These terms apply to anyone who visits the website or opens an account. By using the service you agree to them.",
      },
      { type: "h2", text: "Your account" },
      {
        type: "list",
        items: [
          "Keep your sign-in details and recovery codes private",
          "Tell us straight away if you think someone else has accessed your account",
          "Give accurate information when you sign up and keep it up to date",
        ],
      },
      { type: "h2", text: "Staking through the service" },
      {
        type: "p",
        text: "Estimated yields, unbonding periods and fees are shown before you confirm a stake. Estimates are not promises; rewards depend on each network.",
      },
      { type: "h2", text: "Fees" },
      {
        type: "p",
        text: "The platform fee is a share of rewards and is shown on each pool page. Network fees are paid to the network, not to us.",
      },
      { type: "h2", text: "Changes to these terms" },
      {
        type: "p",
        text: "We may update these terms. We will tell account holders by email before material changes take effect.",
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy policy",
    updated: "2026-09-01",
    summary: "What personal data we collect, why, and the choices you have.",
    body: [
      { type: "h2", text: "What we collect" },
      {
        type: "list",
        items: [
          "Account details: email address and, for business accounts, company information",
          "Activity: stakes, unstakes, withdrawals and rewards",
          "Technical data: device and browser information, sign-in times",
        ],
      },
      { type: "h2", text: "Why we use it" },
      {
        type: "p",
        text: "To run your account, keep it secure, meet legal obligations that apply to us, and improve the service.",
      },
      { type: "h2", text: "Who we share it with" },
      {
        type: "p",
        text: "Service providers that help us run the platform, under contracts that limit how they use the data. We don’t sell personal data.",
      },
      { type: "h2", text: "Your choices" },
      {
        type: "p",
        text: "You can ask for a copy of your data, ask us to correct it, or close your account. Write to privacy@example.com.",
      },
    ],
  },
  {
    slug: "risk-disclosure",
    title: "Risk disclosure",
    updated: "2026-09-01",
    summary: "What can go wrong when you stake, in plain terms. Read this before staking.",
    body: [
      {
        type: "p",
        text: "Staking can lose money. This page explains the main risks so you can decide whether staking suits you.",
      },
      { type: "h2", text: "Slashing" },
      {
        type: "p",
        text: "Networks can remove part of a validator’s stake if it breaks protocol rules. A slashing loss reduces the balance of the affected pool and is shared between its stakers in proportion to their stake.",
      },
      { type: "h2", text: "Price" },
      {
        type: "p",
        text: "Rewards are paid in the staked asset. If its price falls, the value of your stake and rewards falls with it, possibly by more than the rewards earned.",
      },
      { type: "h2", text: "Liquidity" },
      {
        type: "p",
        text: "Unstaked tokens are locked for the network’s unbonding period. During that time they earn nothing and can’t be sold or moved.",
      },
      { type: "h2", text: "Variable yield" },
      { type: "p", text: "APY figures are estimates from recent rewards. They change daily and are not guaranteed." },
      { type: "h2", text: "Technology and operations" },
      {
        type: "p",
        text: "Software bugs, outages at hosting providers or in network clients, and attacks can reduce rewards or cause losses despite our controls.",
      },
      { type: "h2", text: "Regulation" },
      {
        type: "p",
        text: "Rules on staking differ between countries and can change, which may limit the service where you live.",
      },
    ],
  },
];

export function getLegalDoc(slug: string) {
  return LEGAL_DOCS.find((doc) => doc.slug === slug);
}
