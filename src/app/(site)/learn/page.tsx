import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { LearnCover } from "@/components/blocks/LearnCover";
import { TopicLabel } from "@/components/blocks/LearnCard";
import { Newsletter } from "@/components/blocks/Newsletter";
import { PageHeader } from "@/components/blocks/PageHeader";
import { Section, SectionHeader } from "@/components/blocks/Section";
import { LearnIndex } from "@/components/learn/LearnIndex";
import { Link } from "@/components/Link";
import { buttonClasses } from "@/design-system";
import { GLOSSARY, GUIDES, LEARNING_PATHS, TOPICS, getGuide, totalLearnMinutes } from "@/data/learn";

export const metadata: Metadata = {
  title: "ECO. LEARN",
  description:
    "Free guides on crypto: blockchain basics, wallets and security, staking, DeFi, markets and the technology underneath. From beginner to advanced.",
};

const FACTS = [
  { label: "Guides", value: String(GUIDES.length) },
  { label: "Topics", value: String(TOPICS.length) },
  { label: "Learning paths", value: String(LEARNING_PATHS.length) },
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

      <Section tone="inverse" labelledBy="paths-title">
        <SectionHeader
          id="paths-title"
          title="Learning paths"
          lead="Short courses that build on each other. Read them in order, or jump to what you need."
        />
        <ul className="grid gap-6 lg:grid-cols-3">
          {LEARNING_PATHS.map((path) => {
            const lessons = path.slugs.map((s) => getGuide(s)).filter((g) => g !== undefined);
            const minutes = lessons.reduce((sum, g) => sum + g.minutes, 0);
            return (
              <li key={path.id}>
                <article
                  aria-labelledby={`path-${path.id}`}
                  className="flex h-full flex-col overflow-hidden rounded-card border border-rule bg-surface"
                >
                  <div className="aspect-[21/9] border-b border-rule md:max-lg:aspect-[3/1]">
                    <LearnCover slug={`path-${path.id}`} topic={path.topic} />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-muted">
                      <TopicLabel topic={path.topic} />
                      <span>{path.level}</span>
                      <span>
                        {lessons.length} lessons, {minutes} min
                      </span>
                    </div>
                    <h3 id={`path-${path.id}`} className="mt-3 text-h3">
                      {path.title}
                    </h3>
                    <p className="mt-2 font-serif text-body text-muted">{path.description}</p>
                    <ol className="mt-6 flex flex-col border-t border-rule">
                      {lessons.map((g, i) => (
                        <li key={g.slug} className="border-b border-rule">
                          <Link
                            href={`/learn/${g.slug}`}
                            className="flex items-baseline gap-3 rounded-sm py-2.5 text-small transition-colors duration-fast hover:text-accent-text"
                          >
                            <span className="w-5 shrink-0 font-mono text-caption text-muted">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="flex-1">{g.title}</span>
                            <span className="shrink-0 text-caption text-muted">{g.minutes} min</span>
                          </Link>
                        </li>
                      ))}
                    </ol>
                    <Link
                      href={`/learn/${path.slugs[0]}`}
                      className={buttonClasses({ variant: "secondary", className: "mt-6 self-start" })}
                    >
                      Start the path
                      <ArrowRight aria-hidden />
                    </Link>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </Section>

      <div className="container-page py-24 md:py-32">
        <LearnIndex />
      </div>

      <Section tone="inverse" labelledBy="glossary-title">
        <SectionHeader id="glossary-title" title="Glossary" lead="The words you’ll meet most often, in one line each." />
        <dl className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
          {GLOSSARY.map((item) => (
            <div key={item.term} className="border-t border-rule py-5">
              <dt className="font-medium">{item.term}</dt>
              <dd className="mt-1 text-small text-muted">{item.definition}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section labelledBy="learn-newsletter-title">
        <h2 id="learn-newsletter-title" className="sr-only">
          Newsletter
        </h2>
        <Newsletter />
      </Section>
    </>
  );
}
