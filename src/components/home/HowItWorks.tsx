import { Section, SectionHeader } from "../blocks/Section";
import { DelegateScene, EarnScene, PaidScene, StakeScene } from "./StakeScenes";

const SCENES = [StakeScene, DelegateScene, EarnScene, PaidScene];

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

/**
 * Four steps, each with a small piece of the dashboard acting it out (StakeScenes): one stake followed from the
 * form to the wallet. The scene sits above the text on every screen, so it stays readable on phones.
 */
export function StakeSteps() {
  return (
    <ol className="grid gap-8 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
      {STEPS.map((step, i) => {
        const Scene = SCENES[i];
        return (
          <li key={step.title} className="flex flex-col">
            <div className="h-52 overflow-hidden rounded-card border border-rule">
              <Scene />
            </div>
            <p className="mt-5 font-mono text-caption text-muted">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-1 text-h4">{step.title}</h3>
            <p className="mt-2 max-w-[34ch] font-serif text-body text-muted">{step.body}</p>
          </li>
        );
      })}
    </ol>
  );
}

export function HowItWorks() {
  return (
    <Section labelledBy="how-title">
      <SectionHeader id="how-title" title="How a stake earns" />
      <StakeSteps />
    </Section>
  );
}
