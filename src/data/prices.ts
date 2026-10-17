/* Demo USD prices for the converter and fee estimates. Static, not market data. */

export const USD_PRICES: Record<string, number> = {
  ETH: 2_640,
  SOL: 152.4,
  ATOM: 6.82,
  DOT: 5.31,
  AVAX: 27.9,
  ADA: 0.412,
  USD: 1,
};

export const CONVERTIBLE = Object.keys(USD_PRICES);
