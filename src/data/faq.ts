/* FAQ. Neutral wording, no guarantees. Figures match /fees, /validators, docs and the referral programme. */

export type FaqLink = { label: string; href: string };
export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  /** Further reading shown under the answer */
  links?: FaqLink[];
  /** Shown in the Popular questions block above the list */
  popular?: boolean;
};
export type FaqCategory = { id: string; title: string; items: FaqItem[] };

export const FAQ: FaqCategory[] = [
  {
    id: "start",
    title: "Getting started",
    items: [
      {
        id: "who",
        question: "Who is LONAR ECO. for?",
        answer:
          "Individuals and funds who want staking rewards without running validators themselves, and who want to see exactly how each reward was earned.",
        links: [{ label: "About us", href: "/about" }],
      },
      {
        id: "networks",
        question: "Which networks can I stake on?",
        answer:
          "Ethereum, Solana, Cosmos Hub, Polkadot, Avalanche and Cardano. Each has its own pool with its own terms.",
        links: [{ label: "All pools", href: "/staking" }],
        popular: true,
      },
      {
        id: "account",
        question: "What do I need to open an account?",
        answer:
          "An email address and a password. Turn on two-factor authentication before your first withdrawal; it is required for withdrawals.",
        links: [{ label: "Create an account", href: "/docs/create-an-account" }],
      },
      {
        id: "new",
        question: "I’m new to crypto. Where should I start?",
        answer:
          "ECO. LEARN has short guides from what a blockchain is to how staking rewards work, with worked numbers and the risks named plainly.",
        links: [
          { label: "What is a blockchain?", href: "/learn/what-is-a-blockchain" },
          { label: "ECO. LEARN", href: "/learn" },
        ],
      },
      {
        id: "business",
        question: "Do you support business accounts?",
        answer:
          "Yes. Business accounts can add members with roles: owners manage withdrawals, operators stake and unstake, viewers only read balances and reports.",
      },
    ],
  },
  {
    id: "staking",
    title: "Staking",
    items: [
      {
        id: "what",
        question: "What does staking mean here?",
        answer:
          "You add tokens to a pool, we delegate them to validators we run, and you receive your share of the rewards they earn, minus the platform fee.",
        links: [{ label: "Proof of stake, explained", href: "/learn/proof-of-stake-explained" }],
      },
      {
        id: "minimum",
        question: "Is there a minimum stake?",
        answer: "Yes, it depends on the pool: from 0.1 ETH on Ethereum to 25 AVAX on Avalanche. There is no maximum.",
        links: [{ label: "Compare pools", href: "/tools/compare" }],
      },
      {
        id: "apy",
        question: "Is the APY guaranteed?",
        answer:
          "No. It is an estimate based on recent network rewards, shown after the platform fee, and it changes every day. Past yield doesn’t predict future yield.",
        links: [{ label: "APR vs APY", href: "/learn/apr-vs-apy" }],
        popular: true,
      },
      {
        id: "several",
        question: "Can I stake in several pools?",
        answer: "Yes. Each stake is a separate position with its own rewards, settings and unbonding period.",
      },
      {
        id: "start-earning",
        question: "When does a new stake start earning?",
        answer: "From the next epoch. The first reward is recorded the following day and paid out daily after that.",
      },
      {
        id: "custody",
        question: "Who controls the staked tokens?",
        answer:
          "Tokens are delegated through each network’s own staking protocol. How custody works differs by network; the risk disclosure describes it for each one.",
        links: [{ label: "Risk disclosure", href: "/legal/risk-disclosure" }],
      },
      {
        id: "risks",
        question: "What can go wrong?",
        answer:
          "The main risks are slashing (a network penalty on validators), the asset’s price falling, and funds being locked during unbonding.",
        links: [
          { label: "Risk disclosure", href: "/legal/risk-disclosure" },
          { label: "Security", href: "/security" },
        ],
      },
    ],
  },
  {
    id: "rewards",
    title: "Rewards",
    items: [
      {
        id: "when",
        question: "When are rewards paid?",
        answer:
          "Rewards are recorded every epoch and paid out once a day at 00:00 UTC, to your wallet or back into the stake.",
        links: [{ label: "Rewards and payouts", href: "/docs/rewards-and-payouts" }],
        popular: true,
      },
      {
        id: "restake",
        question: "Can rewards be restaked automatically?",
        answer: "Yes. Turn on auto-restake for a position and each payout is added to the stake. It’s off by default.",
      },
      {
        id: "vary",
        question: "Why are my rewards different from yesterday?",
        answer:
          "Network rewards move with how much of the supply is staked, how busy the network is, and how often our validators are chosen to propose blocks.",
        links: [{ label: "How validators earn", href: "/learn/validator-economics" }],
      },
      {
        id: "trace",
        question: "Can I see where a reward came from?",
        answer:
          "Yes. The rewards ledger lists every reward and penalty by epoch and validator, before and after the fee.",
      },
      {
        id: "tax",
        question: "Do you provide tax documents?",
        answer:
          "You can export the rewards ledger as CSV with the date and value of each reward. We don’t give tax advice; check the rules where you live.",
      },
    ],
  },
  {
    id: "fees",
    title: "Fees",
    items: [
      {
        id: "fee",
        question: "What does it cost?",
        answer:
          "One platform fee: a share of rewards between 6% and 10% depending on the pool. Deposits, staking and unstaking are free.",
        links: [{ label: "All fees", href: "/fees" }],
        popular: true,
      },
      {
        id: "principal",
        question: "Is the fee ever taken from my principal?",
        answer:
          "No. It is a share of each reward. If a pool earns nothing on a day, there is nothing to take a fee from.",
      },
      {
        id: "network",
        question: "Who gets the network fee?",
        answer:
          "The network, not us. When you withdraw, the network fee is passed through at cost. It changes with network load.",
        links: [{ label: "Network fees", href: "/fees" }],
      },
      {
        id: "convert",
        question: "What does converting cost?",
        answer:
          "0.5% of the converted value, plus the network fee for delivery. Moving the same asset between networks is free.",
        links: [{ label: "Swap", href: "/swap" }],
      },
      {
        id: "change",
        question: "Can fees change?",
        answer:
          "Fee changes are announced at least 30 days in advance by email and in the dashboard. Positions keep the old fee until the change takes effect.",
      },
    ],
  },
  {
    id: "withdrawals",
    title: "Withdrawals",
    items: [
      {
        id: "how-long",
        question: "How long does unstaking take?",
        answer:
          "It depends on the network: none on Cardano, about 3 days on Solana, about 5 on Ethereum, and up to 28 days on Polkadot.",
        links: [{ label: "Unbonding periods", href: "/docs/unbonding-periods" }],
        popular: true,
      },
      {
        id: "earn",
        question: "Do I earn rewards while unbonding?",
        answer: "No. Tokens in the unbonding queue earn nothing and can’t be moved until they are released.",
      },
      {
        id: "cancel",
        question: "Can I cancel an unstake?",
        answer:
          "On most networks unbonding can’t be cancelled. To keep earning, stake the funds again once they are released.",
      },
      {
        id: "partial",
        question: "Can I unstake part of a position?",
        answer: "Yes. The rest keeps earning, and the unstaked part gets its own unbonding timer.",
      },
      {
        id: "address",
        question: "Where do withdrawals go?",
        answer:
          "To an address on your withdrawal allowlist. New addresses take 24 hours to activate, to protect you if your account is compromised.",
        links: [{ label: "Withdrawal addresses", href: "/docs/withdrawal-addresses" }],
      },
    ],
  },
  {
    id: "validators",
    title: "Validators & performance",
    items: [
      {
        id: "uptime",
        question: "How reliable are your validators?",
        answer:
          "Stake-weighted uptime over the last 30 days is published per network, along with missed duties and every incident.",
        links: [{ label: "Validator performance", href: "/validators" }],
        popular: true,
      },
      {
        id: "slashed",
        question: "What happens if a validator is slashed?",
        answer:
          "The penalty reduces the affected pool’s balance and shows as a separate line in the ledger, with no platform fee on it. We publish a review of the cause. There have been no slashing events since 2021.",
        links: [{ label: "Slashing and performance", href: "/docs/slashing-and-performance" }],
      },
      {
        id: "incident",
        question: "How will I hear about an incident?",
        answer:
          "A status note goes out while we work on it, affected stakers are contacted directly, and a written review follows on the validator performance page.",
        links: [{ label: "Incident reviews", href: "/validators" }],
      },
      {
        id: "where",
        question: "Where do your validators run?",
        answer:
          "Across several regions and hosting providers, with more than one client where the network allows it, so a single outage or bug doesn’t stop a pool.",
      },
      {
        id: "reports",
        question: "Do you publish performance reports?",
        answer: "Yes, every quarter, with per-validator figures and the reviews behind each incident.",
        links: [{ label: "Q3 report", href: "/blog/q3-validator-performance" }],
      },
    ],
  },
  {
    id: "account",
    title: "Account & security",
    items: [
      {
        id: "2fa",
        question: "Is two-factor authentication required?",
        answer: "It is required for withdrawals and strongly recommended for every sign-in.",
        links: [{ label: "Set up two-factor", href: "/docs/two-factor-authentication" }],
      },
      {
        id: "lost",
        question: "I lost my two-factor device",
        answer:
          "Use one of your recovery codes, then set up a new device. Without codes, contact support to start an identity check.",
      },
      {
        id: "api",
        question: "Can API keys move funds?",
        answer:
          "No. API keys are read-only: they can see positions, rewards and transactions, but can’t stake, unstake or withdraw.",
        links: [{ label: "API keys", href: "/docs/api-keys" }],
      },
      {
        id: "phishing",
        question: "Will you ever ask for my password or codes?",
        answer:
          "Never. Nobody from LONAR ECO. will ask for your password, two-factor codes, recovery codes or a seed phrase.",
        links: [{ label: "Spotting scams", href: "/learn/spotting-crypto-scams" }],
      },
      {
        id: "referral",
        question: "How does the referral programme work?",
        answer:
          "Share your link. When someone you invite stakes, you receive 10% of the platform fee on their rewards for 12 months. Their yield doesn’t change.",
      },
      {
        id: "close",
        question: "How do I close my account?",
        answer: "Unstake and withdraw everything, then choose Close account in Settings.",
      },
    ],
  },
];

export const FAQ_COUNT = FAQ.reduce((n, c) => n + c.items.length, 0);
