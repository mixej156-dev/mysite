import { Check } from "lucide-react";
import { Link } from "@/components/Link";
import { Skeleton, buttonClasses } from "@/design-system";
import { relatedGuides, type Guide } from "@/data/learn";
import { OutlineChip, ReadingProgress, TableOfContents } from "../blocks/ArticleOutline";
import { Breadcrumbs } from "../blocks/Breadcrumbs";
import { LearnCard, TopicLabel } from "../blocks/LearnCard";
import { LearnCover } from "../blocks/LearnCover";
import { Prose } from "../blocks/Prose";
import { Section, SectionHeader } from "../blocks/Section";

export function GuideArticle({ guide }: { guide: Guide }) {
  const related = relatedGuides(guide);
  const titleId = `guide-title-${guide.slug}`;
  const bodyId = `${guide.slug}-body`;
  /* The outline ends with the takeaways, which sit outside the body text */
  const extra = [{ id: `${guide.slug}-takeaways`, label: "Key takeaways" }];

  return (
    <>
      <article aria-labelledby={titleId}>
        <header data-intro className="container-page pt-12 pb-12 md:pt-16">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "ECO. LEARN", href: "/learn" }, { label: guide.topic }]}
          />
          <div className="mt-8 sm:mt-10 max-w-[52rem]">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-muted">
              <TopicLabel topic={guide.topic} />
              <span>{guide.level}</span>
              <span>{guide.format}</span>
              <span>{guide.minutes} min read</span>
            </div>
            <h1 id={titleId} className="mt-4 text-h1">
              {guide.title}
            </h1>
            <p className="mt-6 max-w-[52ch] text-lead text-muted">{guide.excerpt}</p>
          </div>
        </header>

        <div className="container-page">
          <div className="aspect-[16/9] overflow-hidden rounded-card border border-rule md:aspect-[21/9]">
            <LearnCover slug={guide.slug} topic={guide.topic} fit="contain" />
          </div>
        </div>

        <div className="container-page grid gap-8 pt-6 pb-14 sm:gap-10 sm:pt-12 sm:pb-24 md:pb-32 lg:grid-cols-12 lg:gap-8 lg:pt-16">
          <div className="lg:col-span-3">
            <div className="flex flex-col gap-8 lg:sticky lg:top-24">
              <dl className="grid grid-cols-3 gap-4 text-small lg:grid-cols-1">
                {[
                  ["Level", guide.level],
                  ["Format", guide.format],
                  ["Reading time", `${guide.minutes} min`],
                ].map(([label, value]) => (
                  <div key={label} className="border-t border-rule pt-3">
                    <dt className="text-caption text-muted">{label}</dt>
                    <dd className="mt-0.5 font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
              <TableOfContents
                blocks={guide.body}
                idPrefix={`${guide.slug}-`}
                extra={extra}
                sticky={false}
                className="max-lg:hidden"
              />
            </div>
          </div>

          <div id={bodyId} className="min-w-0 lg:col-span-7">
            <OutlineChip
              blocks={guide.body}
              idPrefix={`${guide.slug}-`}
              extra={extra}
              targetId={bodyId}
              className="mb-6 lg:hidden"
            />
            <section
              aria-labelledby={`${guide.slug}-outcomes`}
              className="mb-8 sm:mb-12 rounded-card border border-rule bg-surface p-6"
            >
              <h2 id={`${guide.slug}-outcomes`} className="text-small font-medium">
                What you’ll learn
              </h2>
              <ul className="mt-3 flex flex-col gap-2 text-small text-muted">
                {guide.outcomes.map((o) => (
                  <li key={o} className="flex gap-2.5">
                    <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-text" />
                    {o}
                  </li>
                ))}
              </ul>
            </section>

            <Prose blocks={guide.body} idPrefix={`${guide.slug}-`} />

            <section
              aria-labelledby={`${guide.slug}-takeaways`}
              className="mt-10 sm:mt-14 border-t-2 border-accent pt-6"
            >
              <h2 id={`${guide.slug}-takeaways`} className="scroll-mt-36 text-h4 font-medium lg:scroll-mt-24">
                Key takeaways
              </h2>
              <ol className="mt-4 flex flex-col gap-3">
                {guide.takeaways.map((t, i) => (
                  <li key={t} className="flex gap-3 text-body">
                    <span className="text-small font-medium tabular-nums text-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {t}
                  </li>
                ))}
              </ol>
            </section>

            <p className="mt-8 sm:mt-10 text-caption text-muted">
              Educational content, not financial advice. Examples use illustrative numbers.
            </p>

            <div className="mt-8 sm:mt-10 border-t border-rule pt-8">
              <Link href="/learn" className={buttonClasses({ variant: "secondary" })}>
                All guides
              </Link>
            </div>
          </div>
        </div>
        <ReadingProgress targetId={bodyId} />
      </article>

      <Section tone="inverse" labelledBy={`related-${guide.slug}`}>
        <SectionHeader id={`related-${guide.slug}`} title="Keep learning" />
        <ul className="grid gap-x-8 gap-y-6 sm:gap-y-14 md:grid-cols-3">
          {related.map((g) => (
            <li key={g.slug}>
              <LearnCard guide={g} />
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

export function GuideSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading guide" className="container-page pt-6 pb-14 sm:pt-12 sm:pb-24 md:pt-16">
      <Skeleton className="h-4 w-40" />
      <div className="mt-8 sm:mt-10 flex max-w-[52rem] flex-col gap-4">
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="mt-2 h-6 w-1/2" />
      </div>
      <Skeleton className="mt-8 sm:mt-12 aspect-[21/9] rounded-card" />
    </div>
  );
}
