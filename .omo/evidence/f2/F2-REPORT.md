# F2 Code-Quality Review — APPROVE

Date: 2026-09-29. Review only; zero product-code files modified.

## Verdict: APPROVE

## 1. svelte-check — 0 errors
`svelte-check found 0 errors and 2 warnings in 1 file`.
Warnings: `src/routes/about/+page.svelte:220` + `:226` unused CSS selectors
`.leader-photo-empty` / `.leader-photo-empty span` — pre-existing, out of F2
scope (owned by no C-todo; flagging as advisory only, not a defect).

## 2. vite build — exit 0
`npm run build`: `✓ built in 4.32s`, `Using @sveltejs/adapter-static`,
`Wrote site to "build"`, `✔ done`.

## 3. Dead code / duplication
- Nav duplication (C2): `TargoHero.svelte` grep `header|nav|menu` = 0 hits;
  `targo-nav|targo-links|targo-burger|menuOpen` hits only in
  `TargoNav.svelte` (single nav). Footer `<nav>` groups (contact/social/
  explore labels) are footer link groups, not nav duplication. PASS.
- Legacy classes: `.grain` (layout shell `+layout.svelte:17` + `app.css:36`)
  and `.reveal` (`app.css:57` + `lib/actions/reveal.ts`) are the two
  sanctioned survivors; no other dead legacy classes found. PASS.
- `console.log|debugger|#05070b|#22d9ee|googleapis|gstatic` = 0 hits. PASS.

## 4. TODO / stub / placeholder abuse (sanctioned excluded)
`TODO|FIXME|XXX|HACK|stub|lorem` = 0 hits outside sanctioned use.
`placeholder` hits: `targo.css` `::placeholder` pseudo-element (1),
HTML input `placeholder=` attrs in `TargoContact.svelte` (form UX, 5),
`UNCONFIRMED placeholder` copy in `team/services/process/faq.ts` (by design).
`{{PLACEHOLDER_*}}` only in `privacy/+page.svelte` + `terms/+page.svelte`
(legal templates, A5 by design); `{{BASIN_KEY}}` only in
`site.ts:29` (A3 owner key); `UNCONFIRMED` only in content modules +
`site.ts` SITE_URL (A1). All sanctioned — not defects. PASS.

## 5. Fabrication (C4)
`212%|+212` = 0 hits in `src/`. `work.ts` carries non-empty `disclosure`
per entry; HRMS labelled concept. No invented metrics/names/testimonials
in content modules. PASS.

## Advisory (non-blocking)
- About-page unused CSS warnings x2 (see §1). Pre-existing since C1;
  C1–C5 each left untouched as out-of-scope. Suggest C6-or-cleanup owner.
