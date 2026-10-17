/* ECO. LEARN topic and level metadata. Kept apart from the guide texts so client components stay small. */

export type LearnTopic = "Fundamentals" | "Wallets & security" | "Staking" | "DeFi" | "Markets" | "Technology";
export type LearnLevel = "Beginner" | "Intermediate" | "Advanced";
export type GuideFormat = "Explainer" | "Guide" | "Checklist" | "Deep dive";

/** Names of --topic-* tokens; decorative cover colours only */
export type TopicColor = "blue" | "green" | "teal" | "orange" | "amber" | "violet" | "rose";

export type TopicMeta = { name: LearnTopic; description: string; color: TopicColor; secondary: TopicColor };

export const TOPICS: TopicMeta[] = [
  {
    name: "Fundamentals",
    description: "Blockchains, coins, tokens and what really happens when you send crypto.",
    color: "blue",
    secondary: "amber",
  },
  {
    name: "Wallets & security",
    description: "Keys, seed phrases, custody choices and how to avoid the common scams.",
    color: "green",
    secondary: "blue",
  },
  {
    name: "Staking",
    description: "Proof of stake, validator rewards, yield maths and liquid staking.",
    color: "teal",
    secondary: "orange",
  },
  {
    name: "DeFi",
    description: "Exchanges, lending and liquidity on-chain, and the risks that come with them.",
    color: "orange",
    secondary: "violet",
  },
  {
    name: "Markets",
    description: "Charts, supply, volatility and the habits that keep risk in proportion.",
    color: "amber",
    secondary: "rose",
  },
  {
    name: "Technology",
    description: "Consensus, cryptography, smart contracts and the layers built on top.",
    color: "violet",
    secondary: "teal",
  },
];

export const LEVELS: LearnLevel[] = ["Beginner", "Intermediate", "Advanced"];

/** What a card needs: everything except the article body */
export type GuideSummary = {
  slug: string;
  title: string;
  excerpt: string;
  topic: LearnTopic;
  level: LearnLevel;
  minutes: number;
};

export function getTopic(name: LearnTopic) {
  return TOPICS.find((t) => t.name === name) ?? TOPICS[0];
}
