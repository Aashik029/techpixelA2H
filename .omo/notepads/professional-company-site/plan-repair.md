## 2026-09-28 — Metis NO-GO plan repair (B1/B2, M1-M7, m1-m7)

Scope of change: `.omo/plans/professional-company-site.md` ONLY (174 -> 239 lines). No product
code touched, no todos added or removed (still 6 todos + F1-F4), scope unchanged.

- B1 -> C2: adapter-static swap now owned by C2 (dep, `svelte.config.js` swap, `+layout.ts`
  `prerender = true`, proof = `build/index.html`, explicit `/404` -> `build/404.html` strategy
  line with `fallback` documented as the alternative).
- B2 -> C3/C4/C6: inbound-link lines added (service cards -> `/services/<slug>`, work cards ->
  `/work/<slug>`, footer Privacy/Terms spans -> `<a>` plus site-wide `/services` + `/work`).
  C2 `site.ts` nav page-id union widened so C3/C4 register without another type edit.
- M1 C1: subjective "visual regression" replaced by behavioral gates (no overflow @390/1280,
  `document.fonts.check` x2, body bg != `#05070b`).
- M2 C3: 404 QA origin = `vite preview` over `build/` (never dev), C2 404 strategy asserted.
- M3 C5: `BASIN_ENDPOINT = 'https://usebasin.com/api/f/{{BASIN_KEY}}'` placeholder in `site.ts`
  (A3 owner key); QA uses `page.route()` for 200 / 500 / abort().
- M4 C5: consent-gate failure run = zero Plausible requests pre-consent, `<script>` only after
  Accept, `localStorage` flag survives reload.
- M5 C6: OG manifest `static/og/{home,about,privacy,terms,services-<slug>,work-<slug>}.png`
  at 1200x630 via Playwright; og:image 200 check under `vite preview`.
- M6: `### Owner decisions - A1-A5` table copied from draft into `## Scope` + owner-actions
  paragraph (A1 unconfirmed -> `SITE_URL`, A3 Basin key, A4 Plausible funding).
- M7: C1 pre-flight `npx playwright install chromium`; C6 `npx lighthouse` median-of-3 +
  `@axe-core/playwright` devDep declared.
- m1 dropped C2->C5 forward-ref; m2 TargoContact cited by symbol (`step`, `TOTAL`, `next()`,
  `validate()`, `sent`, `copyEmail()`, `WHATSAPP_BASE`) verified against source; m3
  fonts.check + zero-googleapis assertions; m4 K1-K4 named keyboard assertions; m5 axe scope
  = every C1-C6 route, threshold 0 serious/critical; m6 F3 renamed "Browser QA" + evidence
  f1..f4; m7 C4 greps `src/` AND `build/` for `212%` + disclosure non-empty DOM check.

Verified facts read from source during repair (not fabricated): `adapter-auto` in
`svelte.config.js`, no `+layout.ts` anywhere, `src/lib/content/site.ts` does not exist yet,
footer spans at `TargoFooter.svelte:55-56`, Google-Fonts CDN at `app.html:7-9`,
`TOTAL`/`next()`/`sent` symbols in `TargoContact.svelte`.

## 2026-09-28 — Metis RE-REVIEW of repaired plan (239 lines): GO

Structure re-verified: 6 todos (lines 60-65) + F1-F4 (225-228), scope C1-C6 unchanged,
MUST-NOT-HAVE intact (25-28), no human-in-loop QA (line 50; F3 line 227 "NOT human").

Closure check against prior NO-GO (cites = plan lines):

