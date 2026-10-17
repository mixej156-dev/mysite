import type { Metadata } from "next";
import { CTASection } from "@/components/blocks/CTASection";
import { PageHeader } from "@/components/blocks/PageHeader";
import { Section, SectionHeader } from "@/components/blocks/Section";
import { Link } from "@/components/Link";
import { buttonClasses } from "@/design-system";
import { HISTORY, VALUES } from "@/data/history";
import { metrics } from "@/data/metrics";
import { pools } from "@/data/pools";
import { formatCompactCurrency } from "@/lib/format";

export const metadata: Metadata = {
  title: "About",
  description: "Who runs {BRAND_NAME}, what we value, and how the company got here. Demo prototype.",
};

const tvl = metrics.find((m) => m.id === "tvl")?.value ?? 0;

const FACTS = [
  { label: "Founded", value: HISTORY[0].year },
  { label: "Networks", value: String(pools.length) },
  { label: "Total staked", value: formatCompactCurrency(tvl) },
  { label: "People", value: "40+" },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="We run validators and show our work."
        lead="{BRAND_NAME} stakes on six networks for funds and individuals. Every yield, fee and reward is shown in a way you can check."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      <Section labelledBy="why-title" className="pt-0 md:pt-0">
        <div className="grid gap-12 border-t border-rule pt-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <h2 id="why-title" className="text-h2">
              Why we started
            </h2>
            <div className="mt-6 flex max-w-[62ch] flex-col gap-5 font-serif text-lead text-muted">
              <p>
                Staking rewards are public on every chain, yet most stakers only ever see a single yield figure. When it
                moves, nobody can say why.
              </p>
              <p>
                We started as engineers running validators for a few funds that needed to reconcile every reward. That
                habit became the product: records per epoch, payouts every day, and terms stated before you commit.
              </p>
            </div>
          </div>
          <dl className="grid grid-cols-2 self-start border-t border-rule lg:col-span-5">
            {FACTS.map((fact, i) => (
              <div key={fact.label} className={`border-b border-rule py-6 ${i % 2 === 1 ? "border-l pl-6" : "pr-6"}`}>
                <dt className="text-small text-muted">{fact.label}</dt>
                <dd className="mt-1 font-mono text-h2">{fact.value}</dd>
              </div>
            ))}
            <p className="col-span-2 pt-3 text-caption text-muted">Demo figures for the prototype.</p>
          </dl>
        </div>
      </Section>

      <Section tone="inverse" labelledBy="values-title">
        <SectionHeader id="values-title" title="What we hold to" />
        <ul className="grid gap-x-8 gap-y-12 md:grid-cols-2">
          {VALUES.map((value) => (
            <li key={value.title} className="border-t border-rule pt-6">
              <h3 className="text-h3">{value.title}</h3>
              <p className="mt-3 max-w-[48ch] font-serif text-body text-muted">{value.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section labelledBy="history-title">
        <SectionHeader id="history-title" title="How we got here" />
        <ol>
          {HISTORY.map((item, i) => (
            <li
              key={item.year}
              className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-4 md:grid-cols-[6rem_1.5rem_minmax(0,1fr)] md:gap-x-6"
            >
              <p className="pt-1 font-mono text-small text-muted max-md:col-start-2 max-md:row-start-1 md:text-left">
                {item.year}
              </p>
              {/* Marker and the rule that joins it to the next year */}
              <div
                aria-hidden
                className="relative flex justify-center max-md:col-start-1 max-md:row-span-2 max-md:row-start-1"
              >
                <span className="relative z-10 mt-1.5 size-3 rounded-pill border-2 border-accent bg-bg" />
                {i < HISTORY.length - 1 && <span className="absolute top-1.5 bottom-0 w-px bg-rule" />}
              </div>
              <div className="pb-12 max-md:col-start-2">
                <h3 className="text-h3 max-md:mt-1">{item.title}</h3>
                <p className="mt-2 max-w-[52ch] font-serif text-body text-muted">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="inverse" labelledBy="about-cta-title">
        <CTASection
          id="about-cta-title"
          title="Meet the people behind the pools."
          lead="See who runs the validators, how we secure them, and the roles we’re hiring for."
          actions={
            <>
              <Link href="/team" className={buttonClasses({ size: "lg" })}>
                Team &amp; careers
              </Link>
              <Link href="/security" className={buttonClasses({ size: "lg", variant: "secondary" })}>
                Security
              </Link>
            </>
          }
        />
      </Section>
    </>
  );
}
