import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/cn";

export type TableProps = ComponentPropsWithRef<"table"> & {
  /** Accessible name for the scroll region. */
  label?: string;
};

/** Scrolls horizontally inside its own frame so the page never does. */
export function Table({ label, className, ...props }: TableProps) {
  return (
    <div role="region" aria-label={label} tabIndex={label ? 0 : undefined} className="w-full overflow-x-auto">
      <table className={cn("w-full border-collapse text-left text-small", className)} {...props} />
    </div>
  );
}

export function THead({ className, ...props }: ComponentPropsWithRef<"thead">) {
  return <thead className={cn("border-b border-rule", className)} {...props} />;
}

export function TBody({ className, ...props }: ComponentPropsWithRef<"tbody">) {
  return <tbody className={cn("[&>tr]:border-b [&>tr]:border-rule [&>tr:last-child]:border-0", className)} {...props} />;
}

export function TR({ className, ...props }: ComponentPropsWithRef<"tr">) {
  return <tr className={cn("transition-colors duration-fast hover:bg-surface-2/50", className)} {...props} />;
}

export type SortDirection = "asc" | "desc" | null;

export type THProps = ComponentPropsWithRef<"th"> & {
  numeric?: boolean;
  /** Makes the header a sort button; pass null when sortable but not active. */
  sort?: SortDirection;
  onSort?: () => void;
};

export function TH({ numeric = false, sort, onSort, className, children, ...props }: THProps) {
  const sortable = onSort !== undefined;
  const SortIcon = sort === "asc" ? ArrowUp : sort === "desc" ? ArrowDown : ArrowUpDown;

  return (
    <th
      scope="col"
      aria-sort={sort === "asc" ? "ascending" : sort === "desc" ? "descending" : undefined}
      className={cn(
        "h-11 px-3 align-middle font-normal whitespace-nowrap text-muted first:pl-0 last:pr-0",
        numeric && "text-right",
        className,
      )}
      {...props}
    >
      {sortable ? (
        <button
          type="button"
          onClick={onSort}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-sm transition-colors duration-fast hover:text-text",
            sort && "text-text",
            numeric && "flex-row-reverse",
          )}
        >
          {children}
          <SortIcon aria-hidden className={cn("size-3.5", !sort && "opacity-50")} />
        </button>
      ) : (
        children
      )}
    </th>
  );
}

export type TDProps = ComponentPropsWithRef<"td"> & { numeric?: boolean };

export function TD({ numeric = false, className, ...props }: TDProps) {
  return (
    <td
      className={cn(
        "h-14 px-3 align-middle whitespace-nowrap first:pl-0 last:pr-0",
        numeric && "text-right font-mono",
        className,
      )}
      {...props}
    />
  );
}
