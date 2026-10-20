"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { CornerDownLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { EmptyState } from "@/components/blocks/EmptyState";
import { Link } from "@/components/Link";
import { useThemeScope } from "@/design-system/theme-scope";
import { cn } from "@/lib/cn";
import { POOL_TONES, TONE_CHIP } from "../dashboard/tones";
import { MenuIcon } from "../layout/MenuIcon";
import { GROUP_ORDER, searchEntries, type SearchEntry } from "./search-index";

/** The query's words in the title, in the accent colour */
function Highlight({ text, query }: { text: string; query: string }) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return text;
  const pattern = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return text.split(pattern).map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="bg-transparent font-medium text-accent-text">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

function EntryIcon({ entry }: { entry: SearchEntry }) {
  if (entry.poolId)
    return (
      <span
        aria-hidden
        data-menu-icon
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-field",
          TONE_CHIP[POOL_TONES[entry.poolId] ?? "blue"],
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- tiny local SVG, as in the menus */}
        <img src={`/logos/networks/${entry.poolId}.svg`} alt="" className="size-5" />
      </span>
    );
  return entry.icon ? <MenuIcon icon={entry.icon} tone={entry.tone} colored /> : null;
}

function Palette({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const results = useMemo(() => searchEntries(query), [query]);
  const optionId = (i: number) => `${uid}-option-${i}`;
  const current = Math.min(active, Math.max(results.length - 1, 0));

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`#${CSS.escape(optionId(current))}`)
      ?.scrollIntoView({ block: "nearest" });
    // optionId only depends on uid, which never changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const go = (entry: SearchEntry) => {
    onClose();
    const url = new URL(entry.href, window.location.href);
    /* An answer on the page already open: set the hash directly so hashchange fires (FAQ opens that answer) */
    if (url.hash && url.pathname === window.location.pathname) window.location.hash = url.hash;
    else router.push(entry.href, { transitionTypes: ["nav"] });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (results.length === 0) return;
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((current + step + results.length) % results.length);
    } else if (e.key === "Enter" && results[current]) {
      e.preventDefault();
      go(results[current]);
    }
  };

  const typed = query.trim() !== "";
  /* Before typing, the suggestions are one list; after, results sit under their kind */
  const groups = typed
    ? GROUP_ORDER.map((group) => ({
        group: group as string,
        items: results.flatMap((entry, index) => (entry.group === group ? [{ entry, index }] : [])),
      })).filter((g) => g.items.length > 0)
    : [{ group: "Suggested", items: results.map((entry, index) => ({ entry, index })) }];

  return (
    <>
      <div className="flex items-center gap-3 border-b border-rule px-4 sm:px-5">
        <Search aria-hidden className="size-5 shrink-0 text-muted" />
        <input
          autoFocus
          role="combobox"
          aria-expanded
          aria-controls={`${uid}-list`}
          aria-activedescendant={results.length ? optionId(current) : undefined}
          aria-autocomplete="list"
          aria-label="Search the site"
          placeholder="Search pools, guides, questions…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          className="h-14 min-w-0 flex-1 bg-transparent text-body outline-none placeholder:text-muted"
        />
        <Dialog.Close className="rounded-sm border border-rule px-1.5 py-0.5 font-mono text-caption text-muted transition-colors duration-fast hover:text-text">
          Esc
        </Dialog.Close>
      </div>

      <p className="sr-only" aria-live="polite">
        {typed ? (results.length === 1 ? "1 result" : `${results.length} results`) : ""}
      </p>

      <div
        ref={listRef}
        id={`${uid}-list`}
        role="listbox"
        aria-label="Results"
        className="min-h-0 flex-1 overflow-y-auto p-2"
      >
        {results.length === 0 ? (
          <EmptyState
            art="search"
            title="Nothing matches"
            body="Try a shorter word, a network name or a ticker."
            className="py-8"
          />
        ) : (
          groups.map(({ group, items }) => (
            <div key={group} role="group" aria-labelledby={`${uid}-${group}`} className="pb-1">
              <p id={`${uid}-${group}`} className="px-3 pt-3 pb-1.5 text-caption text-muted">
                {group}
              </p>
              {items.map(({ entry, index }) => {
                const selected = index === current;
                return (
                  <Link
                    key={entry.id}
                    id={optionId(index)}
                    href={entry.href}
                    role="option"
                    aria-selected={selected}
                    tabIndex={-1}
                    data-icon-play={selected || undefined}
                    onMouseMove={() => !selected && setActive(index)}
                    onClick={(e) => {
                      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                      e.preventDefault();
                      go(entry);
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-field px-3 py-2.5 transition-colors duration-fast",
                      selected && "bg-surface-2",
                    )}
                  >
                    <EntryIcon entry={entry} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-small">
                        <Highlight text={entry.title} query={query} />
                      </span>
                      <span className="block truncate text-caption text-muted">{entry.detail}</span>
                    </span>
                    <CornerDownLeft
                      aria-hidden
                      className={cn("size-4 shrink-0 text-muted max-sm:hidden", !selected && "invisible")}
                    />
                  </Link>
                );
              })}
            </div>
          ))
        )}
      </div>

      <div
        aria-hidden
        className="flex items-center gap-4 border-t border-rule px-5 py-2.5 text-caption text-muted max-sm:hidden"
      >
        <span className="flex items-center gap-1.5">
          <kbd className="rounded-sm border border-rule px-1 font-mono">↑</kbd>
          <kbd className="rounded-sm border border-rule px-1 font-mono">↓</kbd>
          to move
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="rounded-sm border border-rule px-1 font-mono">↵</kbd>
          to open
        </span>
        <span className="ml-auto">Searches pages, pools, guides, posts, docs and FAQ</span>
      </div>
    </>
  );
}

/** Site search as a command palette (⌘K). Loaded on first open, see SearchButton. */
export default function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const scopedTheme = useThemeScope();
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          data-theme={scopedTheme}
          className="fixed inset-0 z-overlay bg-scrim data-[state=open]:animate-fade-in"
        />
        <div
          data-theme={scopedTheme}
          className="pointer-events-none fixed inset-0 z-modal flex justify-center px-3 pt-3 sm:px-4 sm:pt-[12vh]"
        >
          <Dialog.Content
            aria-describedby={undefined}
            className={cn(
              "pointer-events-auto flex h-fit max-h-[calc(100dvh-1.5rem)] w-full max-w-xl flex-col overflow-hidden sm:max-h-[min(36rem,76dvh)]",
              "rounded-card border border-rule bg-surface text-text shadow-overlay outline-none data-[state=open]:animate-pop-in",
            )}
          >
            <Dialog.Title className="sr-only">Search</Dialog.Title>
            <Palette onClose={() => onOpenChange(false)} />
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
