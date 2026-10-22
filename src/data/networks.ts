/* Networks and assets for swaps. Fees and times are typical reference figures, not live estimates. */

export type FeeSpeed = "slow" | "standard" | "fast";

export type Network = {
  id: string;
  name: string;
  /** Token the network fee is paid in */
  nativeTicker: string;
  /** Fee for a native transfer, in the native token */
  fee: Record<FeeSpeed, number>;
  /** Token transfers cost more on account-based chains */
  tokenFeeMultiplier: number;
  /** Minutes until the transfer is included in a block */
  inclusionMinutes: Record<FeeSpeed, number>;
  /** Minutes until a deposit is final enough to credit */
  finalityMinutes: number;
};

export type AssetKind = "crypto" | "stablecoin" | "fiat";

export type Asset = { ticker: string; name: string; kind: AssetKind; networks: string[] };

export const NETWORKS: Network[] = [
  {
    id: "ethereum",
    name: "Ethereum",
    nativeTicker: "ETH",
    fee: { slow: 0.00012, standard: 0.00019, fast: 0.00032 },
    tokenFeeMultiplier: 2.6,
    inclusionMinutes: { slow: 5, standard: 2, fast: 0.5 },
    finalityMinutes: 13,
  },
  {
    id: "solana",
    name: "Solana",
    nativeTicker: "SOL",
    fee: { slow: 0.000005, standard: 0.00001, fast: 0.00008 },
    tokenFeeMultiplier: 1.2,
    inclusionMinutes: { slow: 0.5, standard: 0.2, fast: 0.1 },
    finalityMinutes: 0.5,
  },
  {
    id: "cosmos",
    name: "Cosmos Hub",
    nativeTicker: "ATOM",
    fee: { slow: 0.002, standard: 0.004, fast: 0.01 },
    tokenFeeMultiplier: 1,
    inclusionMinutes: { slow: 1, standard: 0.5, fast: 0.2 },
    finalityMinutes: 0.2,
  },
  {
    id: "polkadot",
    name: "Polkadot",
    nativeTicker: "DOT",
    fee: { slow: 0.012, standard: 0.016, fast: 0.022 },
    tokenFeeMultiplier: 1,
    inclusionMinutes: { slow: 1, standard: 0.5, fast: 0.2 },
    finalityMinutes: 1,
  },
  {
    id: "avalanche",
    name: "Avalanche C-Chain",
    nativeTicker: "AVAX",
    fee: { slow: 0.0006, standard: 0.001, fast: 0.0018 },
    tokenFeeMultiplier: 2.2,
    inclusionMinutes: { slow: 1, standard: 0.3, fast: 0.1 },
    finalityMinutes: 0.1,
  },
  {
    id: "cardano",
    name: "Cardano",
    nativeTicker: "ADA",
    fee: { slow: 0.17, standard: 0.17, fast: 0.2 },
    tokenFeeMultiplier: 1.4,
    inclusionMinutes: { slow: 2, standard: 1, fast: 0.5 },
    finalityMinutes: 5,
  },
];

export const ASSETS: Asset[] = [
  { ticker: "ETH", name: "Ether", kind: "crypto", networks: ["ethereum"] },
  { ticker: "SOL", name: "Solana", kind: "crypto", networks: ["solana"] },
  { ticker: "ATOM", name: "Cosmos", kind: "crypto", networks: ["cosmos"] },
  { ticker: "DOT", name: "Polkadot", kind: "crypto", networks: ["polkadot"] },
  { ticker: "AVAX", name: "Avalanche", kind: "crypto", networks: ["avalanche"] },
  { ticker: "ADA", name: "Cardano", kind: "crypto", networks: ["cardano"] },
  { ticker: "USDC", name: "USD Coin", kind: "stablecoin", networks: ["ethereum", "solana", "avalanche"] },
  { ticker: "USDT", name: "Tether USD", kind: "stablecoin", networks: ["ethereum", "solana", "avalanche"] },
  { ticker: "USD", name: "US dollar", kind: "fiat", networks: [] },
  { ticker: "EUR", name: "Euro", kind: "fiat", networks: [] },
];

/** Share of the converted value charged by the platform. Same-asset network moves are free. */
export const CONVERSION_FEE = 0.005;

export const SLIPPAGE_OPTIONS = [0.001, 0.005, 0.01] as const;

export function getAsset(ticker: string) {
  return ASSETS.find((a) => a.ticker === ticker) ?? ASSETS[0];
}

export function getNetwork(id: string) {
  return NETWORKS.find((n) => n.id === id) ?? NETWORKS[0];
}

/** Network fee to send `ticker` on `network`, in the network's native token */
export function networkFee(network: Network, ticker: string, speed: FeeSpeed) {
  return network.fee[speed] * (ticker === network.nativeTicker ? 1 : network.tokenFeeMultiplier);
}
