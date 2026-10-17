import { cn } from "@/lib/cn";

export type Step = { title: string; body: string };

const COLUMNS: Record<number, string> = { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" };

/** Numbered sequence. A rule with step markers runs across on desktop and down the side on mobile. */
export function StepsFlow({ steps, className }: { steps: Step[]; className?: string }) {
  return (
    <ol className={cn("grid gap-0 lg:gap-8", COLUMNS[steps.length] ?? "lg:grid-cols-4", className)}>
      {steps.map((step, i) => (
        <li key={step.title} className="relative flex gap-6 pb-12 last:pb-0 lg:flex-col lg:gap-0 lg:pb-0">
          {/* Connector: vertical on mobile, horizontal on desktop */}
          <span
            aria-hidden
            className={cn(
              "absolute top-3 bottom-0 left-[0.6875rem] w-px bg-rule lg:top-[0.6875rem] lg:right-[-2rem] lg:bottom-auto lg:left-6 lg:h-px lg:w-auto",
              i === steps.length - 1 && "hidden",
            )}
          />
          <span
            aria-hidden
            className="relative z-10 grid size-6 shrink-0 place-items-center rounded-pill border border-rule-strong bg-bg"
          >
            <span className="size-2 rounded-pill bg-accent" />
          </span>
          <div className="lg:mt-8">
            <p className="font-mono text-caption text-muted">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-2 text-h3">{step.title}</h3>
            <p className="mt-3 max-w-[34ch] font-serif text-body text-muted">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
