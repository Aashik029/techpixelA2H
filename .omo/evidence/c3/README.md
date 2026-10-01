# C3 evidence — typed content layer + service routes

## Files (all pre-existing, verified verbatim this run — zero C3 edits needed)
- `src/lib/content/services.ts` — 5 services verbatim from `TargoServices.svelte`
  (n/t/d/tag mirrored; `deliverables`/`detail` marked UNCONFIRMED placeholders, no metrics/testimonials)
- `src/lib/content/team.ts`, `process.ts`, `faq.ts` — UNCONFIRMED placeholders, no fabricated facts
- `src/routes/services/+page.ts` + `+page.svelte` — index lists all 5 with `<a href="/services/<slug>">`
- `src/routes/services/[slug]/+page.ts` — `entries()` exports all 5 slugs; unknown slugs `error(404)`
- `src/routes/services/[slug]/+page.svelte` — existing `.targo-*` classes only
- `src/lib/components/TargoServices.svelte` — cards already `<a href="/services/<slug>">` (inbound links)
- NOTE: task brief said `src/lib/data/services.ts`; plan lines 128-156 (source of truth) say
  `src/lib/content/services.ts` — the on-disk `content/` path was kept per plan.

## Verification
- `npm run check`: 0 errors (2 pre-existing unused-CSS warnings on about page, out of C3 scope)
- `npm run build` (vite): exit 0; `build/services.html` + all 5 `build/services/<slug>.html` prerendered
- QA script: `c3-qa.mjs` under `vite preview :4173` — **C3-QA PASS (29/29)**
  - primary: `build/404.html` exists + contains C2 markup ("wandered off")
  - happy: index 200 + 5/5 index links; 5/5 slugs 200 + non-empty h1; 5/5 home card hrefs exact
  - secondary: `/services/nope` → 404 + C2 error page renders (kit#10734 caveat recorded)

## Artifacts in this dir
`c3-qa.mjs`, `preview.log`, `happy-services-index.png`, `happy-services-<slug>.png` (x5),
`happy-home-services-cards.png`, `failure-services-nope.png`
