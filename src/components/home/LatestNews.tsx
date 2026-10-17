"use client";

import { ArrowRight, Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "@/components/Link";
import { buttonClasses } from "@/design-system";
import { latestPosts, type Post } from "@/data/posts";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";
import { PostCover } from "../blocks/PostCover";
import { Section, SectionHeader } from "../blocks/Section";

const stories = latestPosts(3);

/*
 * Three fixed slots inside one fixed-size frame: the open story fills the large slot, the other two
 * sit in the small ones. A story that changes slot animates its own left/top/width/height, so the
 * frame never changes size. Gap is 1rem.
 */
const SLOTS = [
  // large
  "top-0 left-0 h-[calc(58%-0.5rem)] w-full lg:h-full lg:w-[calc(58%-0.5rem)]",
  // small, first
  "top-[calc(58%+0.5rem)] left-0 h-[calc(42%-0.5rem)] w-[calc(50%-0.5rem)] lg:top-0 lg:left-[calc(58%+0.5rem)] lg:h-[calc(50%-0.5rem)] lg:w-[calc(42%-0.5rem)]",
  // small, second
  "top-[calc(58%+0.5rem)] left-[calc(50%+0.5rem)] h-[calc(42%-0.5rem)] w-[calc(50%-0.5rem)] lg:top-[calc(50%+0.5rem)] lg:left-[calc(58%+0.5rem)] lg:h-[calc(50%-0.5rem)] lg:w-[calc(42%-0.5rem)]",
] as const;

function Meta({ post }: { post: Post }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-muted">
      <span className="font-medium text-accent-text">{post.category}</span>
      <time dateTime={post.date}>{formatDate(post.date)}</time>
    </div>
  );
}

export function LatestNews() {
  /* stories[0] sits in the large slot first; slot[i] holds the index of the story shown there */
  const [slotOf, setSlotOf] = useState<number[]>(() => stories.map((_, i) => i));

  const open = (index: number) =>
    setSlotOf((current) => {
      if (current[index] === 0) return current;
      // The open story and the clicked one trade places
      const swapWith = current.indexOf(0);
      const next = [...current];
      next[swapWith] = current[index];
      next[index] = 0;
      return next;
    });

  return (
    <Section labelledBy="news-title">
      <SectionHeader
        id="news-title"
        title="The latest from LONAR."
        lead="Product changes, validator reports and notes from the team. Open a story to read it here."
        action={
          <Link href="/blog" className={buttonClasses({ variant: "secondary" })}>
            All news
          </Link>
        }
      />
      <div className="relative h-[46rem] sm:h-[48rem] lg:h-[34rem]">
        {stories.map((post, index) => {
          const slot = slotOf[index];
          const expanded = slot === 0;
          return (
            <article
              key={post.slug}
              aria-label={post.title}
              className={cn(
                "group absolute overflow-hidden rounded-card border border-rule bg-surface",
                "transition-[top,left,width,height] duration-slow ease-brand motion-reduce:transition-none",
                SLOTS[slot],
              )}
            >
              {/* Open view */}
              <div
                inert={!expanded}
                className={cn(
                  "absolute inset-0 flex flex-col transition-opacity duration-base",
                  expanded ? "opacity-100 delay-150" : "pointer-events-none opacity-0",
                )}
              >
                <div className="min-h-0 flex-1 border-b border-rule">
                  <PostCover slug={post.slug} category={post.category} />
                </div>
                <div className="flex flex-col gap-3 p-5 sm:p-6">
                  <Meta post={post} />
                  <h3 className="text-h3 text-pretty">{post.title}</h3>
                  <p className="line-clamp-2 font-serif text-body text-muted">{post.excerpt}</p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 self-start rounded-sm text-small font-medium text-accent-text hover:underline"
                  >
                    Read the story
                    <ArrowRight aria-hidden className="size-4" />
                  </Link>
                </div>
              </div>

              {/* Collapsed view: the whole card is the button */}
              <button
                type="button"
                inert={expanded}
                onClick={() => open(index)}
                aria-label={`Open: ${post.title}`}
                className={cn(
                  "absolute inset-0 flex flex-col text-left transition-opacity duration-base hover:bg-surface-2",
                  expanded ? "pointer-events-none opacity-0" : "opacity-100 delay-150",
                )}
              >
                <div className="h-[38%] shrink-0 border-b border-rule lg:h-[42%]">
                  <PostCover slug={post.slug} category={post.category} />
                </div>
                <div className="flex min-h-0 flex-1 flex-col justify-between gap-2 p-4 sm:p-5">
                  <div className="flex flex-col gap-2">
                    <Meta post={post} />
                    <h3 className="line-clamp-3 text-small font-medium text-pretty sm:text-body lg:text-h4">{post.title}</h3>
                  </div>
                  <Plus aria-hidden className="size-5 self-end text-muted" />
                </div>
              </button>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
