/* Typical network fees in the native token. Demo figures for the gas estimate tool. */

export type FeeSpeed = "standard" | "fast";
export type FeeAction = "stake" | "unstake" | "claim";

export type NetworkFees = {
  poolId: string;
  ticker: string;
  network: string;
  fees: Record<FeeSpeed, Record<FeeAction, number>>;
};

export const networkFees: NetworkFees[] = [
  {
    poolId: "eth",
    ticker: "ETH",
    network: "Ethereum",
    fees: {
      standard: { stake: 0.00042, unstake: 0.00031, claim: 0.00018 },
      fast: { stake: 0.00071, unstake: 0.00053, claim: 0.0003 },
    },
  },
  {
    poolId: "sol",
    ticker: "SOL",
    network: "Solana",
    fees: {
      standard: { stake: 0.000005, unstake: 0.000005, claim: 0.000005 },
      fast: { stake: 0.00005, unstake: 0.00005, claim: 0.00005 },
    },
  },
  {
    poolId: "atom",
    ticker: "ATOM",
    network: "Cosmos",
    fees: {
      standard: { stake: 0.005, unstake: 0.005, claim: 0.004 },
      fast: { stake: 0.0125, unstake: 0.0125, claim: 0.01 },
    },
  },
  {
    poolId: "dot",
    ticker: "DOT",
    network: "Polkadot",
    fees: {
      standard: { stake: 0.018, unstake: 0.016, claim: 0.015 },
      fast: { stake: 0.025, unstake: 0.022, claim: 0.02 },
    },
  },
  {
    poolId: "avax",
    ticker: "AVAX",
    network: "Avalanche C-Chain",
    fees: {
      standard: { stake: 0.0021, unstake: 0.0018, claim: 0.0012 },
      fast: { stake: 0.0034, unstake: 0.0029, claim: 0.002 },
    },
  },
  {
    poolId: "ada",
    ticker: "ADA",
    network: "Cardano",
    fees: {
      standard: { stake: 0.18, unstake: 0.17, claim: 0.17 },
      fast: { stake: 0.18, unstake: 0.17, claim: 0.17 },
    },
  },
];
