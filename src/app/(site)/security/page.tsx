import { ArrowRight, Mail } from "lucide-react";
import type { Metadata } from "next";
import { ControlsList } from "@/components/blocks/ControlsList";
import { PageHeader } from "@/components/blocks/PageHeader";
import { Section, SectionHeader } from "@/components/blocks/Section";
import { StepsFlow } from "@/components/blocks/StepsFlow";
import { Link } from "@/components/Link";
import { Accordion, Badge, TBody, TD, TH, THead, TR, Table, buttonClasses } from "@/design-system";
import { BOUNTY_SEVERITIES, CUSTODY_PRACTICES, INCIDENT_STEPS, SECURITY_CONTROLS } from "@/data/security";
import { INCIDENTS, NETWORK_PERFORMANCE } from "@/data/validators";

export const metadata: Metadata = {
  title: "Security",
  description:
    "How LONAR ECO. protects validator keys, operates infrastructure, handles incidents and accepts vulnerability reports.",
};

const IN_SCOPE = ["This website and the staking dashboard", "Account, staking and withdrawal flows", "Public APIs"];
const OUT_OF_SCOPE = [
  "Third-party services we link to",
  "Denial of service or load testing",
  "Social engineering of staff or users",
];

const FAQ = [
  {
    id: "custody",
    title: "Who controls the staked assets?",
    content:
      "Assets are delegated to validators on each network’s staking protocol. How custody works differs by network; each pool page and the risk disclosure describe it for that network.",
  },
  {
    id: "slashing",
    title: "What happens if a validator is slashed?",
    content: (
      <>
        The penalty reduces the balance of the affected pool. We publish an incident review explaining the cause and the
        impact on each staker. Past reviews and live uptime are on the{" "}
        <Link href="/validators" className="rounded-sm text-accent-text underline underline-offset-2">
          validator performance
        </Link>{" "}
        page; penalties never carry a platform fee (see{" "}
        <Link href="/fees" className="rounded-sm text-accent-text underline underline-offset-2">
          fees
        </Link>
        ).
      </>
    ),
  },
  {
    id: "account",
    title: "How do I secure my account?",
    content:
      "Turn on two-factor authentication in settings, use a unique password, and add a withdrawal address allowlist. We will never ask for your password or codes.",
  },
  {
    id: "report",
    title: "I think my account was accessed by someone else",
    content:
      "Change your password, sign out of all sessions from settings, and write to security@example.com. Withdrawals to new addresses can be paused while we look into it.",
  },
];

