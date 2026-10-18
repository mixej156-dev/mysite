"use client";

import { ArrowRight, Search, SearchX, ThumbsDown, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "@/components/Link";
import { Accordion, Button, Input, Tag } from "@/design-system";
import { FAQ, FAQ_COUNT, type FaqItem } from "@/data/faq";
import { EmptyState } from "../blocks/EmptyState";

/* Per-visitor answer feedback, kept in this browser only */
const FEEDBACK_KEY = "faq_feedback";
type Vote = "yes" | "no";

function readFeedback(): Record<string, Vote> {
  try {
    return JSON.parse(localStorage.getItem(FEEDBACK_KEY) ?? "{}") as Record<string, Vote>;
  } catch {
    return {};
  }
}

/** "Was this helpful?" under an answer. Only mounts once an answer is opened, so reading storage here is client-only. */
function Helpful({ id }: { id: string }) {
  const [vote, setVote] = useState<Vote | undefined>(() => readFeedback()[id]);

  const choose = (v: Vote) => {
    setVote(v);
    try {
      localStorage.setItem(FEEDBACK_KEY, JSON.stringify({ ...readFeedback(), [id]: v }));
    } catch {
      // Storage blocked: the choice lasts until the answer closes
    }
  };

  if (vote) {
    return (
      <p className="font-display text-small text-muted" role="status">
        {vote === "yes" ? "Thanks, glad it helped." : "Thanks. If it didn’t answer your question, contact support."}
        {vote === "no" && (
          <>
            {" "}
            <Link href="/contact" className="rounded-sm font-medium text-accent-text hover:underline">
              Contact support
            </Link>
          </>
        )}
      </p>
    );
  }

  return (
    <div role="group" aria-label="Was this answer helpful?" className="flex items-center gap-2 font-display text-small">
      <span className="mr-1 text-muted">Was this helpful?</span>
      {(
        [
          ["yes", ThumbsUp, "Yes"],
          ["no", ThumbsDown, "No"],
        ] as const
      ).map(([v, Icon, label]) => (
        <button
          key={v}
          type="button"
          onClick={() => choose(v)}
          className="inline-flex h-8 items-center gap-1.5 rounded-field border border-rule px-3 text-text transition-colors duration-fast hover:border-rule-strong"
        >
          <Icon aria-hidden className="size-3.5" />
          {label}
        </button>
      ))}
    </div>
  );
}

function Answer({ item, uid }: { item: FaqItem; uid: string }) {
  return (
    <div id={`answer-${uid}`} className="flex scroll-mt-32 flex-col gap-4">
      <p>{item.answer}</p>
      {item.links && (
        <ul className="flex flex-wrap gap-x-5 gap-y-1 font-display text-small">
          {item.links.map((l) => (
            <li key={l.href + l.label}>
              <Link
                href={l.href}
                className="inline-flex items-center gap-1 rounded-sm font-medium text-accent-text hover:underline"
              >
                {l.label}
                <ArrowRight aria-hidden className="size-3.5" />
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Helpful id={uid} />
    </div>
  );
}

const POPULAR = FAQ.flatMap((c) =>
  c.items.filter((i) => i.popular).map((i) => ({ ...i, category: c.title, uid: `${c.id}-${i.id}` })),
);

export function FaqBrowser() {
  const [category, setCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  /** One answer open at a time across all groups */
  const [open, setOpen] = useState("");
  /** Answer to bring into view once it has opened */
  const [scrollTo, setScrollTo] = useState<string>();
  const q = query.trim().toLowerCase();

  useEffect(() => {
    if (!scrollTo) return;
    const frame = requestAnimationFrame(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document
        .getElementById(`answer-${scrollTo}`)
        ?.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
    });
    return () => cancelAnimationFrame(frame);
  }, [scrollTo]);

  const groups = FAQ.filter((c) => category === "all" || c.id === category)
    .map((c) => ({
      ...c,
      items: c.items.filter((i) => !q || i.question.toLowerCase().includes(q) || i.answer.toLowerCase().includes(q)),
    }))
    .filter((c) => c.items.length > 0);

  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const filtering = category !== "all" || q !== "";

  const openPopular = (uid: string) => {
    setCategory("all");
    setQuery("");
    setOpen(uid);
    setScrollTo(uid);
  };

  return (
    <div className="flex flex-col gap-10 sm:gap-16">
      {!filtering && (
        <section aria-labelledby="faq-popular">
          <h2 id="faq-popular" className="text-h3">
            Popular questions
          </h2>
          {/* Phones: one swipeable row instead of six stacked cards */}
          <ul className="-mx-4 mt-4 flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:mt-6 sm:grid sm:grid-cols-2 sm:overflow-visible sm:p-0 lg:grid-cols-3">
            {POPULAR.map((p) => (
              <li key={p.uid} className="w-64 shrink-0 snap-start sm:w-auto">
                <button
                  type="button"
                  onClick={() => openPopular(p.uid)}
                  className="group flex h-full w-full flex-col gap-3 rounded-card border border-rule bg-surface p-5 text-left transition-colors duration-fast hover:border-rule-strong"
                >
                  <span className="text-caption text-muted">{p.category}</span>
                  <span className="text-body font-medium transition-colors duration-fast group-hover:text-accent-text">
                    {p.question}
                  </span>
                  <span className="mt-auto inline-flex items-center gap-1 text-small font-medium text-accent-text">
                    See the answer
                    <ArrowRight
                      aria-hidden
                      className="size-4 transition-transform duration-fast group-hover:translate-x-0.5"
                    />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex flex-col gap-8 sm:gap-10">
        <div className="flex flex-col gap-4 border-t border-rule pt-8 sm:pt-10 md:flex-row md:items-center md:justify-between">
          <div role="group" aria-label="Topic" className="flex flex-wrap gap-2">
            <Tag selected={category === "all"} onClick={() => setCategory("all")} count={FAQ_COUNT}>
              All
            </Tag>
            {FAQ.map((c) => (
              <Tag key={c.id} selected={category === c.id} onClick={() => setCategory(c.id)} count={c.items.length}>
                {c.title}
              </Tag>
            ))}
          </div>
          <Input
            label="Search questions"
            placeholder="Search questions"
            prefix={<Search aria-hidden />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="md:w-72 md:shrink-0 [&_label]:sr-only"
          />
        </div>

        <p className="sr-only" aria-live="polite">
          {total === 1 ? "1 question" : `${total} questions`}
        </p>

        {groups.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No questions match"
            body="Try a shorter search, or ask us directly."
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                }}
              >
                Clear search
              </Button>
            }
          />
        ) : (
          <div className="flex flex-col gap-10 sm:gap-16">
            {groups.map((g) => (
              <section key={g.id} aria-labelledby={`faq-${g.id}`} className="grid gap-6 lg:grid-cols-12 lg:gap-8">
                <div className="lg:col-span-4">
                  <h2 id={`faq-${g.id}`} className="text-h3">
                    {g.title}
                  </h2>
                  <p className="mt-1 text-small text-muted">
                    {g.items.length} {g.items.length === 1 ? "question" : "questions"}
                  </p>
                </div>
                <Accordion
                  value={open}
                  onValueChange={setOpen}
                  items={g.items.map((i) => ({
                    id: `${g.id}-${i.id}`,
                    title: i.question,
                    content: <Answer item={i} uid={`${g.id}-${i.id}`} />,
                  }))}
                  className="lg:col-span-8"
                />
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
