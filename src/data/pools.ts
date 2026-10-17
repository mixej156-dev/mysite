/*
 * Demo staking pools. All figures are illustrative and not live network data.
 */

export type Pool = {
  /** URL slug: /staking/[id] */
  id: string;
  name: string;
  ticker: string;
  network: string;
  /** Estimated annual yield, percent, after platform fee */
  apy: number;
  /** Days between unstake request and funds becoming available; 0 = no unbonding queue */
  unbondingDays: number;
  minStake: number;
  /** Shown in the header mega-menu and on the home page */
  featured: boolean;
  /** Value staked in the pool, USD */
  tvl: number;
  validators: number;
  /** Platform fee, percent of rewards (already deducted from apy) */
  feePercent: number;
  /** How often rewards reach the wallet */
  payout: "Daily";
  description: string;
};

export const pools: Pool[] = [
  {
    id: "eth",
    name: "Ethereum",
    ticker: "ETH",
    network: "Ethereum",
    apy: 3.8,
    unbondingDays: 5,
    minStake: 0.1,
    featured: true,
    tvl: 412_600_000,
    validators: 64,
    feePercent: 10,
    payout: "Daily",
    description:
      "Stake ETH with validators on the Ethereum beacon chain. Rewards come from attestations and block proposals, recorded each epoch and paid out daily. Exits follow the network’s withdrawal queue, which usually clears within a few days.",
  },
  {
    id: "sol",
    name: "Solana",
    ticker: "SOL",
    network: "Solana",
    apy: 6.9,
    unbondingDays: 3,
    minStake: 1,
    featured: true,
    tvl: 286_300_000,
    validators: 18,
    feePercent: 8,
    payout: "Daily",
    description:
      "Delegate SOL to a set of validators chosen for vote credits and commission history. Rewards accrue each epoch (around two days) and are paid out daily. Deactivating a stake takes until the end of the current epoch.",
  },
  {
    id: "atom",
    name: "Cosmos Hub",
    ticker: "ATOM",
    network: "Cosmos",
    apy: 14.2,
    unbondingDays: 21,
    minStake: 5,
    featured: true,
    tvl: 198_400_000,
    validators: 12,
    feePercent: 8,
    payout: "Daily",
    description:
      "Delegate ATOM to Cosmos Hub validators. Rewards include inflation and a share of transaction fees. Unbonding takes 21 days, during which tokens earn nothing and can’t be moved.",
  },
  {
    id: "dot",
    name: "Polkadot",
    ticker: "DOT",
    network: "Polkadot",
    apy: 11.5,
    unbondingDays: 28,
    minStake: 10,
    featured: true,
    tvl: 154_900_000,
    validators: 16,
    feePercent: 10,
    payout: "Daily",
    description:
      "Nominate DOT to validators in the active set. Rewards are distributed per era (about 24 hours). Unbonding takes 28 days.",
  },
  {
    id: "avax",
    name: "Avalanche",
    ticker: "AVAX",
    network: "Avalanche C-Chain",
    apy: 7.4,
    unbondingDays: 14,
    minStake: 25,
    featured: false,
    tvl: 91_200_000,
    validators: 9,
    feePercent: 10,
    payout: "Daily",
    description:
      "Stake AVAX on the Primary Network. Rewards depend on validator uptime and are paid out daily. Staking periods end after the chosen term; early exits follow a 14-day release.",
  },
  {
    id: "ada",
    name: "Cardano",
    ticker: "ADA",
    network: "Cardano",
    apy: 2.9,
    unbondingDays: 0,
    minStake: 10,
    featured: false,
    tvl: 64_700_000,
    validators: 7,
    feePercent: 6,
    payout: "Daily",
    description:
      "Delegate ADA to stake pools on Cardano. Funds never leave your control and there is no lock-up: rewards start after two epochs and are then paid out daily.",
  },
];

export const featuredPools = pools.filter((pool) => pool.featured);

export function getPool(id: string): Pool | undefined {
  return pools.find((pool) => pool.id === id);
}

/** Risks shown on every pool page; network-specific notes come from the pool description. */
export const POOL_RISKS = [
  {
    title: "Slashing",
    body: "If a validator breaks protocol rules, the network can remove part of the stake. Losses would reduce the pool balance; the risk disclosure explains how they are allocated.",
  },
  {
    title: "Price",
    body: "Rewards are paid in the staked asset. Its market price can fall by more than the rewards earned.",
  },
  {
    title: "Liquidity",
    body: "Unstaked funds are unavailable until the unbonding period ends and earn nothing in the meantime.",
  },
  {
    title: "Variable yield",
    body: "APY is an estimate based on recent network rewards. It changes with network conditions and is not guaranteed.",
  },
];
