export type Theme = "dark" | "light";
/** Dashboard appearance setting; "system" follows the device */
export type ThemePreference = Theme | "system";

export const LEGACY_THEME_KEY = "theme";
export const DASHBOARD_THEME_KEY = "dashboard_theme";
export const DEFAULT_THEME: Theme = "light";

/**
 * The site is light-only; the dashboard may be dark. Runs before first paint so a dark dashboard never flashes
 * light on load. Also clears the theme saved before the site toggle was removed.
 */
export const themeInitScript = `(function(){var t="light";try{localStorage.removeItem("${LEGACY_THEME_KEY}");if(/^\\/dashboard(\\/|$)/.test(location.pathname)){var p=localStorage.getItem("${DASHBOARD_THEME_KEY}");if(p==="dark"||(p==="system"&&matchMedia("(prefers-color-scheme: dark)").matches))t="dark"}}catch(e){}document.documentElement.setAttribute("data-theme",t)})()`;
