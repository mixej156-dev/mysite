/**
 * Absolute origin of the site, for link previews, the sitemap and robots.txt.
 * Set NEXT_PUBLIC_SITE_URL at build time (e.g. the tunnel or the final domain); on Vercel the production
 * domain is picked up automatically. Not a secret.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

export const SITE_NAME = "LONAR ECO.";
