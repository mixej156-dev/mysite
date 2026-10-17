import { Section, SectionHeader } from "../blocks/Section";
import { StepsFlow } from "../blocks/StepsFlow";

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
];

export function HowItWorks() {
  return (
    <Section labelledBy="how-title">
      <SectionHeader id="how-title" title="How a stake earns" />
      <StepsFlow steps={STEPS} />
    </Section>
  );
}
