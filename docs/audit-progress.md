# Stage 8 — audit progress

## Part 1 — automated checks (done)
- `npm run lint`, `tsc --noEmit`, `npm run build`: clean (57 static pages).
- Hardcoded colors: none outside `tokens.css`/`globals.css` (`--color-white`). Only exception: QR placeholder in `SecuritySettings.tsx` uses `bg-white text-black` on purpose (QR needs fixed contrast).
- Arbitrary sizes: only text-measure widths (`max-w-[NNch]`) and a few icon offsets; no arbitrary colors/spacing.
- Internal links: every static and templated `href` resolves to an existing route. `href="#"` remains only for social placeholders (TeamCard, Footer), per spec.
- Metadata: every `page.tsx` has `metadata`/`generateMetadata`.
- **Found:** no `not-found.tsx` / `error.tsx` → fix in Part 5.

## Part 2 — public visual audit (done)
- 20 public routes (+404) x 375/768/1440 x light/dark screenshotted with playwright-core; automated checks per shot: no horizontal scroll, no element overflowing the viewport outside a scroll container, exactly one h1, no console errors (only the expected 404 from `/nonexistent`).
- Eyeballed home, staking, pool detail, tools, compare, team, blog, security, about, docs, faq, contact at the main breakpoints: no clipping, overlap or density problems found. Compare table scrolls horizontally inside its own region on mobile (sticky first column, labelled region) by design; charts render (initial blank frame is the entry animation).
- No code changes needed in this part.
## Part 3 — dashboard/auth visual audit (done)
- Auth screens (login, register, forgot-password) and all 8 dashboard routes at 375/768/1440, light/dark. Guard redirects guests to `/login`; login sets the session and lands on `/dashboard`.
- States exercised in a real browser: empty-submit login (inline errors, focus moves to first invalid field), stake form validation, confirm modal, deposit modal, position detail modal; Esc closes dialogs.
- **Fixed:** at 375px the Rewards history table clipped the Amount column (15px over) → date shows without the year on mobile (`formatDateShort`); the Referrals table hid "You earned" off-screen (72px over) → Status badge moves under the email on mobile.
- Remaining by design: `/tools/compare` table scrolls inside its labelled region on mobile (sticky first column).
## Part 4 — interaction states & a11y (done)
- Ran axe-core (wcag2a/aa, 2.1aa, best-practice) on 30 routes x light/dark. Fixed:
  - **color-contrast (light theme):** `--accent-text` #2f57e6 → #2b51d8 (4.29 → 4.76:1 on the 14% accent tint) and `--warning` #855a07 → #7a5206 (4.49 → 5.13:1 on the warning tint). Values only nudged within the same hue; flagged here because the design system was approved earlier.
  - **aria-hidden-focus:** Recharts' keyboard layer made the (aria-hidden) chart focusable → `accessibilityLayer={false}`; the Table view stays the accessible alternative.
  - **aria-valid-attr-value:** Radix tab triggers pointed `aria-controls` at panels that aren't mounted (segmented controls, inactive tabs) → `TabsTrigger` drops the attribute when no panel exists.
  - **definition-list:** `<p>` inside `<dl>` on /staking and /about moved out.
  - **heading-order:** visually hidden h2 before the pool list and the team directory.
  - **region / landmark-unique:** dashboard footer note is now a `<footer>`; sidebar and stake-summary asides got labels.
  - **aria-allowed-role:** redundant `role="group"` removed from testimonial slides.
- Remaining axe hits are `/styleguide` only: a deliberately disabled (opacity-45) demo and repeated landmarks in side-by-side component previews.
- Keyboard: tabbed 70 stops on /, /staking, /tools/calculator, /dashboard/stake, /faq; every stop shows a focus ring (stretched card links draw it on `::after`); Esc closes dialogs. Skip link present on public and dashboard layouts.
- `prefers-reduced-motion: reduce`: no infinite animations running; Framer components use `useReducedMotion`; global CSS rules in `globals.css`/`tokens.css`.
## Part 5 — consistency, 404, empty states (todo)
