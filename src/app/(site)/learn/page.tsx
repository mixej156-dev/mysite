import type { Metadata } from "next";
import { Newsletter } from "@/components/blocks/Newsletter";
import { PageHeader } from "@/components/blocks/PageHeader";
import { Section } from "@/components/blocks/Section";
import { LearnIndex } from "@/components/learn/LearnIndex";
import { GUIDES, LEVELS, TOPICS, toSummary, totalLearnMinutes } from "@/data/learn";

export const metadata: Metadata = {
  title: "ECO. LEARN",
  description:
    "Free guides on crypto: blockchain basics, wallets and security, staking, DeFi, markets and the technology underneath. From beginner to advanced.",
};

const FACTS = [
  { label: "Guides", value: String(GUIDES.length) },
  { label: "Topics", value: String(TOPICS.length) },
  { label: "Levels", value: String(LEVELS.length) },
  { label: "Hours of reading", value: `${Math.round(totalLearnMinutes / 60)}+` },
];

export default function LearnPage() {
  return (
    <>
      <PageHeader
        title="ECO. LEARN"
        lead="Clear, honest guides to crypto, from your first wallet to how validators earn. No hype, worked numbers, and the risks named plainly."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "ECO. LEARN" }]}
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
        <p className="text-small text-muted">Educational content, not financial advice.</p>
      </PageHeader>

      <div className="container-page pt-8 pb-24 md:pb-32">
        <LearnIndex guides={GUIDES.map(toSummary)} />
      </div>

      <Section tone="inverse" labelledBy="learn-newsletter-title">
        <h2 id="learn-newsletter-title" className="sr-only">
          Newsletter
        </h2>
        <Newsletter />
      </Section>
    </>
  );
}
