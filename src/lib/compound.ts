/**
 * Projected balance when rewards are restaked. APY already includes compounding,
 * so balance after t years = principal × (1 + apy)^t.
 */
export function projectBalances(principal: number, apyPercent: number, years: number): number[] {
  const rate = apyPercent / 100;
  return Array.from({ length: years + 1 }, (_, year) => principal * (1 + rate) ** year);
}
