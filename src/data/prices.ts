/* Reference USD prices for swaps and fee estimates. Static, not market data. */

export const USD_PRICES: Record<string, number> = {
  ETH: 2_640,
  SOL: 152.4,
  ATOM: 6.82,
  DOT: 5.31,
  AVAX: 27.9,
  ADA: 0.412,
  USDC: 1,
  USDT: 0.9998,
  USD: 1,
  EUR: 1.084,
};

/** 24-hour change against USD, as a fraction */
export const CHANGE_24H: Record<string, number> = {
  ETH: 0.0182,
  SOL: -0.0241,
  ATOM: 0.0065,
  DOT: -0.0113,
  AVAX: 0.0327,
  ADA: -0.0049,
  USDC: 0,
  USDT: -0.0001,
  USD: 0,
  EUR: 0.0012,
};

export const CONVERTIBLE = Object.keys(USD_PRICES);
