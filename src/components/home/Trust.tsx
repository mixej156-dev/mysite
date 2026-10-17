import { Link } from "@/components/Link";
import { buttonClasses } from "@/design-system";
import { Section, SectionHeader } from "../blocks/Section";

/* Ordered by the life of a stake, from key creation to withdrawal. */
const CONTROLS = [
  {
    title: "Key management",
    body: "Validator signing keys are generated offline and split across separate secure locations, so no single person can sign alone.",
  },
  {
    title: "Validator operations",
    body: "Validators run across several regions and hosting providers, so one outage doesn’t stop a pool.",
  },
  {
    title: "Monitoring",
    body: "Performance and missed duties are watched around the clock, with on-call engineers and published incident notes.",
  },
  {
    title: "Reward accounting",
    body: "Each reward is recorded per epoch against the validator that earned it, and the ledger is visible in your dashboard.",
  },
  {
    title: "Withdrawals",
    body: "Unstake requests follow the network’s unbonding queue. The expected release date is shown before you confirm.",
  },
];

export function Trust() {
  return (
    <Section tone="inverse" labelledBy="trust-title">
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
      <ol className="border-b border-rule">
        {CONTROLS.map((control, i) => (
          <li
            key={control.title}
            className="grid gap-3 border-t border-rule py-8 md:grid-cols-[5rem_minmax(0,1fr)_minmax(0,1.5fr)] md:gap-8"
          >
            <span className="font-mono text-small text-muted">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="text-h3">{control.title}</h3>
            <p className="max-w-[56ch] font-serif text-body text-muted">{control.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
