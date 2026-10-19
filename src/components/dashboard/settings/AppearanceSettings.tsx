"use client";

import { Check } from "lucide-react";
import { useDashboardTheme, type Theme, type ThemePreference } from "@/design-system";
import { cn } from "@/lib/cn";
import { SettingsSection } from "./SettingsSection";

const OPTIONS: { id: ThemePreference; label: string; note: string }[] = [
  { id: "light", label: "Light", note: "The site’s own look." },
  { id: "dark", label: "Dark", note: "Near-black, easier at night." },
  { id: "system", label: "System", note: "Follows your device." },
];

/** Miniature dashboard drawn in the given theme's tokens: sidebar, a balance line and a chart bar row */
function ThemePreview({ theme, className }: { theme: Theme; className?: string }) {
  return (
    <span data-theme={theme} aria-hidden className={cn("flex h-full bg-bg", className)}>
      <span className="flex w-1/4 flex-col gap-1.5 border-r border-rule p-2">
        <span className="h-1.5 w-3/4 rounded-pill bg-text/70" />
        <span className="mt-1 h-1.5 w-full rounded-pill tint-accent" />
        <span className="h-1.5 w-2/3 rounded-pill bg-surface-2" />
        <span className="h-1.5 w-3/4 rounded-pill bg-surface-2" />
      </span>
      <span className="flex flex-1 flex-col gap-2 p-2.5">
        <span className="flex flex-col gap-1.5 rounded-sm border border-rule bg-surface p-2">
          <span className="h-1.5 w-1/3 rounded-pill bg-muted/60" />
          <span className="h-2.5 w-1/2 rounded-pill bg-text" />
          <span className="flex h-1 gap-0.5">
            <span className="w-3/5 rounded-pill bg-topic-blue" />
            <span className="w-2/5 rounded-pill bg-topic-teal" />
          </span>
        </span>
        <span className="flex flex-1 items-end gap-1 rounded-sm border border-rule bg-surface p-2">
          {[40, 55, 45, 70, 60, 85].map((h) => (
            <span key={h} className="flex-1 rounded-t-[2px] bg-series-1/70" style={{ height: `${h}%` }} />
          ))}
        </span>
      </span>
    </span>
  );
}

export function AppearanceSettings() {
  const { preference, setPreference } = useDashboardTheme();

  return (
    <SettingsSection title="Theme" body="Applies to the dashboard on this device. The public site stays light.">
      <div role="radiogroup" aria-label="Theme" className="grid max-w-2xl gap-3 sm:grid-cols-3">
        {OPTIONS.map((o) => {
          const selected = preference === o.id;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setPreference(o.id)}
              className={cn(
                "group flex flex-col overflow-hidden rounded-field border text-left transition-[border-color,box-shadow] duration-fast max-sm:flex-row",
                selected ? "border-accent ring-1 ring-accent" : "border-rule hover:border-rule-strong",
              )}
            >
              <span className="relative aspect-[16/10] overflow-hidden border-rule max-sm:w-32 max-sm:shrink-0 max-sm:border-r sm:border-b">
                {o.id === "system" ? (
                  <span className="flex h-full">
                    <ThemePreview theme="light" className="w-1/2 overflow-hidden [&>span:first-child]:hidden" />
                    <ThemePreview theme="dark" className="w-1/2 overflow-hidden [&>span:first-child]:hidden" />
                  </span>
                ) : (
                  <ThemePreview theme={o.id} />
                )}
              </span>
              <span className="flex flex-1 items-start justify-between gap-2 p-3">
                <span>
                  <span className="block text-small font-medium">{o.label}</span>
                  <span className="block text-caption text-muted">{o.note}</span>
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "grid size-5 shrink-0 place-items-center rounded-pill transition-[scale,opacity] duration-fast",
                    selected ? "bg-accent text-on-accent" : "scale-75 opacity-0",
                  )}
                >
                  <Check className="size-3.5" />
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </SettingsSection>
  );
}
