# Stage 8 — audit progress

## Part 1 — automated checks (done)
- `npm run lint`, `tsc --noEmit`, `npm run build`: clean (57 static pages).
- Hardcoded colors: none outside `tokens.css`/`globals.css` (`--color-white`). Only exception: QR placeholder in `SecuritySettings.tsx` uses `bg-white text-black` on purpose (QR needs fixed contrast).
- Arbitrary sizes: only text-measure widths (`max-w-[NNch]`) and a few icon offsets; no arbitrary colors/spacing.
- Internal links: every static and templated `href` resolves to an existing route. `href="#"` remains only for social placeholders (TeamCard, Footer), per spec.
- Metadata: every `page.tsx` has `metadata`/`generateMetadata`.
- **Found:** no `not-found.tsx` / `error.tsx` → fix in Part 5.

## Part 2 — public visual audit (todo)
## Part 3 — dashboard/auth visual audit (todo)
## Part 4 — interaction states & a11y (todo)
## Part 5 — consistency, 404, empty states (todo)
