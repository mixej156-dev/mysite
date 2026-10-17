import { cn } from "@/lib/cn";

/** Placeholder brand mark: a ring holding three ledger lines. Swap when the brand is final. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={cn("size-6", className)}>
      <circle cx="12" cy="12" r="10.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.75 9h10.5M6.75 12h10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6.75 15h5.5" stroke="var(--accent-text)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-display text-body font-semibold tracking-tight", className)}>
      <LogoMark />
      LONAR ECO.
    </span>
  );
}
