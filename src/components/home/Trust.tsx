import { Link } from "@/components/Link";
import { buttonClasses } from "@/design-system";
import { Section, SectionHeader } from "../blocks/Section";
import { ControlLog } from "./ControlLog";

export function Trust() {
  return (
    <Section tone="subtle" labelledBy="trust-title">
      <SectionHeader
        id="trust-title"
        title="Accounted for at every step"
        lead="Five controls follow a stake from the moment keys are created to the moment funds are withdrawn."
        action={
          <Link href="/security" className={buttonClasses({ variant: "secondary" })}>
            How we secure stakes
          </Link>
        }
      />
      <ControlLog />
    </Section>
  );
}
