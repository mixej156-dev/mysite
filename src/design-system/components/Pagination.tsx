"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export type PaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  className?: string;
};

/** Page numbers with ellipses: always first, last, and neighbours of the current page. */
function pageItems(page: number, count: number): Array<number | "gap"> {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const pages = new Set([1, count, page - 1, page, page + 1].filter((p) => p >= 1 && p <= count));
  if (page <= 3) [2, 3, 4].forEach((p) => pages.add(p));
  if (page >= count - 2) [count - 3, count - 2, count - 1].forEach((p) => pages.add(p));
  const sorted = [...pages].sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? (["gap", p] as const) : [p]));
}

const item =
  "grid h-9 min-w-9 place-items-center rounded-field px-2 font-mono text-small transition-colors duration-fast";

export function Pagination({ page, pageCount, onPageChange, className }: PaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <nav aria-label="Pagination" className={cn("flex items-center gap-1", className)}>
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={cn(item, "text-muted hover:bg-surface-2 hover:text-text disabled:pointer-events-none disabled:opacity-35")}
      >
        <ChevronLeft aria-hidden className="size-4" />
      </button>
      <p className="px-2 font-mono text-small text-muted sm:hidden">
        {page} / {pageCount}
      </p>
      <ul className="flex items-center gap-1 max-sm:hidden">
        {pageItems(page, pageCount).map((p, i) =>
          p === "gap" ? (
            <li key={`gap-${i}`} aria-hidden className="grid h-9 w-6 place-items-center text-muted">
              …
            </li>
          ) : (
            <li key={p}>
              <button
                type="button"
                onClick={() => onPageChange(p)}
                aria-current={p === page ? "page" : undefined}
                aria-label={`Page ${p}`}
                className={cn(
                  item,
                  p === page ? "bg-text text-bg" : "text-muted hover:bg-surface-2 hover:text-text",
                )}
              >
                {p}
              </button>
            </li>
          ),
        )}
      </ul>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pageCount}
        aria-label="Next page"
        className={cn(item, "text-muted hover:bg-surface-2 hover:text-text disabled:pointer-events-none disabled:opacity-35")}
      >
        <ChevronRight aria-hidden className="size-4" />
      </button>
    </nav>
  );
}
