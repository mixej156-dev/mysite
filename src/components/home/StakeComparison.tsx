import { Check, Minus } from "lucide-react";
import { pools } from "@/data/pools";
import { LogoMark } from "../layout/Logo";
import { Section, SectionHeader } from "../blocks/Section";

const fees = pools.map((p) => p.feePercent);
const eth = pools.find((p) => p.id === "eth")!;

/* Our side comes from the pool data and the product; the other side describes common practice, no named provider */
const ROWS: { feature: string; eco: string; regular: string }[] = [
  { feature: "Reward payouts", eco: "Daily, straight to your wallet", regular: "Weekly or monthly, often batched" },
  {
    feature: "Reward records",
    eco: "Every epoch, per position, with CSV export",
    regular: "A single monthly total",
  },
  {
    feature: "Fees",
    eco: `${Math.min(...fees)}–${Math.max(...fees)}% of rewards, shown before you confirm`,
    regular: "Built into the rate, rarely itemised",
  },
  {
    feature: "Validator performance",
    eco: "Uptime and incidents published per network",
    regular: "Seldom published",
  },
  {
    feature: "Withdrawals",
    eco: "Only the network’s own unbonding period",
    regular: "Extra notice periods are common",
  },
  {
    feature: "Minimum stake",
    eco: `From ${eth.minStake} ${eth.ticker}`,
    regular: "Often higher; 32 ETH to run your own validator",
  },
  { feature: "Auto-restake", eco: "On or off for each position", regular: "All or nothing, where offered" },
  {
    feature: "Withdrawal protection",
    eco: "Two-factor required for every withdrawal",
    regular: "Two-factor often optional",
  },
];

/* The ECO. column reads as one tinted strip: no row rules inside it, rounded at both ends */
const ECO_CELL = "tint-accent px-4 py-4 align-top sm:px-6 md:py-5";
const OTHER_CELL = "border-b border-rule px-4 py-4 align-top sm:px-6 md:py-5";

/**
 * ECO. Stake next to a generic "regular stake": what the account gives you, line by line. Phones drop the
 * feature column and show each feature as a heading row above its two answers.
 */
export function StakeComparison() {
  return (
    <Section labelledBy="compare-title">
      <SectionHeader
        id="compare-title"
        title="ECO. Stake vs regular staking"
        lead="Same networks, same protocol rewards. What changes is how much of it you can see and when it reaches you."
      />
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0 text-left text-small sm:text-body">
          <caption className="sr-only">ECO. Stake compared with regular staking</caption>
          <thead>
            <tr>
              <th scope="col" className="w-[30%] border-b border-rule pb-4 font-normal text-muted max-md:hidden">
                <span className="sr-only">Feature</span>
              </th>
              <th scope="col" className={`${ECO_CELL} w-1/2 rounded-t-card md:w-[37%]`}>
                <span className="flex items-center gap-2 text-body font-semibold text-accent-text sm:text-h4">
                  <LogoMark className="size-5 sm:size-6" />
                  ECO. Stake
                </span>
              </th>
              <th scope="col" className={`${OTHER_CELL} text-body font-semibold text-muted sm:text-h4`}>
                Regular stake
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => {
              const last = i === ROWS.length - 1;
              return [
                /* Phones: the feature as its own row */
                <tr key={`${row.feature}-label`} className="md:hidden">
                  <th
                    scope="colgroup"
                    colSpan={2}
                    className="px-4 pt-5 pb-1 text-caption font-medium tracking-wide text-muted uppercase sm:px-6"
                  >
                    {row.feature}
                  </th>
                </tr>,
                <tr key={row.feature}>
                  <th scope="row" className={`${OTHER_CELL} pl-0 font-medium text-text max-md:hidden sm:pl-0`}>
                    {row.feature}
                  </th>
                  <td className={`${ECO_CELL} ${last ? "rounded-b-card" : ""}`}>
                    <span className="flex gap-2.5 font-medium text-text">
                      <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-text sm:mt-1" />
                      {row.eco}
                    </span>
                  </td>
                  <td className={OTHER_CELL}>
                    <span className="flex gap-2.5 text-muted">
                      <Minus aria-hidden className="mt-0.5 size-4 shrink-0 sm:mt-1" />
                      {row.regular}
                    </span>
                  </td>
                </tr>,
              ];
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-6 max-w-[72ch] text-caption text-muted">
        “Regular stake” describes practice that is common across staking services in general, not any particular
        provider. Network rewards, slashing risk and unbonding periods are the same wherever you stake.
      </p>
    </Section>
  );
}
