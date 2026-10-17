import { RING_SCALE, RING_YEARS } from "@/lib/compound";
import { GrowthRings } from "../blocks/GrowthRings";

export type CalculatorRingsProps = {
  /** Balance today and at the end of each whole year (max RING_YEARS) */
  yearly: number[];
  /** Period label for the centre, e.g. "5 years" or "18 months" */
  periodLabel: string;
  final: number;
  rewards: number;
  ticker: string;
  format: (value: number) => string;
  valid: boolean;
};

/** Growth rings with the projected balance in the centre. Shared by the home page and /tools/calculator. */
export function CalculatorRings({ yearly, periodLabel, final, rewards, ticker, format, valid }: CalculatorRingsProps) {
  return (
    <GrowthRings balances={yearly} maxYears={RING_YEARS} scaleRatio={RING_SCALE}>
      <div className="flex max-w-[9rem] flex-col items-center gap-1" aria-live="polite">
        {valid ? (
          <>
            <p className="text-caption text-muted">After {periodLabel}</p>
            <p className="font-mono text-body leading-tight sm:text-h4">{format(final)}</p>
            <p className="font-mono text-caption text-success">
              +{format(rewards)} {ticker}
            </p>
          </>
        ) : (
          <p className="text-caption text-muted">Enter an amount to see a projection</p>
        )}
      </div>
    </GrowthRings>
  );
}
