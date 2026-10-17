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
## Part 3 — dashboard/auth visual audit (todo)
## Part 4 — interaction states & a11y (todo)
## Part 5 — consistency, 404, empty states (todo)
