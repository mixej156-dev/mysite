"use client";

import { Search, SearchX } from "lucide-react";
import { useState } from "react";
import { Accordion, Button, Input, Tag } from "@/design-system";
import { FAQ } from "@/data/faq";
import { EmptyState } from "../blocks/EmptyState";

export function FaqBrowser() {
  const [category, setCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  /** One answer open at a time across all groups */
  const [open, setOpen] = useState("");
  const q = query.trim().toLowerCase();

  const groups = FAQ.filter((c) => category === "all" || c.id === category)
    .map((c) => ({
      ...c,
      items: c.items.filter((i) => !q || i.question.toLowerCase().includes(q) || i.answer.toLowerCase().includes(q)),
    }))
    .filter((c) => c.items.length > 0);

  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div role="group" aria-label="Topic" className="flex flex-wrap gap-2">
          <Tag
            selected={category === "all"}
            onClick={() => setCategory("all")}
            count={FAQ.reduce((n, c) => n + c.items.length, 0)}
          >
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
          className="md:w-72 [&_label]:sr-only"
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
        <div className="flex flex-col gap-16">
          {groups.map((g) => (
            <section key={g.id} aria-labelledby={`faq-${g.id}`} className="grid gap-6 lg:grid-cols-12 lg:gap-8">
              <h2 id={`faq-${g.id}`} className="text-h3 lg:col-span-4">
                {g.title}
              </h2>
              <Accordion
                value={open}
                onValueChange={setOpen}
                items={g.items.map((i) => ({ id: `${g.id}-${i.id}`, title: i.question, content: i.answer }))}
                className="lg:col-span-8"
              />
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
