/* FAQ for the prototype. Neutral wording, no guarantees. */

export type FaqItem = { id: string; question: string; answer: string };
export type FaqCategory = { id: string; title: string; items: FaqItem[] };

export const FAQ: FaqCategory[] = [
  {
    id: "staking",
    title: "Staking",
    items: [
      {
        id: "what",
        question: "What does staking mean here?",
        answer:
          "You add tokens to a pool, we delegate them to validators we run, and you receive your share of the rewards they earn, minus the platform fee.",
      },
      {
        id: "minimum",
        question: "Is there a minimum stake?",
        answer:
          "Yes, it depends on the pool, from 0.1 ETH on Ethereum to 25 AVAX on Avalanche. Each pool page shows it.",
      },
      {
        id: "apy",
        question: "Is the APY guaranteed?",
        answer: "No. It is an estimate based on recent network rewards and changes every day.",
      },
      {
        id: "several",
        question: "Can I stake in several pools?",
        answer: "Yes. Each stake is a separate position with its own rewards and unbonding.",
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
        answer: "Rewards are recorded every epoch and paid out to your wallet once a day.",
      },
      {
        id: "fee",
        question: "What is the platform fee?",
        answer:
          "A share of rewards, between 6% and 10% depending on the pool. There is no fee on the amount you stake.",
      },
      {
        id: "restake",
        question: "Can rewards be restaked automatically?",
        answer: "Yes. Turn on auto-restake for a position and each payout is added to the stake.",
      },
      {
        id: "tax",
        question: "Do you provide tax documents?",
        answer: "You can export the rewards ledger as CSV. We don’t give tax advice; check the rules where you live.",
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
          "It depends on the network: none on Cardano, a few days on Ethereum and Solana, up to 28 days on Polkadot.",
      },
      {
        id: "earn",
        question: "Do I earn rewards while unbonding?",
        answer: "No. Tokens in the unbonding queue earn nothing and can’t be moved.",
      },
      {
        id: "cancel",
        question: "Can I cancel an unstake?",
        answer:
          "On some networks you can restake during unbonding; the dashboard shows the option when it is available.",
      },
      {
        id: "address",
        question: "Where do withdrawals go?",
        answer: "To a withdrawal address on your allowlist. New addresses take 24 hours to activate.",
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
      },
      {
        id: "lost",
        question: "I lost my two-factor device",
        answer:
          "Use one of your recovery codes, then set up a new device. Without codes, contact support to start an identity check.",
      },
      {
        id: "close",
        question: "How do I close my account?",
        answer: "Unstake and withdraw everything, then choose Close account in Settings.",
      },
    ],
  },
];