export default function SecurityPage() {
  return (
    <>
      <PageHeader
        title="Security"
        lead="How we protect validator keys, run infrastructure, handle incidents and work with security researchers."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Security" }]}
      />

      <Section labelledBy="controls-title" className="pt-0 md:pt-0">
        <SectionHeader
          id="controls-title"
          title="Five controls, in order"
          lead="Each one covers a stage in the life of a stake, from the moment keys are created to the moment funds are withdrawn."
        />
        <ControlsList items={SECURITY_CONTROLS} />
      </Section>

      <Section tone="inverse" labelledBy="custody-title">
        <SectionHeader id="custody-title" title="Keys and access" />
        <ul className="grid gap-x-8 gap-y-10 md:grid-cols-3">
          {CUSTODY_PRACTICES.map((item) => (
            <li key={item.title} className="border-t border-rule pt-6">
              <h3 className="text-h3">{item.title}</h3>
              <p className="mt-3 font-serif text-body text-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section labelledBy="incident-title">
        <SectionHeader
          id="incident-title"
          title="When something goes wrong"
          lead="Every incident follows the same four steps, and every one ends with a written review."
        />
        <StepsFlow steps={INCIDENT_STEPS} />
        <div className="mt-12 flex flex-col gap-6 rounded-card border border-rule bg-surface p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <dl className="grid grid-cols-3 gap-6 md:gap-10">
            {[
              ["Incidents, 90 days", String(INCIDENTS.length)],
              ["Longest", `${Math.max(...INCIDENTS.map((i) => i.durationMinutes))} min`],
              ["Slashing events", String(NETWORK_PERFORMANCE.reduce((sum, n) => sum + n.slashingEvents, 0))],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-caption text-muted">{label}</dt>
                <dd className="mt-1 font-mono text-h3">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap gap-3">
            <Link href="/validators" className={buttonClasses({ variant: "secondary" })}>
              Read the incident reviews
              <ArrowRight aria-hidden />
            </Link>
          </div>
        </div>
      </Section>

      <Section id="bug-bounty" tone="inverse" labelledBy="bounty-title" className="scroll-mt-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Badge tone="accent">Launching soon</Badge>
            <h2 id="bounty-title" className="mt-4 text-h2">
              Bug bounty
            </h2>
            <p className="mt-4 max-w-[46ch] font-serif text-body text-muted">
              We’re preparing a public bug bounty. Until it opens, we welcome reports through the address below and
              credit researchers who agree to be named.
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <h3 className="text-small font-medium">In scope</h3>
                <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-small text-muted">
                  {IN_SCOPE.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-small font-medium">Out of scope</h3>
                <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-small text-muted">
                  {OUT_OF_SCOPE.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          {/* min-w-0 lets the table scroll inside its frame instead of widening the grid track */}
          <div className="min-w-0 lg:col-span-7">
            {/* Phones: one row per severity */}
            <dl className="border-t border-rule md:hidden">
              {BOUNTY_SEVERITIES.map((s) => (
                <div key={s.level} className="border-b border-rule py-4">
                  <dt className="font-medium">{s.level}</dt>
                  <dd className="mt-1 text-small text-muted">{s.example}</dd>
                  <dd className="mt-1 text-caption text-muted">Reward announced at launch</dd>
                </div>
              ))}
            </dl>
            <div className="max-md:hidden">
              <Table label="Severity levels">
                <caption className="sr-only">Severity levels and reward status</caption>
                <THead>
                  <tr>
                    <TH>Severity</TH>
                    <TH>Example</TH>
                    <TH numeric>Reward</TH>
                  </tr>
                </THead>
                <TBody>
                  {BOUNTY_SEVERITIES.map((s) => (
                    <TR key={s.level}>
                      <TD className="font-medium">{s.level}</TD>
                      <TD className="whitespace-normal text-muted">{s.example}</TD>
                      <TD className="text-right text-muted">Announced at launch</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </div>
          </div>
        </div>
      </Section>

      <Section labelledBy="report-title">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <h2 id="report-title" className="text-h2">
              Report a vulnerability
            </h2>
            <p className="mt-4 max-w-[46ch] font-serif text-body text-muted">
              Please don’t test against other people’s accounts or disclose the issue publicly before we’ve had a chance
              to fix it. We aim to acknowledge reports within two business days.
            </p>
          </div>
          <div className="flex flex-col gap-6 rounded-card border border-rule bg-surface p-6 md:p-8 lg:col-span-7">
            <a
              href="mailto:security@example.com"
              className="flex items-center gap-3 self-start rounded-sm text-h4 font-medium text-accent-text hover:underline"
            >
              <Mail aria-hidden className="size-5" />
              security@example.com
            </a>
            <div>
              <h3 className="text-small font-medium">Include in your report</h3>
              <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 font-serif text-body text-muted">
                <li>What you found and where</li>
                <li>Steps to reproduce it</li>
                <li>What an attacker could do with it</li>
                <li>Whether you’d like to be credited</li>
              </ul>
            </div>
            <p className="border-t border-rule pt-4 font-mono text-caption text-muted">
              PGP key: published at launch (placeholder)
            </p>
          </div>
        </div>
      </Section>

      <Section tone="inverse" labelledBy="security-faq-title">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <h2 id="security-faq-title" className="text-h2 lg:col-span-4">
            Security questions
          </h2>
          <Accordion items={FAQ} className="lg:col-span-8" />
        </div>
      </Section>
    </>
  );
}
