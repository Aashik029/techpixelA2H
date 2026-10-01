# F3 Browser QA — Verdict: APPROVE

Origin: `vite preview` over `build/` (`http://127.0.0.1:4174`). No product code modified (QA only).
Existing `build/` reused as-is; no rebuild (honors F3 "no files modified").

## Results

| Check | Result |
|---|---|
| Keyboard: skip link first Tab stop, visible (top=12, 173x45, opacity 1) | PASS |
| Keyboard: Enter on skip moves focus into `#main` (MAIN#main) | PASS |
| Keyboard: mobile toggle visible @390, opens on Enter (aria-expanded=true) | PASS |
| Keyboard: Tab trapped in open menu | PASS* (see note) |
| Keyboard: Escape closes menu (aria-expanded=false), focus returns to toggle | PASS |
| Mobile 390px: no overflow, all 17 routes (scrollWidth=390=inner) | 17/17 PASS |
| no-JS: contact paths (tel=2 mailto=3 wa=2), zero empty mailto, 6 nav links | PASS |
| Form `route()` 500 → fallback copy + composed mailto + wa.me intact | PASS |
| Form `route.abort()` → fallback copy + composed mailto + wa.me intact | PASS |
| Reduced-motion: hero paused, toggle reads Play, about paused after scroll, both pause controls present | PASS |
| Link crawl: 17 unique internal hrefs, each HTTP 200, zero 404s | PASS |

\* Initial run reported 1 FAIL (`Tab trapped inside open menu (header)`) — root-caused as a
test-scope artifact, not a product defect: `#targo-mobile-menu` is a sibling AFTER `</header>`
(TargoNav.svelte:133-136), so containment-in-`header` was the wrong oracle while the real
trap (menuEl-scoped Tab wrap, TargoNav.svelte:42-54) held. Re-probe `f3-trap-reprobe.mjs`
with the correct scope (`#targo-mobile-menu` + toggle) held 20 Tabs without escape: 2/2 PASS.
Effective total: all F3 assertions green.

## Evidence files

- `f3-qa.mjs` — full sweep script
- `f3-qa-results.txt` — 42/43 raw run (1 artifact FAIL documented above)
- `f3-trap-reprobe.mjs` + `f3-trap-reprobe-results.txt` — trap re-probe 2/2 PASS
- `crawl-report.txt` — 17 hrefs, all 200, zero 404s
- `mobile-390-work.png`, `nojs-contact.png`, `form-500.png`, `form-abort.png`, `reduced-motion.png`
