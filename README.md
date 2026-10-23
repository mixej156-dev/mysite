# LONAR ECO. — staking site prototype

A multi-page website and account dashboard for a crypto staking company. It is a front-end prototype: every page,
flow and animation works in the browser, but there is no backend, no database, no wallet connection and no request to
a blockchain. Figures (pools, APY, balances, transactions, team, articles) are sample data kept in the repository.

The working name is LONAR ECO.; the final brand name is still to be chosen.

## What's inside

**Public site**: home, staking pools and a page per pool, portfolio, rewards calculator, pool comparison, swap,
validator performance, fees, ECO. LEARN guides, blog, docs, FAQ, about, team, security, contact, legal pages, site
search (⌘K / Ctrl+K), a styleguide at `/styleguide` and a 404 page.

**Sign-in**: log in, register with email confirmation, two-factor step, password reset and "Continue with Google". All
of it is simulated: any email and password work, and the session is kept in the browser's `localStorage`.

**Dashboard** (`/dashboard`, after signing in): overview, new stake, positions, rewards, transactions, wallet with
deposit and withdraw, referrals, notifications and settings. Light and dark themes, a first-visit tour, and a tab bar
on phones and tablets. Actions change only the sample account stored in the browser.

## Running it

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev          # http://localhost:3000
```

Production build:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example npm run build
NEXT_PUBLIC_SITE_URL=https://your-domain.example npm run start
```

`NEXT_PUBLIC_SITE_URL` is the site's public address, used for link previews (Open Graph images) and the sitemap. On
Vercel it is picked up automatically. No other environment variables or secrets are needed.

| Command            | What it does                                     |
| ------------------ | ------------------------------------------------ |
| `npm run dev`      | Development server                               |
| `npm run build`    | Production build                                 |
| `npm run start`    | Serve the production build                       |
| `npm run lint`     | ESLint                                           |
| `npm run test:e2e` | End-to-end tests (Playwright, see below)         |

## Stack

Next.js (App Router) and TypeScript, Tailwind CSS with design tokens in CSS variables, Framer Motion, Radix UI
primitives with custom styling, Recharts, lucide-react icons, Geist and Geist Mono fonts.

## Project layout

```
src/
  app/            routes: public site in (site)/, the dashboard in dashboard/, link-preview images
  components/     page sections and shared blocks, grouped by area (home, staking, swap, dashboard, …)
  design-system/  tokens, fonts and base components (Button, Input, Modal, Tabs, Table, …)
  data/           sample data: pools, prices, networks, validators, portfolio, posts, guides, FAQ, team, …
  lib/            formatting, fake auth, the sample account, and the data access layer in lib/api
  styles/         design tokens (tokens.css)
e2e/              Playwright tests
public/           logos, dashboard screenshots used on the home page
```

All colours, spacing, radii, shadows, type sizes and motion timings come from the tokens in `src/styles/tokens.css`;
`/styleguide` shows every component in its states.

## Connecting a backend

Pages don't read the sample data directly; they go through two modules whose function signatures are meant to stay
when real endpoints arrive:

- `src/lib/api/catalog.ts`: read-only catalogue (`getPools`, `getPool`, `getPrices`, `getConversionTerms`,
  `getPlatformMetrics`, `getValidatorReport`, `getUptimeHistory`, `getContentIndex`). Async, used by pages, metadata,
  link previews and the sitemap.
- `src/lib/api/account.ts`: account operations (`stake`, `unstake`, `deposit`, `withdraw`). Each takes the current
  account and returns the updated one; the dashboard calls only these.

To connect a backend, replace the function bodies with requests that return the same shapes; the types in `src/data`
are the contract. Sign-in (`src/lib/auth.tsx`) would need a real session in place of the `localStorage` one. The
decorative home-page scenes, some dashboard calculations and the styleguide still import constants from `src/data`
directly.

## Tests

```bash
npx playwright install chromium   # once
npm run test:e2e
```

The tests cover the dashboard guard, sign-in and sign-out, staking, withdrawing, the swap flow, sign-up that returns to
the page you started from, and the absence of sideways scrolling at 375 px on public and dashboard pages. They start a
development server on port 3001 (or reuse one already running; set `E2E_PORT` to change it).

## Notes

- Sample figures are estimates for demonstration, not an offer or a forecast. Wording on the site avoids legal claims
  (licences, named audits, guaranteed yield).
- Network logos come from the CC0 cryptocurrency-icons set.
- Motion respects `prefers-reduced-motion`.
