export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "theme";
export const DEFAULT_THEME: Theme = "light";

/** The site is light-only: clears any theme saved before the toggle was removed. */
export const themeInitScript = `(function(){try{localStorage.removeItem("${THEME_STORAGE_KEY}")}catch(e){}document.documentElement.setAttribute("data-theme","light")})()`;
