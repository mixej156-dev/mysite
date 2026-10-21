import { Link } from "@/components/Link";
import { getTopic, type GuideSummary, type LearnTopic } from "@/data/learn-meta";
import { cn } from "@/lib/cn";
import { LearnCover } from "./LearnCover";

/** Topic name with its cover colour as a small dot. The text stays in UI colours for contrast. */
export function TopicLabel({ topic, className }: { topic: LearnTopic; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 font-medium text-text", className)}>
      <span
        aria-hidden
        className="size-2 rounded-pill"
        style={{ background: `var(--topic-${getTopic(topic).color})` }}
      />
      {topic}
    </span>
  );
}

export function LearnCard({ guide }: { guide: GuideSummary }) {
  return (
    /* Phones: small square cover beside the text, so a list of guides stays short */
    <article className="group relative grid h-full grid-cols-[6.5rem_minmax(0,1fr)] content-start gap-x-4 gap-y-1.5 sm:flex sm:flex-col sm:gap-5">
      <div className="row-span-3 aspect-square overflow-hidden rounded-card border border-rule sm:aspect-[16/10]">
        <div className="size-full transition-transform duration-slow group-hover:scale-[1.03] motion-reduce:transition-none">
          <LearnCover slug={guide.slug} topic={guide.topic} />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-muted">
        <TopicLabel topic={guide.topic} />
        <span>{guide.level}</span>
        <span>{guide.minutes} min</span>
      </div>
      <h3 className="text-body font-medium sm:text-h4">
        <Link
          href={`/learn/${guide.slug}`}
          className="stretched-link transition-colors duration-fast group-hover:text-accent-text"
        >
          {guide.title}
        </Link>
      </h3>
      <p className="line-clamp-2 text-small text-muted sm:-mt-2 sm:line-clamp-none sm:text-body">{guide.excerpt}</p>
    </article>
  );
}
