"use client";

import { useCallback, useSyncExternalStore } from "react";
import { DEFAULT_THEME, THEME_STORAGE_KEY, type Theme } from "./theme-script";

export type { Theme };

/* Notified when the saved preference changes, from the header toggle or the appearance setting */
const prefListeners = new Set<() => void>();

function readTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

/** Current page theme (from <html data-theme>) and a setter that persists the choice. */
export function useTheme() {
  const theme = useSyncExternalStore<Theme>(subscribe, readTheme, () => DEFAULT_THEME);

  const setTheme = useCallback((next: Theme) => {
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage unavailable (private mode): theme still applies for this page view.
    }
    prefListeners.forEach((l) => l());
  }, []);

  const toggleTheme = useCallback(() => setTheme(readTheme() === "dark" ? "light" : "dark"), [setTheme]);

  return { theme, setTheme, toggleTheme };
}

export type ThemePreference = Theme | "system";

function readPreference(): ThemePreference {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === "dark" || saved === "light" ? saved : "system";
  } catch {
    return "system";
  }
}

/** The saved choice, including "system" (follow the OS). Used by the appearance setting. */
export function useThemePreference() {
  const { setTheme } = useTheme();
  const preference = useSyncExternalStore<ThemePreference>(
    (onChange) => {
      prefListeners.add(onChange);
      return () => prefListeners.delete(onChange);
    },
    readPreference,
    () => "system",
  );

  const setPreference = useCallback(
    (next: ThemePreference) => {
      if (next === "system") {
        try {
          localStorage.removeItem(THEME_STORAGE_KEY);
        } catch {
          // Storage unavailable: still apply the OS theme for this page view
        }
        const os: Theme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", os);
        prefListeners.forEach((l) => l());
      } else {
        setTheme(next);
      }
    },
    [setTheme],
  );

  return { preference, setPreference };
}
