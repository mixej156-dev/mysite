/*
 * Demo staking pools. All figures are illustrative and not live network data.
 * Extended with detail fields (history, risks, FAQ) in Stage 5.
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
};

export const pools: Pool[] = [
  { id: "eth", name: "Ethereum", ticker: "ETH", network: "Ethereum", apy: 3.8, unbondingDays: 5, minStake: 0.1, featured: true },
  { id: "sol", name: "Solana", ticker: "SOL", network: "Solana", apy: 6.9, unbondingDays: 3, minStake: 1, featured: true },
  { id: "atom", name: "Cosmos Hub", ticker: "ATOM", network: "Cosmos", apy: 14.2, unbondingDays: 21, minStake: 5, featured: true },
  { id: "dot", name: "Polkadot", ticker: "DOT", network: "Polkadot", apy: 11.5, unbondingDays: 28, minStake: 10, featured: true },
  { id: "avax", name: "Avalanche", ticker: "AVAX", network: "Avalanche C-Chain", apy: 7.4, unbondingDays: 14, minStake: 25, featured: false },
  { id: "ada", name: "Cardano", ticker: "ADA", network: "Cardano", apy: 2.9, unbondingDays: 0, minStake: 10, featured: false },
];

export const featuredPools = pools.filter((pool) => pool.featured);
