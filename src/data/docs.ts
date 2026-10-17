import type { ContentBlock } from "@/lib/content";

/* Documentation stub for the prototype: a few short articles in three sections. */

export type DocArticle = {
  slug: string;
  title: string;
  description: string;
  body: ContentBlock[];
};

export type DocSection = { title: string; articles: DocArticle[] };

export const DOC_SECTIONS: DocSection[] = [
  {
    title: "Getting started",
    articles: [
      {
        slug: "what-is-staking",
        title: "What is staking",
        description: "How proof-of-stake networks pay validators, and where you fit in.",
        body: [
          {
            type: "p",
            text: "Proof-of-stake networks are secured by validators that lock up tokens as collateral. In return for doing their work honestly, validators receive rewards from the network.",
          },
          { type: "h2", text: "Where rewards come from" },
          {
            type: "p",
            text: "Rewards come from new tokens issued by the network and from fees paid by its users. The mix differs by network; each pool page explains it.",
          },
          { type: "h2", text: "What staking with us means" },
          {
            type: "p",
            text: "You add tokens to a pool. We delegate them to validators we operate, record rewards each epoch, deduct the platform fee and pay out the rest daily.",
          },
          { type: "h2", text: "What can go wrong" },
          {
            type: "list",
            items: [
              "Slashing: a validator penalty that removes part of the stake",
              "Price: the asset can lose value",
              "Liquidity: unstaked funds are locked during unbonding",
            ],
          },
        ],
      },
      {
        slug: "create-an-account",
        title: "Create an account",
        description: "Sign up, verify your email and secure the account before your first stake.",
        body: [
          {
            type: "p",
            text: "You need an email address and a password. Business accounts can add more members later.",
          },
          { type: "h2", text: "Steps" },
          {
            type: "list",
            items: [
              "Choose Start staking and enter your email and a password",
              "Confirm the email we send you",
              "Turn on two-factor authentication in Settings",
            ],
          },
          { type: "h2", text: "Before your first stake" },
          {
            type: "p",
            text: "Add a withdrawal address and read the risk disclosure. You can then stake from the dashboard.",
          },
        ],
      },
    ],
  },
  {
    title: "Staking",
    articles: [
      {
        slug: "stake-and-unstake",
        title: "Stake and unstake",
        description: "Choose a pool, confirm the terms, and understand what happens when you unstake.",
        body: [
          { type: "p", text: "Staking takes a few steps and every term is shown before you confirm." },
          { type: "h2", text: "Stake" },
          {
            type: "list",
            items: [
              "Open Stake in the dashboard and choose a pool",
              "Enter an amount at or above the pool minimum",
              "Review the APY, fee and unbonding period, then confirm",
            ],
          },
          { type: "h2", text: "Unstake" },
          {
            type: "p",
            text: "Choose Unstake on a position. Funds enter the network’s unbonding queue and earn nothing until it ends. The expected release date is shown before you confirm.",
          },
        ],
      },
      {
        slug: "rewards-and-payouts",
        title: "Rewards and payouts",
        description: "How rewards are recorded per epoch and paid out daily, and how to read the ledger.",
        body: [
          {
            type: "p",
            text: "Rewards are recorded each epoch against the validator that earned them and paid out once a day.",
          },
          { type: "h2", text: "Restaking" },
          { type: "p", text: "Turn on auto-restake for a position to add each payout to the stake. Off by default." },
          { type: "h2", text: "The ledger" },
          {
            type: "p",
            text: "The rewards ledger lists every reward and penalty by epoch and validator, before and after the fee. Export any range as CSV.",
          },
        ],
      },
    ],
  },
  {
    title: "Account & security",
    articles: [
      {
        slug: "two-factor-authentication",
        title: "Two-factor authentication",
        description: "Protect sign-ins and withdrawals with an authenticator app or a security key.",
        body: [
          {
            type: "p",
            text: "Two-factor authentication asks for a second proof that it’s you. It is required for withdrawals.",
          },
          { type: "h2", text: "Set it up" },
          {
            type: "list",
            items: [
              "Open Settings, then Security",
              "Choose Set up two-factor",
              "Scan the code with an authenticator app, or add a hardware key",
            ],
          },
          { type: "h2", text: "Recovery codes" },
          { type: "p", text: "Store the recovery codes somewhere safe and offline. Each code works once." },
        ],
      },
      {
        slug: "api-keys",
        title: "API keys",
        description: "Read-only keys for reporting tools. Keys can’t move funds.",
        body: [
          { type: "p", text: "API keys let reporting and accounting tools read your positions and rewards." },
          { type: "h2", text: "Permissions" },
          { type: "p", text: "Keys are read-only. They can’t stake, unstake or withdraw." },
          { type: "h2", text: "Rotating a key" },
          { type: "p", text: "Create a new key, update your tool, then revoke the old key in Settings." },
        ],
      },
    ],
  },
];

export const DOC_ARTICLES = DOC_SECTIONS.flatMap((s) => s.articles.map((a) => ({ ...a, section: s.title })));

export function getDoc(slug: string) {
  return DOC_ARTICLES.find((a) => a.slug === slug);
}
