import { Section, SectionHeader } from "../blocks/Section";
import { StakeStepsLive } from "./StakeScenes";

const STEPS = [
  {
    title: "Stake",
    body: "Pick a pool, type an amount. The fee and the unbonding period are on screen before you confirm, not after.",
  },
  {
    title: "Delegate",
    body: "We spread it across validators that hit their uptime targets.",
  },
  {
    title: "Earn each epoch",
    body: "Validators are paid for proposing and attesting blocks. Every epoch your share goes into a ledger, so any reward can be traced to the validator that earned it.",
  },
  {
    title: "Get paid daily",
    body: "Once a day, straight to your wallet. Want out? Unstake any time; funds come back when unbonding ends.",
  },
] as const;

/**
 * Four steps, each with a small piece of the dashboard acting it out (StakeScenes): one stake followed from the
 * form to the wallet, taking turns. The scene sits above the text on every screen, so it stays readable on phones.
 */
export function StakeSteps() {
  return <StakeStepsLive steps={STEPS} />;
}

export function HowItWorks() {
  return (
    <Section labelledBy="how-title">
      <SectionHeader id="how-title" title="How a stake earns" />
      <StakeSteps />
    </Section>
  );
}
