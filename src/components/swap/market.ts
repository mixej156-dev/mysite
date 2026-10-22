import type { Asset, ConversionTerms, Network, Prices } from "@/lib/api/catalog";
import type { FeeSpeed } from "@/data/networks";
import { networkFee } from "@/data/networks";
import { formatNumber } from "@/lib/format";

export type { FeeSpeed };

export const SPEEDS: { id: FeeSpeed; label: string }[] = [
  { id: "slow", label: "Slow" },
  { id: "standard", label: "Standard" },
  { id: "fast", label: "Fast" },
];

/** Logo for an asset: the network logos for the pool coins, the coin set for stablecoins, none for fiat */
const LOGOS: Record<string, string> = {
  ETH: "/logos/networks/eth.svg",
  SOL: "/logos/networks/sol.svg",
  ATOM: "/logos/networks/atom.svg",
  DOT: "/logos/networks/dot.svg",
  AVAX: "/logos/networks/avax.svg",
  ADA: "/logos/networks/ada.svg",
  USDC: "/logos/coins/usdc.svg",
  USDT: "/logos/coins/usdt.svg",
};
const FIAT_SYMBOLS: Record<string, string> = { USD: "$", EUR: "€" };

export function assetLogo(ticker: string): { src: string } | { symbol: string } {
  return LOGOS[ticker] ? { src: LOGOS[ticker] } : { symbol: FIAT_SYMBOLS[ticker] ?? ticker.slice(0, 1) };
}

export function minutesLabel(minutes: number) {
  return minutes < 1 ? "under a minute" : `about ${Math.round(minutes)} min`;
}

export type Quote = ReturnType<Market["quote"]>;

/** Lookups, formatting and the quote maths over the terms and prices the page loaded. Pure. */
export function createMarket(terms: ConversionTerms, prices: Prices) {
  const usd = prices.usd;
  const getAsset = (ticker: string) => terms.assets.find((a) => a.ticker === ticker) ?? terms.assets[0];
  const getNetwork = (id: string) => terms.networks.find((n) => n.id === id) ?? terms.networks[0];

  const digitsFor = (ticker: string, value: number) => {
    if (getAsset(ticker).kind !== "crypto") return 2;
    return value >= 1000 ? 2 : value >= 1 ? 4 : 6;
  };
  const fmt = (value: number, ticker: string) => `${formatNumber(value, digitsFor(ticker, value))} ${ticker}`;

  const networkOptions = (asset: Asset) =>
    asset.kind === "fiat"
      ? [{ value: "bank", label: "Bank transfer" }]
      : asset.networks.map((id) => ({ value: id, label: getNetwork(id).name }));

  /** Everything a quote shows for one swap */
  const quote = (args: {
    amount: number;
    from: Asset;
    to: Asset;
    fromNetwork: Network | null;
    toNetwork: Network | null;
    speed: FeeSpeed;
    slippage: number;
  }) => {
    const { amount, from, to, fromNetwork, toNetwork, speed, slippage } = args;
    const rate = usd[from.ticker] / usd[to.ticker];
    const sameAsset = from.ticker === to.ticker;
    const gross = amount * rate;
    const conversionFee = sameAsset ? 0 : gross * terms.fee;
    const feeNative = toNetwork ? networkFee(toNetwork, to.ticker, speed) : 0;
    const feeInTo = toNetwork ? (feeNative * usd[toNetwork.nativeTicker]) / usd[to.ticker] : 0;
    const receive = Math.max(0, gross - conversionFee - feeInTo);
    const minReceived = sameAsset ? receive : receive * (1 - slippage);
    const minutes = (fromNetwork?.finalityMinutes ?? 0) + (toNetwork?.inclusionMinutes[speed] ?? 0);
    return { rate, sameAsset, gross, conversionFee, feeNative, feeInTo, receive, minReceived, minutes };
  };

  return { terms, prices, usd, getAsset, getNetwork, digitsFor, fmt, networkOptions, quote };
}

export type Market = ReturnType<typeof createMarket>;
