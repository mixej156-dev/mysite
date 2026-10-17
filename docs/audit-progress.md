# Stage 8 — audit progress

# Status: all 5 parts done

## Part 1 — automated checks (done)
- `npm run lint`, `tsc --noEmit`, `npm run build`: clean (57 static pages).
- Hardcoded colors: none outside `tokens.css`/`globals.css` (`--color-white`). Only exception: QR placeholder in `SecuritySettings.tsx` uses `bg-white text-black` on purpose (QR needs fixed contrast).
- Arbitrary sizes: only text-measure widths (`max-w-[NNch]`) and a few icon offsets; no arbitrary colors/spacing.
- Internal links: every static and templated `href` resolves to an existing route. `href="#"` remains only for social placeholders (TeamCard, Footer), per spec.
- Metadata: every `page.tsx` has `metadata`/`generateMetadata`.
- **Found:** no `not-found.tsx` / `error.tsx` → fixed in Part 5.

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
## Part 5 — consistency, 404, empty states (done)
- **404:** `src/app/not-found.tsx` (own header/footer, for unmatched URLs) and `src/app/(site)/not-found.tsx` (for `notFound()` on unknown pool/article/doc slugs, inside the site layout) share `NotFoundContent`. Checked: one header/footer/main/h1 on `/nonexistent`, `/staking/xyz`, `/blog/nope`, `/docs/zzz`, `/dashboard/zzz`.
- **Error boundary:** `src/app/error.tsx` (Try again / Back to home). Not triggered in a browser — compiled and type-checked only.
- **Empty states:** blog, staking, transactions and FAQ search with no matches all render the shared `EmptyState` with a "Clear filters" action.
- **Consistency scan:** radii only `pill/card/field/sm` tokens; durations only `fast/base/slow`; icons all lucide at 3.5–8 sizes; section bottom padding uniform (`pb-24 md:pb-32`).
- Final: lint, `tsc --noEmit`, `next build` clean.

## Left / not done
- `/staking/[asset]`, `/blog/[slug]`, `/docs/[slug]` unknown slugs return HTTP 200 with the 404 UI in dev (streaming with Cache Components); not verified against `next start`.
- Social links (`href="#"`) remain placeholders by spec.
- Text-measure `max-w-[NNch]` arbitrary values left as-is (not colors/spacing).
- Stage 9 (animation polish, final screenshots) not started.

# Stage 9 — motion polish and final screenshots (done)
- **Scroll reveal:** `RevealGroup` (used by `Section`) fades each direct child up once when it first scrolls into view. Blocks already on screen at load are not touched (no flash); under `prefers-reduced-motion` nothing is hidden. CSS lives next to the view-transition rules in `globals.css` and uses the motion tokens.
- **Micro-interactions:** buttons press down 1px on `:active`; interactive cards lift 2px with the float shadow on hover. Both use existing tokens (`duration-fast`/`duration-base`, brand easing).
- Already in place and left alone: page view-transitions, count-up stat cards, payout ledger, toast/modal/accordion motion, marquee.
- **Final screenshots:** `docs/screenshots/` — 31 routes (public, auth, dashboard, 404) x 375/768/1440 x light/dark = 186 JPEGs (~28 MB). Script-checked: no horizontal scroll, one h1 per page.
