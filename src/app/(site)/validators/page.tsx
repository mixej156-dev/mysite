import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/blocks/PageHeader";
import { Section, SectionHeader } from "@/components/blocks/Section";
import { Link } from "@/components/Link";
import { CountUp } from "@/components/blocks/CountUp";
import { StatusLegend, UptimeStrip } from "@/components/validators/UptimeStrip";
import { Badge, buttonClasses } from "@/design-system";
import { getPool } from "@/data/pools";
import { INCIDENTS, LATEST_REPORT, NETWORK_PERFORMANCE, uptimeHistory } from "@/data/validators";
import { formatDate, formatNumber } from "@/lib/format";
import { DEMO_TODAY } from "@/lib/series";

export const metadata: Metadata = {
  title: "Validator performance",
  description:
    "Uptime, duty effectiveness, missed duties, client mix and incidents for every network LONAR ECO. validates on.",
};

const totalValidators = NETWORK_PERFORMANCE.reduce((sum, n) => sum + (getPool(n.poolId)?.validators ?? 0), 0);
const averageUptime = NETWORK_PERFORMANCE.reduce((sum, n) => sum + n.uptime30d, 0) / NETWORK_PERFORMANCE.length;
const slashing = NETWORK_PERFORMANCE.reduce((sum, n) => sum + n.slashingEvents, 0);

const FACTS = [
  { label: "Networks", value: String(NETWORK_PERFORMANCE.length) },
  { label: "Validators", value: formatNumber(totalValidators) },
  { label: "Uptime, 30 days", value: `${averageUptime.toFixed(2)}%` },
  { label: "Slashing events", value: String(slashing) },
];

const METHOD = [
  {
    term: "Uptime",
    body: "Share of time our validators were online and signing, weighted by the stake each one holds. Measured every minute from two independent monitoring locations.",
  },
  {
    term: "Duty effectiveness",
    body: "Share of assigned duties (attestations, votes, block slots) performed on time. Late duties earn less, so this tracks rewards more closely than uptime.",
  },
  {
    term: "Missed duties",
    body: "Duties not performed at all in the last 30 days. Missed duties lower rewards slightly; they are not slashing.",
  },
  {
    term: "Incidents",
    body: "Any event that lowered uptime below 99.9% for a pool on a given day. Each gets a written review with its impact and what we changed.",
  },
];

