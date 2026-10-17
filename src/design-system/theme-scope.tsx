"use client";

import { createContext, useContext, type ComponentPropsWithRef } from "react";
import type { Theme } from "./theme-script";

const ThemeScopeContext = createContext<Theme | undefined>(undefined);

/**
 * Renders children in a fixed theme regardless of the page theme, including
 * portalled overlays (Select, Dropdown, Tooltip, Modal). Used for side-by-side previews.
 */
export function ThemeScope({ theme, ...props }: ComponentPropsWithRef<"div"> & { theme: Theme }) {
  return (
    <ThemeScopeContext.Provider value={theme}>
      <div data-theme={theme} {...props} />
    </ThemeScopeContext.Provider>
  );
}

/** Theme to stamp on portalled content; undefined means "inherit from <html>". */
export function useThemeScope(): Theme | undefined {
  return useContext(ThemeScopeContext);
}
