import { Section, SectionHeader } from "../blocks/Section";
import { StakeStoryCover } from "./StakeStoryCover";

const STEPS = [
  {
    title: "Stake",
    body: "Choose a pool and an amount. The fee and unbonding period are shown before you confirm.",
  },
  {
    title: "Delegate",
    body: "Your stake is delegated to validators that meet published uptime targets.",
  },
  {
    title: "Earn each epoch",
    body: "Validators earn rewards for their duties. Your share is recorded every epoch.",
  },
  {
    title: "Get paid daily",
    body: "Rewards land in your wallet once a day. Unstake whenever you like; funds release after unbonding.",
  },
] as const;

/** Four steps as illustrated cards: the covers read as one story from coin to wallet. */
export function HowItWorks() {
  return (
    <Section labelledBy="how-title">
      <SectionHeader id="how-title" title="How a stake earns" />
      <ol className="grid gap-5 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          /* Phones: square cover beside the text, as on guide and article cards */
          <li
            key={step.title}
            className="grid grid-cols-[6.5rem_minmax(0,1fr)] content-start gap-x-4 gap-y-1 sm:flex sm:flex-col sm:gap-0"
          >
            <div className="row-span-3 aspect-square overflow-hidden rounded-card border border-rule sm:aspect-[16/10]">
              <StakeStoryCover step={i as 0 | 1 | 2 | 3} />
            </div>
            <p className="font-mono text-caption text-muted sm:mt-5">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="text-body font-medium sm:mt-1 sm:text-h4">{step.title}</h3>
            <p className="font-serif text-small text-muted sm:mt-2 sm:max-w-[34ch] sm:text-body">{step.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
