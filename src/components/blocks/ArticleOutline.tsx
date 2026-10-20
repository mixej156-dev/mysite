"use client";

import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useState, type MouseEvent } from "react";
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from "@/design-system/components/Dropdown";
import { cn } from "@/lib/cn";
import { type ContentBlock, slugify } from "@/lib/content";

/*
 * Reading aids for long pages: a table of contents that marks the section being read, a thin reading-progress
 * line along the top of the window, and on phones and tablets a sticky "On this page" chip that opens the outline.
 */

export type OutlineItem = { id: string; label: string };

/** The h2s of an article as outline items, with the ids Prose gives them */
export function outlineOf(blocks: ContentBlock[], idPrefix = ""): OutlineItem[] {
  return blocks.flatMap((b) =>
    b.type === "h2" ? [{ id: `${idPrefix}${b.id ?? slugify(b.text)}`, label: b.text }] : [],
  );
}

/** Pixels below the top of the window where a heading counts as reached: below the header and the phone chip */
const READ_LINE = 160;

function useOnScroll(measure: () => void) {
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [measure]);
}

/** The last heading that has scrolled past the read line, or none before the first one */
function useActiveHeading(items: OutlineItem[]) {
  const [active, setActive] = useState<string>();
  const key = items.map((i) => i.id).join(" ");
  const measure = useCallback(() => {
    let current: string | undefined;
    for (const id of key.split(" ")) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= READ_LINE) current = id;
    }
    /* At the very bottom the last section counts as reached even if its heading can't scroll that high */
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2)
      current = key.split(" ").at(-1);
    setActive(current);
  }, [key]);
  useOnScroll(measure);
  return active;
}

/** 0–1: how much of the element has been read, from its top reaching the window top to its bottom reaching the bottom */
function useReadingProgress(targetId: string) {
  const [progress, setProgress] = useState(0);
  const measure = useCallback(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const r = el.getBoundingClientRect();
    const span = r.height - window.innerHeight + READ_LINE;
    const value = span <= 0 ? (r.top <= READ_LINE ? 1 : 0) : (READ_LINE - r.top) / span;
    setProgress(Math.min(1, Math.max(0, value)));
  }, [targetId]);
  useOnScroll(measure);
  return progress;
}

/** Jump to a section without the hash scroll fighting the smooth one; the URL still names the section */
function jumpTo(id: string, e?: MouseEvent) {
  const el = document.getElementById(id);
  if (!el) return;
  e?.preventDefault();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
  history.replaceState(history.state, "", `#${id}`);
}

/** In-page links to each section; the one being read is marked. Hidden when there are fewer than two. */
export function TableOfContents({
  blocks,
  idPrefix = "",
  extra = [],
  sticky = true,
  className,
}: {
  blocks: ContentBlock[];
  idPrefix?: string;
  /** Off when it sits inside a column that sticks already */
  sticky?: boolean;
  /** Sections outside the body text, such as a guide's key takeaways, in reading order after it */
  extra?: OutlineItem[];
  className?: string;
}) {
  const items = [...outlineOf(blocks, idPrefix), ...extra];
  const active = useActiveHeading(items);
  if (items.length < 2) return null;

  return (
    <nav aria-label="On this page" className={cn(sticky && "sticky top-24", className)}>
      <p className="text-caption font-medium">On this page</p>
      <ul className="mt-3 flex flex-col border-l border-rule text-small">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => jumpTo(item.id, e)}
              aria-current={item.id === active ? "location" : undefined}
              className={cn(
                "-ml-px block border-l-2 py-1.5 pl-3 transition-colors duration-base",
                item.id === active
                  ? "border-accent font-medium text-text"
                  : "border-transparent text-muted hover:border-rule-strong hover:text-text",
              )}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Thin line along the top of the window that fills as the article is read. Decorative: the outline says where you are. */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const progress = useReadingProgress(targetId);
  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-header h-[3px]">
      <div
        className="h-full origin-left bg-accent transition-transform duration-fast ease-brand"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}

/** Phones and tablets: a chip that sticks under the header, names the section being read and opens the outline */
export function OutlineChip({
  blocks,
  idPrefix = "",
  extra = [],
  targetId,
  className,
}: {
  blocks: ContentBlock[];
  idPrefix?: string;
  extra?: OutlineItem[];
  /** The article body, for the progress ring */
  targetId: string;
  className?: string;
}) {
  const items = [...outlineOf(blocks, idPrefix), ...extra];
  const active = useActiveHeading(items);
  const progress = useReadingProgress(targetId);
  if (items.length < 2) return null;
  const current = items.find((i) => i.id === active);
  /* Circumference of the r=7 ring */
  const ring = 2 * Math.PI * 7;

  return (
    <div className={cn("sticky top-20 z-sticky", className)}>
      <Dropdown modal={false}>
        <DropdownTrigger className="flex h-11 w-full items-center gap-3 rounded-pill border border-rule bg-surface/90 pr-4 pl-3 text-left text-small shadow-float backdrop-blur-md transition-colors duration-fast hover:border-rule-strong data-[state=open]:border-rule-strong">
          <svg aria-hidden viewBox="0 0 18 18" className="size-[1.125rem] shrink-0 -rotate-90">
            <circle cx="9" cy="9" r="7" fill="none" strokeWidth="2" className="stroke-rule" />
            <circle
              cx="9"
              cy="9"
              r="7"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={ring}
              strokeDashoffset={ring * (1 - progress)}
              className="stroke-accent transition-[stroke-dashoffset] duration-fast"
            />
          </svg>
          <span className="min-w-0 flex-1 truncate">
            <span className="text-muted">{current ? "Reading: " : ""}</span>
            <span className="font-medium">{current?.label ?? "On this page"}</span>
          </span>
          <ChevronDown aria-hidden className="size-4 shrink-0 text-muted" />
        </DropdownTrigger>
        <DropdownContent align="start" className="w-(--radix-dropdown-menu-trigger-width) max-w-[calc(100vw-2rem)]">
          {items.map((item) => (
            <DropdownItem
              key={item.id}
              onSelect={() => jumpTo(item.id)}
              className={cn(item.id === active && "font-medium text-accent-text")}
            >
              {item.label}
            </DropdownItem>
          ))}
        </DropdownContent>
      </Dropdown>
    </div>
  );
}
