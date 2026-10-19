"use client";

import { useCallback, useLayoutEffect, useSyncExternalStore } from "react";
import { DASHBOARD_THEME_KEY, DEFAULT_THEME, type Theme, type ThemePreference } from "./theme-script";

export type { Theme, ThemePreference };

const CHANGE_EVENT = "dashboard-theme-change";
const DARK_QUERY = "(prefers-color-scheme: dark)";

function readPreference(): ThemePreference {
  try {
    const value = localStorage.getItem(DASHBOARD_THEME_KEY);
    return value === "dark" || value === "light" || value === "system" ? value : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

function subscribe(onChange: () => void) {
  const query = window.matchMedia(DARK_QUERY);
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  query.addEventListener("change", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
    query.removeEventListener("change", onChange);
  };
}

const readSystemDark = () => window.matchMedia(DARK_QUERY).matches;

/** Dashboard appearance: the saved preference, the theme it resolves to, and a setter that persists it. */
export function useDashboardTheme() {
  const preference = useSyncExternalStore<ThemePreference>(subscribe, readPreference, () => DEFAULT_THEME);
  const systemDark = useSyncExternalStore(subscribe, readSystemDark, () => false);
  const theme: Theme = preference === "system" ? (systemDark ? "dark" : "light") : preference;

  const setPreference = useCallback((next: ThemePreference) => {
    const apply = () => {
      try {
        localStorage.setItem(DASHBOARD_THEME_KEY, next);
      } catch {
        // Storage unavailable (private mode): the choice still applies until the page reloads.
      }
      window.dispatchEvent(new Event(CHANGE_EVENT));
      /* Set straight away too, so the transition's "after" snapshot never misses React's update */
      const dark = next === "dark" || (next === "system" && readSystemDark());
      document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    };
    /* Cross-fade the whole page between themes where the browser supports it */
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (document.startViewTransition && !reduceMotion) document.startViewTransition(apply);
    else apply();
  }, []);

  return { preference, theme, setPreference };
}

/** Puts the dashboard theme on <html> while mounted (so portalled overlays follow it) and restores light on leave. */
export function useApplyDashboardTheme(theme: Theme) {
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  useLayoutEffect(() => () => document.documentElement.setAttribute("data-theme", DEFAULT_THEME), []);
}
