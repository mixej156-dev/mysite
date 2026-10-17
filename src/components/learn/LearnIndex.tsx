"use client";

import { Search, SearchX } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { Button, Input, Pagination, Tag } from "@/design-system";
import { LEVELS, TOPICS, type GuideSummary, type LearnLevel, type LearnTopic } from "@/data/learn-meta";
import { EmptyState } from "../blocks/EmptyState";
import { LearnCard } from "../blocks/LearnCard";
import { LearnCover } from "../blocks/LearnCover";

const PAGE_SIZE = 9;

/* Round-robin across topics so the unfiltered grid mixes subjects instead of listing them in blocks */
function mixByTopic(guides: GuideSummary[]) {
  const byTopic = TOPICS.map((t) => guides.filter((g) => g.topic === t.name));
  return Array.from({ length: Math.max(...byTopic.map((list) => list.length)) }, (_, i) =>
    byTopic.map((list) => list[i]),
  )
    .flat()
    .filter((g) => g !== undefined);
}

/**
 * Topic tiles, filters and the guide grid. Topic tiles set the filter and jump to the list.
 * Takes summaries from the server page so article bodies never reach the browser bundle.
 */
export function LearnIndex({ guides }: { guides: GuideSummary[] }) {
  const mixed = useMemo(() => mixByTopic(guides), [guides]);
  const [topic, setTopic] = useState<LearnTopic | "All">("All");
  const [level, setLevel] = useState<LearnLevel | "All">("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  /* Grid height from the previous page, so a shorter last page doesn't pull the footer up */
  const [minHeight, setMinHeight] = useState<number>();
  const listTop = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const q = query.trim().toLowerCase();
  const filtered = mixed.filter(
    (g) =>
      (topic === "All" || g.topic === topic) &&
      (level === "All" || g.level === level) &&
      (!q || [g.title, g.excerpt, g.topic].some((v) => v.toLowerCase().includes(q))),
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const update = (fn: () => void) => {
    fn();
    setPage(1);
    setMinHeight(undefined);
  };

  /* Only the grid changes: keep its height, and bring its top into view only if it has scrolled away */
  const changePage = (p: number) => {
    const grid = gridRef.current;
    setMinHeight(grid?.offsetHeight);
    setPage(p);
    if (grid && grid.getBoundingClientRect().top < 0) {
      grid.scrollIntoView({ block: "start", behavior: reduceMotion ? "auto" : "smooth" });
    }
  };
  const clear = () =>
    update(() => {
      setTopic("All");
      setLevel("All");
      setQuery("");
    });

  return (
    <div className="flex flex-col gap-24 md:gap-32">
      <section aria-labelledby="topics-title">
        <h2 id="topics-title" className="text-h1">
          Browse by topic
        </h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOPICS.map((t) => {
            const count = guides.filter((g) => g.topic === t.name).length;
            return (
              <li key={t.name}>
                <button
                  type="button"
                  onClick={() => {
                    update(() => setTopic(t.name));
                    listTop.current?.scrollIntoView({ block: "start", behavior: reduceMotion ? "auto" : "smooth" });
                  }}
                  className="group flex h-full w-full items-stretch overflow-hidden rounded-card border border-rule bg-surface text-left transition-colors duration-fast hover:border-rule-strong"
                >
                  <span className="w-24 shrink-0 overflow-hidden border-r border-rule sm:w-28">
                    <span className="block size-full transition-transform duration-slow group-hover:scale-110 motion-reduce:transition-none">
                      <LearnCover slug={`topic-${t.name}`} topic={t.name} />
                    </span>
                  </span>
                  <span className="flex flex-col gap-1 p-4">
                    <span className="text-body font-medium transition-colors duration-fast group-hover:text-accent-text">
                      {t.name}
                    </span>
                    <span className="text-small text-muted">{t.description}</span>
                    <span className="mt-auto pt-2 text-caption text-muted">{count} guides</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section ref={listTop} aria-labelledby="guides-title" className="flex scroll-mt-24 flex-col gap-10">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 id="guides-title" className="text-h1">
              All guides
            </h2>
            <Input
              label="Search guides"
              placeholder="Search guides"
              prefix={<Search aria-hidden />}
              value={query}
              onChange={(e) => update(() => setQuery(e.target.value))}
              className="md:w-72 [&_label]:sr-only"
            />
          </div>
          <div className="flex flex-col gap-4 border-t border-rule pt-6 lg:flex-row lg:items-center lg:justify-between">
            <div role="group" aria-label="Topic" className="flex flex-wrap gap-2">
              <Tag selected={topic === "All"} onClick={() => update(() => setTopic("All"))} count={guides.length}>
                All topics
              </Tag>
              {TOPICS.map((t) => (
                <Tag
                  key={t.name}
                  selected={topic === t.name}
                  onClick={() => update(() => setTopic(t.name))}
                  count={guides.filter((g) => g.topic === t.name).length}
                >
                  {t.name}
                </Tag>
              ))}
            </div>
            <div role="group" aria-label="Level" className="flex flex-wrap gap-2">
              <Tag selected={level === "All"} onClick={() => update(() => setLevel("All"))}>
                All levels
              </Tag>
              {LEVELS.map((l) => (
                <Tag key={l} selected={level === l} onClick={() => update(() => setLevel(l))}>
                  {l}
                </Tag>
              ))}
            </div>
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {filtered.length === 1 ? "1 guide" : `${filtered.length} guides`}
        </p>

        <div ref={gridRef} className="scroll-mt-28" style={{ minHeight }}>
          {visible.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No guides match"
              body="Try another word, topic or level."
              action={
                <Button variant="secondary" onClick={clear}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <ul key={page} className="grid animate-fade-in gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {visible.map((g) => (
                <li key={g.slug}>
                  <LearnCard guide={g} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <Pagination page={page} pageCount={pageCount} onPageChange={changePage} className="self-center" />
      </section>
    </div>
  );
}