export default function ValidatorsPage() {
  return (
    <>
      <PageHeader
        title="Validator performance"
        lead="The numbers we watch, published as we see them: uptime, missed duties and every incident, for each network we stake on."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Staking", href: "/staking" }, { label: "Validators" }]}
        aside={
          <dl className="grid grid-cols-2 border-t border-rule">
            {FACTS.map((fact, i) => (
              <div key={fact.label} className={`border-b border-rule py-5 ${i % 2 === 1 ? "border-l pl-6" : "pr-6"}`}>
                <dt className="text-small text-muted">{fact.label}</dt>
                <dd className="mt-1 font-mono text-h3">{fact.value}</dd>
              </div>
            ))}
          </dl>
        }
      >
        <p className="text-small text-muted">Updated {formatDate(DEMO_TODAY)}. Uptime is weighted by stake.</p>
      </PageHeader>

      <section aria-labelledby="networks-title" className="container-page pb-14 sm:pb-24 md:pb-32">
        <div className="flex flex-col gap-4 border-t border-rule pt-10 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="networks-title" className="text-h2">
            By network
          </h2>
          <StatusLegend />
        </div>
        <ul className="mt-8 sm:mt-10 grid gap-6 lg:grid-cols-2">
          {NETWORK_PERFORMANCE.map((n) => {
            const pool = getPool(n.poolId);
            return (
              <li key={n.poolId}>
                <article
                  aria-labelledby={`net-${n.poolId}`}
                  className="flex h-full flex-col gap-6 rounded-card border border-rule bg-surface p-5 md:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 id={`net-${n.poolId}`} className="text-h4 font-medium">
                        {n.network}
                      </h3>
                      <p className="mt-0.5 text-small text-muted">
                        {pool &&
                          `${formatNumber(pool.validators)} ${pool.validators === 1 ? "validator" : "validators"}, `}
                        {n.regions.join(", ")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-h3">
                        <CountUp value={n.uptime30d} decimals={2} suffix="%" />
                      </p>
                      <p className="text-caption text-muted">uptime, 30 days</p>
                    </div>
                  </div>

                  <UptimeStrip days={uptimeHistory(n.poolId)} label={n.network} />

                  <dl className="grid grid-cols-3 border-t border-rule text-small">
                    {[
                      ["Effectiveness", `${n.effectiveness.toFixed(1)}%`],
                      [n.missedLabel, `${n.missedRate.toFixed(2)}%`],
                      ["Slashing", String(n.slashingEvents)],
                    ].map(([label, value], i) => (
                      <div key={label} className={i > 0 ? "border-l border-rule pt-3 pl-4" : "pt-3 pr-4"}>
                        <dt className="text-caption text-muted">{label}</dt>
                        <dd className="mt-0.5 font-mono">{value}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                    <ul aria-label={`${n.network} clients`} className="flex flex-wrap gap-1.5">
                      {n.clients.map((c) => (
                        <li key={c}>
                          <Badge>{c}</Badge>
                        </li>
                      ))}
                    </ul>
                    {pool && (
                      <Link
                        href={`/staking/${pool.id}`}
                        className="inline-flex items-center gap-1 rounded-sm text-small font-medium text-accent-text hover:underline"
                      >
                        {pool.name} pool
                        <ArrowRight aria-hidden className="size-4" />
                      </Link>
                    )}
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </section>

      <Section tone="inverse" labelledBy="incidents-title">
        <SectionHeader
          id="incidents-title"
          title="Incidents"
          lead="Every event that took a pool below 99.9% uptime for a day, with what it cost and what we changed."
        />
        <ol className="flex flex-col">
          {INCIDENTS.map((inc) => {
            const network = NETWORK_PERFORMANCE.find((n) => n.poolId === inc.poolId)?.network ?? inc.poolId;
            return (
              <li
                key={`${inc.date}-${inc.poolId}`}
                className="grid gap-x-8 gap-y-3 border-t border-rule py-8 md:grid-cols-[12rem_minmax(0,1fr)]"
              >
                <div className="flex flex-wrap items-center gap-2 md:flex-col md:items-start">
                  <time dateTime={inc.date} className="font-mono text-small">
                    {formatDate(inc.date)}
                  </time>
                  <span className="text-small text-muted">{network}</span>
                  <Badge tone={inc.severity === "outage" ? "danger" : "warning"} dot>
                    {inc.severity === "outage" ? "Outage" : "Degraded"}, {inc.durationMinutes} min
                  </Badge>
                </div>
                <div className="max-w-[64ch]">
                  <h3 className="text-h4 font-medium">{inc.title}</h3>
                  <p className="mt-2 font-serif text-body text-muted">{inc.impact}</p>
                  <p className="mt-3 text-small">
                    <span className="font-medium">What changed: </span>
                    <span className="text-muted">{inc.fix}</span>
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
        <p className="border-t border-rule pt-6 text-small text-muted">No slashing events on any network since 2021.</p>
      </Section>

      <Section labelledBy="method-title">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <h2 id="method-title" className="text-h1">
              How we measure
            </h2>
            <p className="mt-5 max-w-[44ch] font-serif text-lead text-muted">
              Each quarter we publish a full report with per-validator figures and the reviews behind every incident.
            </p>
            <Link href={LATEST_REPORT.href} className={buttonClasses({ variant: "secondary", className: "mt-8" })}>
              Read the {LATEST_REPORT.title}
              <ArrowRight aria-hidden />
            </Link>
          </div>
          <dl className="grid gap-x-8 sm:grid-cols-2 lg:col-span-7">
            {METHOD.map((m) => (
              <div key={m.term} className="border-t border-rule py-6">
                <dt className="font-medium">{m.term}</dt>
                <dd className="mt-2 font-serif text-body text-muted">{m.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>
    </>
  );
}
