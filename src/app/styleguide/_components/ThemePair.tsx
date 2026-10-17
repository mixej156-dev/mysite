"use client";

import type { ReactNode } from "react";
import { ThemeScope, type Theme } from "@/design-system";
import { cn } from "@/lib/cn";

const THEMES: Theme[] = ["light", "dark"];

/** Renders the same preview in both themes, side by side from 1024px unless stacked. */
export function ThemePair({
  children,
  className,
  stacked = false,
}: {
  children: (theme: Theme) => ReactNode;
  className?: string;
  /** Full-width panels, for wide content such as tables. */
  stacked?: boolean;
}) {
  return (
    <div className={cn("grid gap-4", !stacked && "lg:grid-cols-2")}>
      {THEMES.map((theme) => (
        <ThemeScope
          key={theme}
          theme={theme}
          className="min-w-0 rounded-card border border-rule bg-bg text-text"
        >
          <p className="border-b border-rule px-5 py-2.5 text-caption text-muted">
            {theme === "light" ? "Light" : "Dark"}
          </p>
          <div className={cn("flex flex-col gap-8 p-5 sm:p-6", className)}>{children(theme)}</div>
        </ThemeScope>
      ))}
    </div>
  );
}
