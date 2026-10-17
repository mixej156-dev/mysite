import { Link } from "@/components/Link";
import { getTopic, type GuideSummary, type LearnTopic } from "@/data/learn-meta";
import { cn } from "@/lib/cn";
import { LearnCover } from "./LearnCover";

/** Topic name with its cover colour as a small dot. The text stays in UI colours for contrast. */
export function TopicLabel({ topic, className }: { topic: LearnTopic; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 font-medium text-text", className)}>
      <span aria-hidden className="size-2 rounded-pill" style={{ background: `var(--topic-${getTopic(topic).color})` }} />
      {topic}
    </span>
  );
}

export function LearnCard({ guide }: { guide: GuideSummary }) {
  return (
    <article className="group relative flex h-full flex-col gap-5">
      <div className="aspect-[16/10] overflow-hidden rounded-card border border-rule">
        <div className="size-full transition-transform duration-slow group-hover:scale-[1.03] motion-reduce:transition-none">
          <LearnCover slug={guide.slug} topic={guide.topic} />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-muted">
        <TopicLabel topic={guide.topic} />
        <span>{guide.level}</span>
        <span>{guide.minutes} min</span>
      </div>
      <h3 className="text-h4 font-medium">
        <Link
          href={`/learn/${guide.slug}`}
          className="stretched-link transition-colors duration-fast group-hover:text-accent-text"
        >
          {guide.title}
        </Link>
      </h3>
      <p className="-mt-2 font-serif text-body text-muted">{guide.excerpt}</p>
    </article>
  );
}
