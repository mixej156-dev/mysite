import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Link } from "@/components/Link";
import { Skeleton, buttonClasses } from "@/design-system";
import { getGuide, pathFor, relatedGuides, type Guide } from "@/data/learn";
import { cn } from "@/lib/cn";
import { Breadcrumbs } from "../blocks/Breadcrumbs";
import { LearnCard, TopicLabel } from "../blocks/LearnCard";
import { LearnCover } from "../blocks/LearnCover";
import { Prose } from "../blocks/Prose";
import { Section, SectionHeader } from "../blocks/Section";

export function GuideArticle({ guide }: { guide: Guide }) {
  const path = pathFor(guide.slug);
  const lessons = path ? path.slugs.map((s) => getGuide(s)).filter((g) => g !== undefined) : [];
  const index = lessons.findIndex((g) => g.slug === guide.slug);
  const prev = index > 0 ? lessons[index - 1] : undefined;
  const next = index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : undefined;
  const related = relatedGuides(guide);
  const titleId = `guide-title-${guide.slug}`;

  return (
    <>
      <article aria-labelledby={titleId}>
        <header className="container-page pt-12 pb-12 md:pt-16">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "ECO. LEARN", href: "/learn" }, { label: guide.topic }]}
          />
          <div className="mt-10 max-w-[52rem]">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-muted">
              <TopicLabel topic={guide.topic} />
              <span>{guide.level}</span>
              <span>{guide.format}</span>
              <span>{guide.minutes} min read</span>
            </div>
            <h1 id={titleId} className="mt-4 text-h1">
              {guide.title}
            </h1>
            <p className="mt-6 max-w-[52ch] font-serif text-lead text-muted">{guide.excerpt}</p>
          </div>
        </header>

        <div className="container-page">
          <div className="aspect-[16/9] overflow-hidden rounded-card border border-rule md:aspect-[21/9]">
            <LearnCover slug={guide.slug} topic={guide.topic} fit="contain" />
          </div>
        </div>

        <div className="container-page grid gap-10 pt-12 pb-24 md:pb-32 lg:grid-cols-12 lg:gap-8 lg:pt-16">
          <aside className="lg:col-span-3">
            {path ? (
              <nav aria-label={`${path.title} lessons`} className="lg:sticky lg:top-24">
                <p className="text-caption text-muted">Learning path</p>
                <p className="mt-1 font-medium">{path.title}</p>
                <p className="mt-1 text-caption text-muted">
                  Lesson {index + 1} of {lessons.length}
                </p>
                <div aria-hidden className="mt-3 h-1 overflow-hidden rounded-pill bg-surface-2">
                  <div className="h-full rounded-pill bg-accent" style={{ width: `${((index + 1) / lessons.length) * 100}%` }} />
                </div>
                <ol className="mt-4 flex flex-col">
                  {lessons.map((g, i) => {
                    const current = g.slug === guide.slug;
                    return (
                      <li key={g.slug}>
                        <Link
                          href={`/learn/${g.slug}`}
                          aria-current={current ? "page" : undefined}
                          className={cn(
                            "flex gap-2.5 rounded-sm border-l py-1.5 pl-3 text-small transition-colors duration-fast hover:text-text",
                            current ? "border-accent text-text" : "border-rule text-muted",
                          )}
                        >
                          <span className="font-mono text-caption leading-5">{String(i + 1).padStart(2, "0")}</span>
                          {g.title}
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </nav>
            ) : (
              <dl className="grid grid-cols-3 gap-4 text-small lg:sticky lg:top-24 lg:grid-cols-1">
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
            )}
          </aside>

          <div className="min-w-0 lg:col-span-7">
            <section aria-labelledby={`${guide.slug}-outcomes`} className="mb-12 rounded-card border border-rule bg-surface p-6">
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

            <section aria-labelledby={`${guide.slug}-takeaways`} className="mt-14 border-t-2 border-accent pt-6">
              <h2 id={`${guide.slug}-takeaways`} className="text-h4 font-medium">
                Key takeaways
              </h2>
              <ol className="mt-4 flex flex-col gap-3">
                {guide.takeaways.map((t, i) => (
                  <li key={t} className="flex gap-3 font-serif text-body">
                    <span className="font-mono text-small text-muted">{String(i + 1).padStart(2, "0")}</span>
                    {t}
                  </li>
                ))}
              </ol>
            </section>

            <p className="mt-10 text-caption text-muted">
              Educational content, not financial advice. Examples use illustrative numbers.
            </p>

            {path ? (
              <nav aria-label="Previous and next lesson" className="mt-10 grid gap-4 border-t border-rule pt-8 sm:grid-cols-2">
                {prev ? (
                  <Link
                    href={`/learn/${prev.slug}`}
                    className="rounded-field border border-rule p-4 transition-colors duration-fast hover:border-rule-strong"
                  >
                    <span className="flex items-center gap-1.5 text-caption text-muted">
                      <ArrowLeft aria-hidden className="size-3.5" /> Previous lesson
                    </span>
                    <span className="mt-1 block text-small font-medium">{prev.title}</span>
                  </Link>
                ) : (
                  <span />
                )}
                {next ? (
                  <Link
                    href={`/learn/${next.slug}`}
                    className="rounded-field border border-rule p-4 text-right transition-colors duration-fast hover:border-rule-strong"
                  >
                    <span className="flex items-center justify-end gap-1.5 text-caption text-muted">
                      Next lesson <ArrowRight aria-hidden className="size-3.5" />
                    </span>
                    <span className="mt-1 block text-small font-medium">{next.title}</span>
                  </Link>
                ) : (
                  <Link
                    href="/learn"
                    className="rounded-field border border-rule p-4 text-right transition-colors duration-fast hover:border-rule-strong"
                  >
                    <span className="flex items-center justify-end gap-1.5 text-caption text-muted">
                      Path complete <Check aria-hidden className="size-3.5" />
                    </span>
                    <span className="mt-1 block text-small font-medium">Back to ECO. LEARN</span>
                  </Link>
                )}
              </nav>
            ) : (
              <div className="mt-10 border-t border-rule pt-8">
                <Link href="/learn" className={buttonClasses({ variant: "secondary" })}>
                  All guides
                </Link>
              </div>
            )}
          </div>
        </div>
      </article>

      <Section tone="inverse" labelledBy={`related-${guide.slug}`}>
        <SectionHeader id={`related-${guide.slug}`} title="Keep learning" />
        <ul className="grid gap-x-8 gap-y-14 md:grid-cols-3">
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
    <div aria-busy="true" aria-label="Loading guide" className="container-page pt-12 pb-24 md:pt-16">
      <Skeleton className="h-4 w-40" />
      <div className="mt-10 flex max-w-[52rem] flex-col gap-4">
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="mt-2 h-6 w-1/2" />
      </div>
      <Skeleton className="mt-12 aspect-[21/9] rounded-card" />
    </div>
  );
}