- **B1 CLOSED** — C2 owns the adapter swap: dep + `svelte.config.js` swap in place of
  `adapter-auto` (111-113), `src/routes/+layout.ts` with `export const prerender = true`,
  ssr on (113), proof = `vite build` exit 0 AND `build/index.html` exists (114), 404
  strategy = `/404` route backed by `+error.svelte` -> `build/404.html`, adapter
  `fallback: '404.html'` cited as documented alternative, runtime assertion delegated to
  C3 failure QA (114-117). Technique independently verified: a `/404` route does emit
  `build/404.html` (sveltejs/kit#10880).
- **B2 CLOSED** — C3 service cards -> `<a href="/services/<slug>">` (136-138); C4 work
  cards -> `<a href="/work/<slug>">` (155-157); C6 footer `<span>`s -> `<a href="/privacy">`/
  `<a href="/terms">` + site-wide `/services` + `/work` links (202-204); C2 page-id union
  widened `'home'|'about'|'services'|'work'|'contact'|...` (109-111).
- **M1 CLOSED** — behavioral assertions replace subjective visual regression: no overflow
  @390/1280, `document.fonts.check` x2, body bg never `#05070b` (79-84).
- **M2 CLOSED** — origin = `vite preview` over `build/`, never dev; blank dev 404 = FAIL;
  C2 404 strategy asserted (141-145). Residual nit N1 below.
- **M3 CLOSED** — `BASIN_ENDPOINT = 'https://usebasin.com/api/f/{{BASIN_KEY}}'` placeholder
  (175-177); QA `page.route()` stubbed 200 / 500 / `route.abort()` (182-185).
- **M4 CLOSED** — zero Plausible requests before consent, `<script>` only after Accept,
  `localStorage` consent flag survives reload (186-188).
- **M5 CLOSED** — OG manifest glob `static/og/{home,about,privacy,terms,services-<slug>,
  work-<slug>}.png` at 1200x630 via Playwright, query-param OG still forbidden (206-210);
  QA checks every manifest entry exists + each `og:image` returns 200 under preview (217-219).
- **M6 CLOSED** — Owner-decisions A1-A5 table inside `## Scope` (30-44) + owner-actions
  paragraph (40-44); C2 `site.ts` owns `SITE_URL` from A1 marked UNCONFIRMED in-code (107-108).
- **M7 CLOSED** — C1 pre-flight `npx playwright install chromium` gating all browser QA
  (85-86); C6 `@axe-core/playwright` new devDep, scope = every C1-C6 route, threshold =
  zero serious/critical (211-213); `npx lighthouse` mobile median-of-3 with score AND raw
  metric gates (213-216).
- **m1 CLOSED** — no C2->C5 forward-ref anywhere in C2 (93-125); m2 CLOSED — TargoContact
  cited by symbol (`step`, `TOTAL`, `next()`, `validate()`, `sent`, `copyEmail()`,
  `WHATSAPP_BASE`) (168-174); m3 CLOSED — `document.fonts.check` x2 (82-83) + blocked
  googleapis/gstatic zero-request failure run (88-90); m4 CLOSED — named K1-K4 keyboard
  assertions (119-123); m5 CLOSED — axe scope + threshold (211-213); m6 CLOSED — F3 renamed
  "Browser QA (agent-executed — NOT human)" (227) + evidence f1..f4 (225-228); m7 CLOSED —
  disclosure non-empty DOM check (159-160) + grep `src/` AND `build/` for `212%` (161-163).

**Verdict: GO — 0 blockers / 0 majors / all 7 prior minors closed.** New findings this pass
(both MINOR, non-blocking, not in prior report):

- **N1 (C3, B1's 404 arm):** no QA asserts `build/404.html` EXISTS on disk; C3's runtime
  check runs under `vite preview`, whose adapter-static error-handling fidelity is a known
  open issue (sveltejs/kit#10734) and can pass via preview-side error rendering while the
  artifact is absent. Repair (one line, C3 failure QA): assert `build/404.html` exists and
  contains C2's error markup before/alongside the `/services/nope` request — host-independent
  emission proof. F1's "every acceptance holds" (225) would also catch this at wave end.
- **N2 (C3/C4, B2 verification):** happy QA visits slugs by direct URL; the new inbound card
  links are never href-asserted or clicked. Repair: assert each card's `href` equals
  `/services/<slug>` / `/work/<slug>` in the happy runs (F1 acceptance audit partially covers).
- **Advisory (C6):** super-sitemap's `+server.ts` example marks `export const prerender = true`
  optional; if it does not inherit from the root layout, adapter-static's strict check fails
  the build loudly — self-correcting, executor adds one line. Not a gap.

Owner actions A1/A3/A4/A5 (40-44) remain launch-blocking by design, not plan-blocking.
No plan repair round required; fold N1/N2 lines into C3/C4 QA or rely on F1.

No plan repair round required; fold N1/N2 lines into C3/C4 QA or rely on F1.

## 2026-09-28 — Momus high-accuracy review (239 lines): APPROVE

Independent cold re-read of `.omo/plans/professional-company-site.md` + draft ledgers; every
file/line/symbol claim re-verified against source (not taken from Metis's report):

- **Structure/template:** headers verbatim and in scaffold order (TL;DR L3 / Scope L13 /
  Verification L46 / Execution L52 / Todos L58 / Final wave L223 / Commit strategy L230 /
  Success criteria L235); column-zero rows `- [ ] 1.`-`6.` (60-65) and `- [ ] F1.`-`F4.`
  (225-228); all 6 todos carry Component trace + References + Acceptance + agent-executed
  happy AND failure QA + evidence path + Commit line.
- **References spot-checked against source (all accurate):** `app.css` 183 lines w/ `#05070b`
  `@theme` + `.grain`/`.reveal`/reduced-motion; `targo.css` 130; Google-Fonts CDN at
  `app.html:7-9`; `TargoHero` nav markup 44-90 + nav CSS 164-302 + state 6-7;
  `TargoNav` 201 lines, line-3 `'home'|'about'` union, `position: relative` (non-sticky),
  `isMobile` set from `window.innerWidth`, no Escape/trap anywhere; `TargoFooter:55-56` dead
  spans; `+page.svelte` footer outside `<main>` (L49/L50); `svelte.config.js` =
  `adapter-auto`, no `+layout.ts`/`+error.svelte`/`content/site.ts` exist (all "to create");
  `TargoServices` 5 services all `-> #contact`; `TargoWork:181` `+212%` badge, HRMS concept;
  `TargoContact` symbols all present (`step`,`TOTAL`=4,`next`,`back`,`validate`,`startOver`,
  `sent`,`copyEmail`,`WHATSAPP_BASE`, mailto composed inside `next()`); `armAutoplay` 800ms
  interval + 4 document gesture listeners, no reduced-motion check; no pause controls;
  no skip link repo-wide; hand `static/sitemap.xml` on `techpixela2h.com`.
- **Repairs confirmed in-plan:** B1 owned by C2 (L111-118: dep + config swap + `+layout.ts`
  prerender + `build/index.html` proof + `/404`->`build/404.html` strategy, `fallback`
  documented); B2 inbound links in C3 (136-138) / C4 (155-157) / C6 (202-204) + widened
  page-id union (109-111); M1 behavioral gates (79-84); M2 preview-origin 404 (141-145);
  M3 Basin placeholder + `page.route()` 200/500/abort (175-185); M4 consent-gate triple
  assertion (186-188); M5 OG manifest + 200-check (206-219); M6 A1-A5 table in Scope (30-44)
  + owner-actions launch-not-build-blocking (40-44); M7 playwright pre-flight + axe
  threshold 0 serious/critical + Lighthouse median-of-3 with score AND raw gates (85-86,
  211-216).
- **QA executability:** every QA names tool + steps + assertion (Playwright keyboard K1-K4,
  JS-disabled no-JS run, `vite preview` 404, disclosure non-empty DOM, `212%` grep over
  `src/` AND `build/`, blocked googleapis/gstatic zero-request, localStorage persistence
  across reload, reduced-motion video check); zero human-in-loop steps (L50, F3 L227);
  evidence `.omo/evidence/c1..c6` + `f1..f4` all present.
- **Fabrication guards:** MUST-NOT-HAVE intact (25-28), no invented metrics/names/GSTIN,
  disclosure labelling, `+212%` deletion with dual-tree grep proof, `{{BASIN_KEY}}`/
  `{{PLACEHOLDER}}` placeholders explicit.
- **Dependency order:** C1 -> C2 -> {C3 || C4} -> C5 -> C6 executable (L54-56); C3/C4 share
  no files; no C2->C5 forward-ref; A1-A5 surfaced, not silently defaulted.

**Verdict: APPROVE — 0 blockers.** Carried non-blocking nits remain N1 (build/404.html
on-disk assert) and N2 (inbound-card href asserts), both covered by F1's acceptance audit.
Plan is executable as written.

## 2026-09-28 — Oracle independent review (239 lines): REJECT (2 blockers)

Cold read of plan + draft; source re-verified independently (svelte.config.js = adapter-auto,
package.json adapter dep absent, only 3 route files — no +layout.ts/+error.svelte/404/privacy/
terms/services/work routes, TargoNav:3 union `'home'|'about'`, TargoFooter:55-56 dead spans,
TargoServices -> `#contact`, TargoWork:181 `+212%`, TargoContact has **zero `<form>` elements**
— all `type="button"`, `mailLink` starts `''` and is composed only inside `next()` at :254,
home `+page.svelte` footer outside `<main>` at :50, app.html CDN :7-9). External claims
verified: kit adapter-static docs (fallback:'404.html' documented for GitHub Pages),
sveltejs/kit#10734 **OPEN**, GoogleChrome/lighthouse#15482 (navigation mode emits no INP),
super-sitemap README (glob discovery + mandatory paramValues).

**BLOCKER 1 — `/services` + `/work` index routes required by C6 but owned by no todo**
(cite: plan 202-204 vs 133-139, 153-158, 207-208). C6 requires footer/nav
`<a href="/services">` + `<a href="/work">`, but C3/C4 create only `[slug]` routes and no todo
creates `src/routes/services/+page.*` or `src/routes/work/+page.*` — while C6's own OG manifest
(`static/og/{home,about,privacy,terms,services-<slug>,work-<slug>}.png`) omits both indexes, so
the plan simultaneously **requires and excludes** them. Either path fails: ship the links as
written = dead internal links on every page (no QA wave in the plan crawls internal links), or
build the indexes unplanned = OG manifest incomplete for those routes + ambiguous axe/Lighthouse
"every C1-C6 route" inventory. Metis B2 wrote the link line and verified its text, not the route
inventory behind it; Momus verified the same text. Repair (1 line each): C3 owns a `/services`
index and C4 a `/work` index (seeded from their content modules, added to the OG manifest), or
C6's hrefs revert to `/#services` + `/#work`.

**BLOCKER 2 — `INP <= 200ms` (213-215) is unmeasurable by the specified tool.** The gate is
bound to `npx lighthouse` median-of-3 navigation runs; Lighthouse navigation mode reports no INP
value (no interaction to measure — lighthouse#15482; LH 12.x LHR has no
`interaction-to-next-paint` key outside timespan/user-flow modes). An honest agent can never
evaluate the gate: fail forever, silently substitute TBT (fabricated gate evidence), or pass
vacuously on a missing key. Repair: assert `TBT <= 200ms` as the documented lab proxy, or
specify scripted-interaction measurement (Lighthouse timespan via puppeteer / web-vitals in
Playwright), or demote INP to a post-launch CrUX/PSI field gate outside F1-F4.

**MAJOR 1 — C3 failure 404 QA (141-145) is undecidable in both directions; upgrades carried
nit N1 to major.** `vite preview` vs real static-host 404 serving differs per an OPEN upstream
issue (kit#10734: preview serves .svelte-kit output / different error behavior than the built
site), so the run can false-PASS (preview renders an error page while `build/404.html` is
absent) or false-FAIL (artifact present, preview serves generic text) — and NO assertion in the
plan checks `build/404.html` on disk, which is the only host-independent proof of B1's 404 arm.
Repair: on-disk assert (`build/404.html` exists + contains C2 error markup) as the primary
check, preview request secondary.

**MAJOR 2 — C5 "no-JS path still composes mailto" (179-180) has no referent in source.**
`TargoContact.svelte` contains no `<form>` at all; the CTA at :556 renders `href=""` until
`next()` composes `mailLink`, so a JS-disabled render composes nothing. The working no-JS path
is only the static tel/mailto/WhatsApp links (:599-616, no prefilled body). As written the
acceptance false-fails or passes vacuously (assert any mailto link exists). Reword to
"JS-disabled render contains >=1 working contact path and no empty mailto href", or specify a
static pre-composed `mailto:` href.

**MINORS (non-blocking):** (1) super-sitemap discovers routes via `import.meta.glob`, so the
prerendered `/404` route would be listed in sitemap.xml unless `excludeRoutePatterns`d, and
`[slug]` routes need explicit `paramValues` (draft B3's "enumerates from `entries()`" is
inaccurate; C6's content-module references make correct wiring possible). (2) OG bootstrap
order implicit — PNGs must land in `static/og/` then `vite build` RE-run before the
og:image-200-under-preview check (217-219). (3) No internal link-integrity crawl in any QA wave
— this is what hid Blocker 1; add one crawl asserting zero internal 404s to F3.

**Independently verified sound:** B1 ownership chain in C2 (dep + swap + `+layout.ts` prerender
+ `build/index.html` proof; `/404` -> `build/404.html` valid at default trailingSlash;
`fallback: '404.html'` genuinely documented — lines 111-117 correct); static-only coherence
(no form actions anywhere, fetch POST + honeypot, MUST-NOT-HAVE intact 25-28); `entries()` +
root-layout prerender chain for both `[slug]` routes with adapter-static strict failing loudly
if absent; A1-A5 all surfaced with owners and `SITE_URL` marked UNCONFIRMED in-code — no silent
defaults; dependency order C1->C2->{C3||C4}->C5->C6 executable with no shared-write conflicts
(widened page-id union removes the site.ts collision; C6 runs after C2's footer move; C3/C4
write disjoint files).

**Verdict: REJECT — 2 blockers (202-204 unowned index routes contradicting 207-208; 213-215
unmeasurable INP gate), 2 majors, 3 minors.** One repair round inside existing todos suffices
(no new todos). Neither blocker appears in the Metis or Momus reports — do not defer to them.

## 2026-09-28 — Oracle REPAIR round (plan-only, no product code, no new todos)

Scope: `.omo/plans/professional-company-site.md` only. Still 6 todos + F1-F4; no human QA
steps reintroduced; MUST-NOT-HAVE untouched.

- **OB1 CLOSED (index routes):** C3 acceptance now owns `src/routes/services/+page.ts` +
  `+page.svelte` rendered from `services.ts`; C4 acceptance owns `src/routes/work/+page.ts` +
  `+page.svelte` rendered from `work.ts`; C6's site-wide `/services` + `/work` hrefs stated to
  resolve against those indexes (revert to `/#services`/`/#work` FORBIDDEN, not taken). C6 OG
  manifest extended to `static/og/{home,about,privacy,terms,services,work,services-<slug>,
  work-<slug>}.png`; axe scope explicitly includes the two indexes.
- **OB2 CLOSED (INP unmeasurable):** Scope + C6 acceptance gates reworded: Lighthouse
  navigation mode binds **TBT <= 200ms** as the lab proxy (cites lighthouse#15482); **INP
  <= 200ms kept as post-launch field gate via CrUX/RUM, outside F1-F4**. LCP <= 2.5s,
  CLS <= 0.1, JS <= 300KB gzip, and all four score gates unchanged. C6 happy QA names TBT
  explicitly so the executor does not reintroduce an INP lab assertion.
- **MAJOR 1 CLOSED (N1):** C3 failure QA restructured into primary = on-disk assert that
  `build/404.html` EXISTS and contains C2's `+error.svelte` markup (host-independent),
  secondary = `vite preview /services/nope` with the OPEN sveltejs/kit#10734 caveat stated
  (secondary alone can neither pass nor fail the gate).
- **MAJOR 2 CLOSED (C5 no-JS):** acceptance reworded to "JS-disabled render exposes >= 1
  working contact path and ZERO empty mailto href", with the source rationale inline (zero
  `<form>` elements; `mailLink` starts `''`, composed only inside `next()`), so the old
  "no-JS composes mailto" false-fail/vacuous-pass is gone.
- **N2 CLOSED:** C3 happy QA asserts each service card `href === /services/<slug>`; C4 happy
  QA asserts each work card `href === /work/<slug>` (both also visit the new index routes).
- **Minor 1 CLOSED (sitemap):** C6 requires `excludeRoutePatterns` matching `/404` (glob
  discovery would list it) + explicit `paramValues` per `services.ts`/`work.ts` slug for
  `[slug]` routes.
- **Minor 2 CLOSED (OG order):** C6 acceptance states bootstrap order = capture PNGs into
  `static/og/` first, re-run `vite build`, then og:image 200-check; happy QA notes the check
  runs after the re-build.
- **Minor 3 CLOSED (link crawl):** F3 now includes an internal link-integrity crawl over
  every internal `href`, asserting zero internal 404s (the check that would have caught OB1).

Verification of this repair: full re-read of the plan post-edit; all changes sit inside
todos 3/4/5/6 + F3 + Scope; todo count and F1-F4 row format unchanged.

## 2026-09-28 — Oracle RE-REVIEW of repaired plan (272 lines): APPROVE

Focused re-review only — both prior REJECT blockers re-verified against the repaired
plan, plus carried majors/minors. No re-litigation of Metis/Momus closed items; no
regression detected (6 todos 60-65, F1-F4 258-261, MUST-NOT-HAVE 26-29, no human QA
at 51/260, scaffold order intact).

- **OB1 CLOSED — index routes owned + linked + manifested:**
  - C3 owns `src/routes/services/+page.ts` + `+page.svelte` rendered from `services.ts`,
    explicitly "index route (Blocker 1)", backs C6's `<a href="/services">` (136-139).
  - C4 owns `src/routes/work/+page.ts` + `+page.svelte` from `work.ts`, same label,
    backs `<a href="/work">` (164-166).
  - C6 hrefs resolve *because* those indexes ship (221-225); no `/#services` revert taken.
  - OG manifest extended: `static/og/{home,about,privacy,terms,services,work,
    services-<slug>,work-<slug>}.png`, "(the two bare names are the C3/C4 index routes
    from Blocker 1)" (231-235).
  - Axe scope includes "the `/services` + `/work` indexes" (240); C3/C4 happy QA visit
    the indexes (144, 172). Prior require-vs-exclude contradiction resolved.
- **OB2 CLOSED — INP no longer bound to lighthouse nav runs:**
  - Scope: "TBT <= 200ms as the navigation-mode lab proxy for INP" + "INP <= 200ms held
    as a post-launch field gate via CrUX/RUM" (22-24).
  - C6 acceptance: cites GoogleChrome/lighthouse#15482; lab gate = TBT <= 200ms; INP <=
    200ms = post-launch FIELD gate "outside F1-F4" (243-245); LCP <= 2.5s, CLS <= 0.1,
    JS <= 300KB gzip unchanged (242, 245).
  - C6 happy QA names TBT only, "INP … not evaluated here" (247-249). All INP mentions
    (24, 243-244, 248) coherent; gate is honest under the specified tool.
- **N1 CLOSED:** C3 failure QA = ordered checks, primary = on-disk `build/404.html`
  EXISTS + contains C2's `+error.svelte` markup (host-independent); secondary =
  `vite preview /services/nope` with OPEN kit#10734 caveat, "the secondary run alone
  can neither pass nor fail the gate" (146-155).
- **N2 CLOSED:** C3 asserts each card `href === /services/<slug>` (144-146); C4 asserts
  `href === /work/<slug>` (172-174); both cite N2 rationale explicitly.
- **C5 no-JS CLOSED:** reworded to ">= 1 working contact path" + "ZERO empty `href`
  values on any mailto anchor", with inline source rationale (no `<form>` in
  TargoContact; `mailLink` starts `''`, composed only in `next()`; old claim "has no
  referent in source and must not be asserted") (194-199).
- **Minors CLOSED:** sitemap `excludeRoutePatterns` matching `/404` + explicit
  `paramValues` for every services/work slug (227-231); OG bootstrap order = capture
  PNGs FIRST -> RE-RUN `vite build` -> then 200-check (236-238, QA 250-251); F3 internal
  link-integrity crawl, zero internal 404s, named as "the check that would have caught
  the unowned index routes" (260).

**Verdict: APPROVE — 0 blockers, 0 majors; OB1/OB2 and all 5 carried items verified
closed with cites above.** Plan executable as written.

## 2026-09-28 — C1 execution (design-system consolidation to one light layer)

Baseline surprise: repo already satisfied most of C1 acceptance before this run —
`src/app.css` was 78 lines (not the plan's 183), `src/lib/targo.css` already 184 lines
with `.targo-prose` + focus-visible + reduced-motion-safe defaults, `+layout.svelte`
already imported `targo.css` + `@fontsource/*`, `app.html` had no CDN link,
`package.json` already carried `@fontsource/quantico` + `@fontsource/space-grotesk`.
Grep over repo: zero hits for `#05070b`, `#22d9ee`, `googleapis`/`gstatic`.
`.grain` kept (layout shell) + `.reveal` kept (reveal action
`src/lib/actions/reveal.ts`, reduced-motion aware); scrollbar / selection /
focus-visible all on the `#15bcdf` family.

Single C1-owned edit this run:
- `src/app.css` `html` rule: added `overflow-x: clip` (pairs with existing
  `body { overflow-x: hidden }`). Rationale: happy-QA assertion (a) FAILED on `/`
  at 390 + 1280 (`scrollWidth` 405 > 390) from `.targo-hero-media`/VIDEO bleed
  (L=-47 R=417) and `.targo-about-halo` (R=405) — both live in C2-C6-owned
  components that C1 MUST NOT touch; the html-level clip is the design-system
  guard inside C1 scope (`clip` chosen over `hidden` to avoid a new scroll
  container breaking sticky). Rebuilt + re-ran QA: all green.

Verification:
- `npm run check`: 1 ERROR pre-existing in C2-owned `TargoNav.svelte:3`
  (`''` not assignable to `'home'|'about'` — plan assigns this fix to C2; left
  untouched per MUST-NOT-DO) + 2 unused-CSS warnings on about page. No errors
  in any C1-owned file.
- `npm run build` (vite): exit 0, built in ~3s.
- Playwright QA (`npx playwright install chromium` pre-flight done; script
  `.omo/evidence/c1/c1-qa.mjs` under `vite preview` :4173): happy `/`+`/about`
  @390/1280 — (a) overflow_ok true x4, (b) fonts.check Quantico + Space Grotesk
  true x4, (c) body bg `rgb(255,255,255)` x4; failure (googleapis+gstatic blocked)
  — zero requests either host, fonts.check still true x2 → C1-QA PASS.
- Evidence `.omo/evidence/c1/`: happy-home-390.png, happy-home-1280.png,
  happy-about-390.png, happy-about-1280.png, failure-home.png, failure-about.png,
  c1-qa.mjs, preview.log.

Handoff to C2: shell work unblocked; TargoNav `active` type error is C2's to fix.
Home hero-media bleed remains masked at system level — C2/C3 may fix
`.targo-hero-media` intrinsic overflow at component level.

## 2026-09-28 — C2 execution (single accessible app shell + contact-truth)

Edits (C2 scope only; services/work content, form, SEO/OG untouched):
- `TargoHero.svelte`: deleted nav duplicate — header markup, mobile-menu block,
  nav/burger/mobile CSS, `menuOpen`/`isMobile` state + resize listener. Grep
  confirms zero `targo-nav|targo-links|targo-burger|menuOpen|isMobile` hits.
  Hero keeps headline/CTA/media + autoplay only.
- `src/lib/content/site.ts` (new): SITE_URL (A1 value, UNCONFIRMED in-code via
  `SITE_URL_UNCONFIRMED`), DOMAIN, phone/email/WhatsApp/location, widened
  PageId union ('home'|'about'|'services'|'work'|'contact'|'privacy'|'terms'|
  'not-found'|...), NAV_ITEMS, CONTACT_HREF, SOCIALS. Nav + footer consume it.
- `TargoNav.svelte` (rewrite): `active` default `'home'` typed PageId (fixes
  known :3 type error); sticky header + global scroll-margin-top; skip link
  (focus-visible reveal); Enter/Space toggle, Tab trap, Escape→close+refocus,
  outside-click close, scroll-lock; SSR-safe isMobile via matchMedia (desktop
  links always in DOM → CSS-driven visibility, no-JS safe, no desktop flash);
  aria-current on active link (desktop + mobile).
- `+layout.svelte`: renders TargoFooter (outside any main). Home + about pages
  dropped their direct TargoFooter; home gained TargoNav active="home";
  both mains are now `<main id="main" tabindex="-1">` (skip-link target).
  Footer Privacy/Terms stay spans (C6 owns links).
- `TargoNotFound.svelte` (new, shared): 404 body used by both `+error.svelte`
  and `/404/+page.svelte`. First attempt (404/+page.ts throwing error(404))
  failed prerender (`Error: 404 /404`, handleHttpError strict) — replaced with
  shared-component route so adapter-static emits build/404.html, exit 0.
  `fallback: '404.html'` documented as alternative in svelte.config.js comment
  (plan-required decision record, kept deliberately).
- `svelte.config.js`: adapter-auto → adapter-static; `@sveltejs/adapter-static`
  added to devDependencies. `+layout.ts` (new): `export const prerender = true`.
  NOTE for C6: `/404` route exists on disk — exclude from sitemap via
  excludeRoutePatterns (Oracle minor-1 already planned).

Verification:
- `npm run check`: 0 errors (2 pre-existing unused-CSS warnings about page,
  out of C2 scope, left untouched).
- `npm run build`: exit 0; build/index.html + build/404.html exist; 404.html
  contains error markup ("wandered off").
- Playwright QA (`.omo/evidence/c2/c2-qa.mjs`, vite preview :4173): C2-QA PASS
  10/10 — K1 skip focused+visible top=12; K2 focus lands in MAIN; K3 Enter/Space
  open + trap held; K4 Escape closes + focus returns + scroll unlocked;
  no-JS: 4 nav links + tel/mailto/WhatsApp resolve. Fix round: K1 needed
  post-Tab settle wait (0.15s reveal transition); K2 needed tabindex="-1" on
  mains (standard skip-target practice).
- Evidence `.omo/evidence/c2/`: c2-qa.mjs, preview.log, k1-desktop.png,
  k2-skip-target.png, k3-menu-open.png, k4-menu-closed.png, nojs-home.png.

Handoff to C3/C4: site.ts + widened PageId union + static prerender ready;
`/services` + `/work` indexes still to be created by C3/C4 (no dead-link work
done here).

## 2026-09-29 — C4 execution (evidence-bound case studies, fabrication removed)

State on entry: all C4 files already existed from a prior run and matched the
plan on re-verification, so this run made ZERO product-code edits (no diff to
review): `src/lib/content/work.ts` (6 entries, verbatim cat/title/d from
TargoWork cards, non-empty disclosure each, HRMS = concept), `/work` index
(`+page.ts` + `+page.svelte`, 6 cards with `<a href="/work/<slug>">` +
`data-disclosure`), `/work/[slug]` (`entries()` over all 6 slugs, unknown
slugs `error(404)`, disclosure in DOM via `data-disclosure`), TargoWork cards
all `<a href="/work/<slug>">`, lead copy corrected to "including concept work",
`+212%` badge deleted (not migrated). NOTE — path discrepancy, plan wins: task
section 2 names `src/lib/data/work.ts` but plan lines 163-164 (source of truth)
own `src/lib/content/work.ts`; no duplicate `data/` module created. TargoContact
CTA pattern confirmed by read (WHATSAPP_BASE, mailLink composed in next()).
C3/services, nav, contact, SEO untouched per MUST-NOT-DO.

Verification:
- `npm run check`: 0 errors (2 pre-existing unused-CSS warnings, about page,
  out of C4 scope).
- `npm run build` (vite): exit 0; build/work.html + all 6 slug HTMLs on disk.
- Happy QA (`.omo/evidence/c4/c4-qa.mjs` under `vite preview` :4173): C4-QA PASS
  29/29 — index 200, 6 index card hrefs exact, 6 disclosures non-empty
  (lengths 60,60,59,60,60,60), 6 home inbound hrefs exact (N2), home-no-212pct,
  6 slugs 200 + disclosure non-empty, hrms-concept labelled concept.
- Failure QA: grep `212%` over `src/` = 0 hits; over `build/` HTML = 0 hits.
- Evidence `.omo/evidence/c4/`: c4-qa.mjs, c4-qa-results.txt (29/29 PASS),
  grep-212-evidence.txt, happy-work-index.png, happy-work-hrms-concept.png,
  preview.log / preview.err.log.
- Session note: each bash call is a fresh PowerShell session (background jobs do
  not persist); preview + QA must run inside ONE bash call.

Handoff to C5/C6: C4 routes + disclosures done; `/work` index backs site-wide
`<a href="/work">`; OG manifest + axe scope (C6) must include the index + 6 slugs.



## 2026-09-29 � C3 execution (typed content layer + service detail routes)

No C3 code edits needed � all files already existed and verified verbatim against TargoServices seed (5x {n,t,d,tag} mirrored; deliverables/detail + team/process/faq marked UNCONFIRMED placeholders; zero invented metrics/testimonials). TargoServices cards already href=/services/<slug>; index + [slug] routes with entries() + error(404) present; detail uses existing .targo-* classes only. Untouched per MUST-NOT-DO: TargoWork/work files, nav shell, contact wizard, SEO.

Verification: npm run check 0 errors (2 pre-existing about-page CSS warnings, out of scope); vite build exit 0 with build/services.html + 5x build/services/<slug>.html + build/404.html (contains C2 'wandered off' markup). Playwright QA .omo/evidence/c3/c3-qa.mjs under vite preview :4173 � C3-QA PASS 29/29: primary on-disk 404.html assert; happy index 200 + 5/5 index links + 5/5 slugs 200 with h1 + 5/5 home-card href equality; secondary /services/nope 404 renders C2 page (kit#10734 caveat). Path note: brief said src/lib/data/services.ts but plan (source of truth) says src/lib/content/services.ts � kept content/. Evidence: .omo/evidence/c3/ (README.md, c3-qa.mjs, preview.log, 7 screenshots).

Handoff to C5/C6: SERVICES export + /services index + 5 prerendered slugs ready to consume.

## 2026-09-29 — C5 execution (hosted lead capture + consent-gated analytics)

State on entry: all C5 product code already existed from a prior run and matched
the plan on re-verification, so this run made ZERO product-code edits (no diff to
review): `src/lib/content/site.ts` carries `BASIN_ENDPOINT =
'https://usebasin.com/api/f/{{BASIN_KEY}}'` placeholder (A3 owner key) +
PLAUSIBLE_HOST/PLAUSIBLE_SCRIPT_SRC/CONSENT_STORAGE_KEY constants;
`TargoContact.svelte` POSTs via fetch to BASIN_ENDPOINT with mailto/WhatsApp
fallback intact on non-2xx/network failure, hidden honeypot (`tc-honeypot`,
bot-trap short-circuits to fake success), service `<select
data-testid="tc-service-select">` sourced from C3 SERVICES + 'Not sure yet',
zero `<form>` elements, `mailLink` starts `''` composed only inside `next()`;
`TargoConsent.svelte` (wired in `+layout.svelte`) default-deny banner persisted
in localStorage, Plausible script injected ONLY after Accept (or stored accept
on reload). No real Basin/Plausible accounts created. C3/C4/C6 files untouched.

Verification:
- `npm run check`: 0 errors (2 pre-existing about-page unused-CSS warnings, out
  of C5 scope, left untouched).
- `npm run build` (vite): exit 0.
- Playwright QA (`.omo/evidence/c5/c5-qa.mjs` under `vite preview` 127.0.0.1:4174;
  env note: vite preview binds IPv6 `localhost` by default so `127.0.0.1` refused
  until relaunched with `--host 127.0.0.1`; QA script fixes: `textarea#tc-q-*`
  selector — label span shares the id — and `waitForFunction` for the
  never-visible Plausible `<script>`): C5-QA PASS 21/21 — happy 200 (Basin hit,
  basinSent copy), failure 500 + abort (fallback copy, composed mailto incl.
  subject/body, wa.me fallback), consent (0 Plausible requests pre-consent, no
  script pre-consent, banner default-visible, script only after Accept,
  localStorage `accepted` survives reload + auto-loads, banner hidden),
  no-JS (tel=2 mailto=3 wa=2 working paths, 0 empty mailto hrefs).
- Evidence `.omo/evidence/c5/`: c5-qa.mjs, c5-qa-results.txt (21/21 PASS),
  happy-200.png, failure-500.png, failure-abort.png, consent-post-accept.png,
  nojs-contact.png, preview.log. (debug-step.* files predate this run, left
  untouched.)

Handoff to C6: lead capture + consent gate done; footer Privacy/Terms spans
still C6's to convert; `/privacy` + `/terms` routes + OG manifest + axe sweep
must include C5's contact surface.

## 2026-09-29 — F3 execution (browser QA sweep + link-integrity crawl): APPROVE

QA only — zero product-code edits (existing `build/` reused via `vite preview`
`127.0.0.1:4174`, no rebuild). 17 routes swept (`/`, `/about`, `/services`,
`/work`, `/privacy`, `/terms`, 5 service + 6 work slugs).

- Keyboard: skip link first Tab stop + visible (top=12) + Enter lands in
  `MAIN#main`; mobile toggle opens on Enter, Escape closes + focus returns.
  Trap: initial FAIL was a test-scope artifact (`#targo-mobile-menu` is a
  sibling AFTER `</header>`, TargoNav.svelte:133-136, so header-containment was
  the wrong oracle); re-probe scoped to `#targo-mobile-menu`+toggle held 20
  Tabs — trap genuinely works (TargoNav.svelte:42-54).
- Mobile 390px: 17/17 no overflow. no-JS: tel=2/mailto=3/wa=2, zero empty
  mailto, 6 nav links. Form: `route()` 500 + `abort()` both show fallback copy
  with composed mailto + wa.me intact. Reduced-motion: hero+about paused,
  hero toggle reads Play, both pause controls present.
- Crawl: 17 unique internal hrefs, each HTTP 200, zero internal 404s
  (the check that would have caught the unowned-index-routes class).
- Evidence `.omo/evidence/f3/`: f3-qa.mjs, f3-qa-results.txt (42/43, 1 artifact),
  f3-trap-reprobe.mjs + results (2/2), crawl-report.txt, 5 screenshots,
  f3-verdict.md.

Verdict: APPROVE — no failing assert; nothing to fix.

## 2026-09-29 — F4 scope-fidelity review: APPROVE (review only, zero product edits)

C1-C6 all delivered on disk (39 src files): C1 fontsource + light-only CSS, no
googleapis; C2 single nav + site.ts + adapter-static + +error/404; C3 4 content
modules + /services index + 5 slugs + card hrefs; C4 work.ts + /work index + 6
slugs + 212% grep-zero + disclosures; C5 {{BASIN_KEY}} placeholder + fetch/fallback
+ honeypot + C3 dropdown + default-deny Plausible gate; C6 /privacy + /terms
({{PLACEHOLDER}} only, zero invented GSTIN/CIN) + @graph JSON-LD + super-sitemap
v2 (excludeRoutePatterns + paramValues) + 17 OG PNGs + reduced-motion guard.
MUST-NOT-HAVE absent: no form actions/server files, no mdsvex/vitest, no
og?title, no invented metrics. A1/A3/A4/A5 surfaced with owner actions flagged
launch-blocking by design (A1 UNCONFIRMED in-code). No scope subset, no creep,
no delta. Evidence `.omo/evidence/f4/f4-scope-fidelity.md`.



## 2026-09-29 � F2 code-quality review: APPROVE

Review only; zero product-code edits. svelte-check 0 errors (2 pre-existing
about-page unused-CSS warnings, advisory); vite build exit 0 (4.32s,
adapter-static wrote build/). No nav duplication (hero 0 header/nav/menu
hits; targo-nav* only in TargoNav.svelte); only sanctioned .grain/.reveal
survive; no TODO/stub/lorem; all {{PLACEHOLDER}}/{{BASIN_KEY}}/UNCONFIRMED
sanctioned by design (A1/A3/A5); 212% zero hits; disclosures present, HRMS
concept-labelled. Evidence .omo/evidence/f2/F2-REPORT.md.

## 2026-09-29 � F1 plan-compliance audit: REJECT

Audit-only run, zero product files modified. Evidence .omo/evidence/f1/f1-checklist.md.

- C1/C2/C3/C4/C5 acceptance HOLD (per-todo QA evidence c1-c5 all PASS; spot-checks confirm).
- MUST-NOT-HAVE all absent (GSTIN/CIN hits are plan-compliant {{PLACEHOLDER_*}}; 212% zero in src+build; no og?title/actions/mdsvex/vitest/googleapis; poster-is-LCP PASS).
- Build artifacts complete: index.html + 404.html + services.html + work.html + 5 service slugs + 6 work slugs + 17 OG PNGs.
- C6 FAILS plan lines 239-251: .omo/evidence/c6/c6-qa-results.txt = C6-QA FAIL (21) � FAIL targets-24 on /, /services, /work/hrms-concept; FAIL axe color-contrast serious on all 18 routes (9-33 nodes); zero Lighthouse median-of-3 evidence anywhere (c6-qa.mjs has no lighthouse step; no lighthouse files under evidence/).
- C6-FAILURE-QA (reduced-motion) PASS 9/9; JSON-LD/sitemap/OG/inbound-links all PASS � failures are contrast + targets + missing Lighthouse only.
- Verdict: REJECT. Remand = fix contrast + target sizes, run Lighthouse median-of-3 with metric/JS-budget evidence, re-run axe to 0 serious/critical, then re-audit F1. A1/A3/A4/A5 remain launch-blocking by design.

## 2026-09-30 — C6 remand execution (F1-REJECT gaps closed)

Inherited state: an earlier session today (targo.css 13:47, TargoHero 13:58)
had already applied the contrast + target fixes and left c6-qa PASS (13:48)
plus raw lh-home-1/2/3.json (13:50), but with NO median evidence file, NO
notepad notes, and a build stale relative to the TargoHero edit. This run
verified, completed, and re-evidenced everything.

Verified pre-existing fixes (kept, all C6-owned, palette-local):
- `src/lib/targo.css`: `.t-accent`/`.targo-eyebrow`/`.targo-num`/`.targo-prose a`
  `-> #0a6f8c` (dark cyan, same hue family as #15bcdf); `.targo-btn-cyan`
  text `-> #12212e`; global `a,button { min-height/width: 24px }` + `footer a
  { display: inline-block }` for the 24px gate (inline exception preserved for
  in-text links). Footer/contact/consent labels already solid `text-[#3d4653]`
  (~9.5:1, PASS); the failing `/60` variants are gone from rendered routes.
- `TargoHero.svelte`: video `preload="metadata"` + idle-deferred `armAutoplay`
  (LCP poster gets uncontended bandwidth); toggle/CTA dark-on-cyan contrast.

New fix this run (LCP gate was still FAIL):
- Lighthouse baseline median LCP = 2884ms (> 2500ms gate); FCP 2048ms, no
  opportunities > 200ms, observed LCP only ~400ms. Root cause = poster bytes
  (hero 86.6KB @1920w + about 56.1KB @1440w both eager on `/`, displayed far
  smaller). Recompressed palette-neutral (same pixels, fewer bytes):
  hero-poster.jpg -> 1280x720 q72 = 38.1KB, about-poster.jpg -> 960x960 q70 =
  28.1KB. Originals backed up to `.omo/evidence/c6/orig-posters/`. Same
  filenames -> zero markup changes, zero C1-C5 files touched.

Verification (all under `vite preview` 127.0.0.1:4173 over fresh `vite build`):
- `npm run check`: 0 errors (2 pre-existing about-page unused-CSS warnings).
- `npm run build`: exit 0. Preview + QA run inside ONE bash call (PS jobs do
  not survive across calls; `npx`/`npm` must launch via `cmd /c`, not
  Start-Process directly).
- `.omo/evidence/c6/c6-qa-results.txt` = C6-QA PASS, exit 0, zero FAIL lines
  (targets-24 PASS all 18 routes; axe 0 serious/critical all 18 routes, in fact
  0 violations of any level).
- Lighthouse mobile x3 post-fix: Perf 0.96 / A11y 1.00 / BP 1.00 / SEO 0.92 /
  LCP median 2418ms / CLS 0.0031 / TBT 0ms / JS 64.3KB — ALL GATES PASS.
  Evidence `.omo/evidence/c6/c6-lighthouse-median.txt` (raw + median + JS
  budget); raw `lh-home-{1,2,3}.json`.
- Env notes: no Python on box (used node for JSON extraction); system Chrome
  at `C:\Program Files\Google\Chrome\Application\chrome.exe` via CHROME_PATH;
  chrome-launcher EPERM tmp-cleanup noise on Windows is harmless (JSONs still
  written). No git repo (`D:\pixel` not versioned) so no commit.

Handoff to F1 re-audit: all three remand items (targets, contrast/axe,
Lighthouse evidence) now PASS on the current build. A1/A3/A4/A5 still
launch-blocking by design.

## 2026-09-30 — F1 plan-compliance RE-AUDIT: APPROVE

Audit-only run, zero product files modified. Evidence `.omo/evidence/f1/f1-checklist.md` (overwritten with re-audit).

- C1/C2/C3/C4/C5 acceptance HOLD (per-todo QA evidence c1-c5 all PASS, tails re-verified; F3 trap re-probe 2/2 + crawl 17/17 200 confirm C2/C3).
- C6 remand CLOSED on the current build: `c6-qa-results.txt` = 136 PASS / 0 FAIL, tail C6-QA PASS — targets-24 PASS all 18 routes (line 239), axe 0 violations any level all 18 routes (line 240, cross-checked `c6-axe-results.txt` = 0 FAIL/serious/critical), Lighthouse medians re-verified against raw `lh-home-{1,2,3}.json` via node (Perf 0.96 / A11y 1.00 / BP 1.00 / SEO 0.92 / LCP 2418ms / CLS 0.0031 / TBT 0ms / JS 64.3KB — all gates lines 241-246 PASS; happy QA lines 247-251 met). `contrast-detail.txt` noted as stale pre-fix snapshot, superseded.
- MUST-NOT-HAVE all absent (grep: og?title/googleapis/212%/mdsvex/vitest/use:enhance = 0; GSTIN/CIN only as `{{PLACEHOLDER_*}}`).
- Build artifacts complete: index.html + 404.html + 17 OG PNGs re-verified on disk.
- Verdict: APPROVE. F1-F4 all APPROVE → ORCHESTRATION COMPLETE eligible. A1/A3/A4/A5 remain launch-blocking by design.

## 2026-09-30 — L6-proofread review sheet (read-only + one evidence file)

Sheet: `.omo/evidence/review-sheet.md` — per-route verbatim H1 + lead with source file + line refs, plus contact-truth appendix (site.ts) and placeholder census. Route count: **17 entries** (brief header says 18 but the itemised list sums to 17: / + /about + /services + 5 service slugs + /work + 6 work slugs + /privacy + /terms; /404 and +error excluded per brief — nothing skipped, nothing merged). Slugs from content modules (services.ts 5, work.ts 6). Flags: work labelling PASS (all 6 disclosures present, HRMS concept-labelled), work metrics PASS (zero numeric claims), contact contradictions NONE (about wa.me matches site.ts); advisories = /about stats band (25+/15+/100%) + 5 UNCONFIRMED service detail fields. Placeholders: 21 occurrences / 17 unique legal tokens across privacy (9) + terms (12), report-only. Spot-check re-grepped H1 lines — all match character-for-character. Zero product characters changed (no src/ or static/ writes; no git repo so no diff to show).

## 2026-09-30 — L6 stale-artifact hygiene: deleted `.omo/evidence/c6/contrast-detail.txt`

- Pre-delete Read: grep confirmed line 1 `RULE color-contrast impact=serious nodes=33` (stale pre-fix axe snapshot, superseded by `c6-qa-results.txt` C6-QA PASS, 0 violations all 18 routes). Direct Read returned binary-detect; identity confirmed via grep instead.
- Deleted ONLY `.omo/evidence/c6/contrast-detail.txt` via `Remove-Item -LiteralPath` (single path, no wildcards). Nothing under `src/`, `static/`, or any other `.omo/evidence/` file touched.
- Proof: `Test-Path` = False; `.omo/evidence/c6/` glob lists 34 files with no `contrast-detail.txt` (only similarly-named `debug-contrast.mjs` remains, untouched); `src/` grep for `contrast-detail` = 0 hits. Two historical text mentions remain by design (plan-repair.md:589 + `f1-checklist.md:54`, both describing the file as stale/superseded) — left untouched per append-only / no-other-evidence-file rules. Full repo-wide grep timed out (large build artifacts), so proof is scoped: `.omo` + `src/` greps + dir listing.
- `npm run check`: 0 errors, 2 pre-existing about-page unused-CSS warnings (`.leader-photo-empty`, out of scope, left untouched). No rebuild (evidence-only deletion). No commit (no git remote workflow).

## 2026-09-30 — Owner-ordered removal of video pause/play button UI (C6 manual-pause layer)

- Scope: `src/lib/components/TargoHero.svelte` + `src/lib/components/TargoAbout.svelte` ONLY. `src/routes/about/+page.svelte` has zero pause/play markup (grep-confirmed) — untouched. `src/lib/targo.ts` `armAutoplay` reduced-motion guard fully intact — untouched. No C6 evidence/plan files touched. No commit.
- Removed per file: `<button class="targo-video-toggle">` markup (+ `data-testid` hero/about-video-toggle, aria-pressed/label, onclick), `videoPaused` state, `toggleVideo()` handler, `.targo-video-toggle` CSS block; dropped now-unused `prefersReducedMotion` import (both files) + unused `prefetchVideo` import (Hero only; legitimate use in `TargoNav.svelte` kept). Video elements, srcs, posters, preload, `armAutoplay` wiring unchanged.
- Proof: `src/lib/components` grep `videoPaused|toggleVideo|targo-video-toggle|hero-video-toggle|about-video-toggle` = 0; `vite build` exit 0 (built 5.07s, `build/` written); `npm run check` 0 errors (same 2 pre-existing warnings); Playwright under `vite preview` (npm.cmd-started, port 4173): `/` pause/play buttons 0 with 2 videos (`/videos/hero.mp4`, `/videos/about.mp4`), `/about` pause/play buttons 0 with 0 videos (no video section on that route — correct).

