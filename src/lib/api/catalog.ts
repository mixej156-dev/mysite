import { DOC_ARTICLES } from "@/data/docs";
import { GUIDES } from "@/data/learn";
import { metrics, type Metric } from "@/data/metrics";
import { ASSETS, CONVERSION_FEE, NETWORKS, SLIPPAGE_OPTIONS, type Asset, type Network } from "@/data/networks";
import { pools, type Pool } from "@/data/pools";
import { posts } from "@/data/posts";
import { CHANGE_24H, USD_PRICES } from "@/data/prices";
import {
  INCIDENTS,
  LATEST_REPORT,
  NETWORK_PERFORMANCE,
  uptimeHistory,
  type Incident,
  type NetworkPerformance,
  type UptimeDay,
} from "@/data/validators";

/*
 * Public catalogue: what a backend would serve to anyone, signed in or not. Every route page, metadata function,
 * link preview and the sitemap read through here, and pass the results to components as props.
 *
 * Today each function resolves the mock data in src/data. To connect a backend, replace a function's body with a
 * request (for example `fetch(`${API_URL}/pools`, { next: { revalidate: 60 } })`) that returns the same type; the
 * pages need no change. The types live in src/data and are the contract.
 */

export type { Asset, Incident, Metric, Network, NetworkPerformance, Pool, UptimeDay };

export type Prices = { usd: Record<string, number>; change24h: Record<string, number> };

export type ConversionTerms = {
  networks: Network[];
  assets: Asset[];
  /** Share of the converted value, e.g. 0.005 */
  fee: number;
  slippageOptions: readonly number[];
};

export type ValidatorReport = {
  networks: NetworkPerformance[];
  incidents: Incident[];
  latestReport: { title: string; href: string };
};

/* ---------- Pools ---------- */

export async function getPools(): Promise<Pool[]> {
  return pools;
}

export async function getPool(id: string): Promise<Pool | undefined> {
  return pools.find((pool) => pool.id === id);
}

/* ---------- Market ---------- */

/** Reference prices in USD and their 24-hour change, by ticker */
export async function getPrices(): Promise<Prices> {
  return { usd: USD_PRICES, change24h: CHANGE_24H };
}

/** Networks, assets and the terms for converting between them */
export async function getConversionTerms(): Promise<ConversionTerms> {
  return { networks: NETWORKS, assets: ASSETS, fee: CONVERSION_FEE, slippageOptions: SLIPPAGE_OPTIONS };
}

/* ---------- Platform ---------- */

/** Headline figures for the whole platform: total staked, rewards paid, stakers, uptime */
export async function getPlatformMetrics(): Promise<Metric[]> {
  return metrics;
}

export async function getValidatorReport(): Promise<ValidatorReport> {
  return { networks: NETWORK_PERFORMANCE, incidents: INCIDENTS, latestReport: LATEST_REPORT };
}

/** Daily uptime for one network's validators, oldest first */
export async function getUptimeHistory(poolId: string): Promise<UptimeDay[]> {
  return uptimeHistory(poolId);
}

/* ---------- Content (a CMS later) ---------- */

/** Slugs and dates of everything published, for the sitemap */
export async function getContentIndex() {
  return {
    posts: posts.map((post) => ({ slug: post.slug, date: post.date })),
    guides: GUIDES.map((guide) => ({ slug: guide.slug })),
    docs: DOC_ARTICLES.map((doc) => ({ slug: doc.slug })),
  };
}
