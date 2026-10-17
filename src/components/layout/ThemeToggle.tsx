"use client";

import { Moon, Sun } from "lucide-react";
import { Tooltip, useTheme } from "@/design-system";
import { cn } from "@/lib/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";

  return (
    <Tooltip content={label} side="bottom">
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={label}
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-pill text-muted transition-colors duration-fast hover:bg-surface-2 hover:text-text",
          className,
        )}
      >
        {theme === "dark" ? <Moon aria-hidden className="size-[1.125rem]" /> : <Sun aria-hidden className="size-[1.125rem]" />}
      </button>
    </Tooltip>
  );
}
