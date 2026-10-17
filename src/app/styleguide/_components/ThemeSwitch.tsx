"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/design-system";

/** Temporary page-theme switch until the site header lands in Stage 3. */
export function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${next} theme`}
      className="inline-flex h-9 items-center gap-2 rounded-pill border border-rule px-3.5 text-small text-muted transition-colors duration-fast hover:border-rule-strong hover:text-text"
    >
      {theme === "dark" ? <Moon aria-hidden className="size-4" /> : <Sun aria-hidden className="size-4" />}
      <span>{theme === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}
