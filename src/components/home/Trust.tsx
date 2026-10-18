import { Link } from "@/components/Link";
import { buttonClasses } from "@/design-system";
import { SECURITY_CONTROLS } from "@/data/security";
import { ControlsList } from "../blocks/ControlsList";
import { Section, SectionHeader } from "../blocks/Section";

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
      <ControlsList items={SECURITY_CONTROLS} />
    </Section>
  );
}
