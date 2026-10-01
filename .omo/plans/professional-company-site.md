# professional-company-site - Work Plan

## TL;DR (For humans)

Turn the Tech Pixel A2H landing page (`D:\pixel`, SvelteKit 2 + Svelte 5 + Tailwind 4) into a
professional company website: one light design system (C1), one accessible app shell with a
single nav (C2), typed content powering service detail pages (C3) and evidence-bound case
studies (C4), a real hosted lead-capture form plus consent-gated analytics (C5), and the
legal/SEO/a11y/perf surface with hard numeric gates (C6). Fully static throughout
(`adapter-static`); no server, no database. Source of truth:
`.omo/drafts/professional-company-site.md`.

## Scope

**IN:** C1 design-system consolidation; C2 single nav + layout footer + `+error.svelte` +
`site.ts` contact-truth module; C3 `services.ts`/`team.ts`/`process.ts`/`faq.ts` +
`/services/[slug]` with `entries()`; C4 `work.ts` + `/work/[slug]` with `entries()`,
`+212%` badge deletion, concept-work labelling; C5 Basin-hosted form POST with
mailto/WhatsApp fallback + honeypot + Plausible-behind-consent-gate; C6 `/privacy` +
`/terms` (placeholders, no invented GSTIN/CIN/address), JSON-LD `@graph` on every route,
`super-sitemap` v2, static 1200x630 OG PNGs, reduced-motion guard + video pause/play,
axe sweep, Lighthouse gates (Perf >= 0.90, A11y >= 0.95, BP >= 0.90, SEO >= 0.90;
LCP <= 2.5s, TBT <= 200ms as the navigation-mode lab proxy for INP, CLS <= 0.1;
JS <= 300KB gzip), with INP <= 200ms held as a post-launch field gate via CrUX/RUM.

**MUST-NOT-HAVE:** no fabricated client names/metrics/testimonials; no query-param-dynamic
`/og?title=` images; no SvelteKit form `actions` (incompatible with `adapter-static`);
no mdsvex pipeline; no Vitest introduction; no invented GSTIN/CIN/registered address;
no Google-Fonts CDN (self-host via fontsource); no `<video>` as LCP element.

### Owner decisions — A1-A5 (surfaced, not silently defaulted)

| # | Assumption | Adopted default | Reversible? |
|---|---|---|---|
| A1 | **Live domain** | `https://techpixela2h.com` (carried over from the previous session's SEO pass, still unconfirmed) | No — it is baked into canonical, sitemap, JSON-LD and every OG tag. Public config surface = owner-decision. |
| A2 | **Static host** | any static host (Netlify / Vercel / Cloudflare Pages / nginx) | Partly — but choosing it forces the `adapter-auto` -> `adapter-static` swap, so it must be named now. |
| A3 | **Form backend account** | Basin (usebasin.com) free tier — 50 submissions/mo, multi-step, spam-protected | Yes — one constant in `site.ts`. **The user must create the account and paste the form key**; I cannot. |
| A4 | **Analytics vendor + spend** | Plausible Cloud EU, ~$9/mo, cookieless behind a consent gate | Yes — self-hosted Umami (MIT) is the $0 alternative, but that is a server to run. Money + external account = owner-decision. |
| A5 | **Legal entity facts** | privacy + terms written as India-appropriate templates (DPDP Act 2023) with every unverifiable fact left as an explicit `{{PLACEHOLDER}}` | Yes, and deliberately so — I will NOT invent a GSTIN, CIN, or registered address. User must supply them before launch. |

**Owner actions owed (not blocking build, blocking launch):** A1 is **unconfirmed** — C2 ships
`SITE_URL` from it and marks it unconfirmed in-code; A3 the owner must create the Basin account
and replace the `{{BASIN_KEY}}` placeholder in `site.ts`; A4 the owner must approve/fund the
Plausible EU subscription (or pick the Umami alternative). A5 stays `{{PLACEHOLDER}}` until the
owner supplies entity facts.

## Verification strategy

Per todo: `svelte-check` (0 errors) + `vite build` exit 0 + Playwright browser QA
(happy + failure paths, evidence under `.omo/evidence/<todo>/`). Final wave F1-F4 gates
launch. No human-intervention verification anywhere.

## Execution strategy

Wave order follows the topology lock: C1 -> C2 -> {C3 || C4} -> C5 -> C6. C3 and C4 run
in parallel (both read C2's shell, neither writes the other's files). C5 needs C3's
services list for the dropdown; C6 enumerates C3/C4 routes for sitemap + JSON-LD.

## Todos

- [x] 1. C1 design-system consolidation to one light layer
- [x] 2. C2 single accessible app shell with contact-truth module
- [x] 3. C3 typed content layer plus service detail routes
- [x] 4. C4 evidence-bound case studies with fabrication removed
- [x] 5. C5 hosted lead capture plus consent-gated analytics
- [x] 6. C6 legal, SEO, a11y and measured performance gates

### 1. C1 design-system consolidation to one light layer

**Component trace:** C1.
**References:** `src/app.css` (183 lines, legacy dark `@theme`, `#05070b` body, dark
scrollbar/selection/`#22d9ee` focus, dead classes; keep `.grain`, `.reveal`,
reduced-motion block) | `src/lib/targo.css` (130 lines, real light tokens) |
`src/routes/+layout.svelte` (imports `app.css`, wraps children in `.grain`) |
`src/app.html` (render-blocking Google-Fonts CDN link).
**Acceptance:** `app.css` reduced to referenced-only rules recolored to the light palette
(scrollbar, selection, focus-visible ring = `#15bcdf` family); root layout imports
`targo.css`; `.targo-prose` + focus-visible + reduced-motion-safe defaults added;
Quantico + Space Grotesk self-hosted via `@fontsource/*`, CDN link deleted from
`app.html`; `svelte-check` 0 errors; `vite build` exit 0; **behavioral** style assertions on
`/` and `/about` replace subjective "visual regression" (unmeasurable): (a) no horizontal
overflow at 390px and 1280px (`document.scrollingElement.scrollWidth <= window.innerWidth`),
(b) fonts self-hosted — `document.fonts.check('700 16px Quantico')` and
`document.fonts.check('400 16px "Space Grotesk"')` both true, (c) computed body background
resolves to the light token (never legacy `#05070b`).
**QA (agent-executed):** pre-flight — `npx playwright install chromium` (one-time, gates all
browser QA in this plan); happy — `vite build` plus the three assertions above at 390px/1280px
on `/` and `/about`, screenshots kept as supplementary evidence in `.omo/evidence/c1/`;
failure — block `fonts.googleapis.com` and `fonts.gstatic.com`, assert ZERO requests to either
host while `document.fonts.check` stays true (self-host + zero-googleapis proof), evidence
same dir.
**Commit:** `feat(design): consolidate to single light targo system (C1)`.

### 2. C2 single accessible app shell with contact-truth module

**Component trace:** C2 (depends on C1).
**References:** `src/lib/components/TargoHero.svelte` lines 44-90 + 164-302 + state
lines 6-7 (duplicate nav to DELETE) | `src/lib/components/TargoNav.svelte` (201 lines;
line-3 `active` type error; no Escape/trap/outside-click/scroll-lock; `isMobile`
SSR flash; non-sticky header; no skip link repo-wide) |
`src/lib/components/TargoFooter.svelte` lines 55-56 (dead Privacy/Terms spans; made real
links in C6) | `src/routes/+page.svelte` (footer outside `<main>`) | `src/routes/+layout.svelte` |
`svelte.config.js` (currently `adapter-auto`) + `package.json` (adapter dep to add) +
`src/routes/+layout.ts` (to create, `prerender = true`).
**Acceptance:** hero nav copy deleted; `TargoNav` the single nav with fixed `active`
default, sticky header + `scroll-margin-top`, skip link, keyboard-complete mobile menu
(Escape/trap/outside-click/scroll-lock), SSR-safe `isMobile`; footer moved into
`+layout.svelte`; `src/routes/+error.svelte` added; `src/lib/content/site.ts` owns
`SITE_URL` (from Owner decision A1, marked **UNCONFIRMED** in-code), phone/email/
WhatsApp/domain/nav/socials and both nav + footer consume it, nav page-id union widened
(`'home' | 'about' | 'services' | 'work' | 'contact' | ...`) so C3/C4 register their
pages without another type edit; **adapter-static swap (static-only mandate, B8):**
`@sveltejs/adapter-static` added as a dependency, swapped into `svelte.config.js` in place
of `adapter-auto`, `src/routes/+layout.ts` created exporting `export const prerender = true`
(`ssr` stays on), proof = `vite build` exits 0 AND `build/index.html` exists; **404
strategy:** adapter-static serves no automatic 404, so prerender a `/404` route backed by
`+error.svelte` so `build/404.html` is emitted (host serves it for unknown paths; the
adapter `fallback: '404.html'` option is the documented alternative) and C3's failure QA
asserts it; `svelte-check` 0 errors.
**QA (agent-executed):** happy — keyboard-only pass with four named assertions: **K1**
first Tab focuses the skip link and it becomes visible; **K2** Enter on the skip link moves
focus into `#main`; **K3** mobile-menu button opens on Enter/Space and Tab is trapped inside
the open menu; **K4** Escape closes the menu and returns focus to the toggle button, evidence
`.omo/evidence/c2/`; failure — disable JS, confirm nav links and contact paths still resolve
(no-JS fallback), evidence same dir.
**Commit:** `feat(shell): single accessible nav, layout footer, error page (C2)`.

### 3. C3 typed content layer plus service detail routes

**Component trace:** C3 (depends on C2).
**References:** `src/lib/components/TargoServices.svelte` (5 services verbatim seed:
Web Development / AI Automation / Poster Design / Content Creation / Digital
Marketing, all `-> #contact`) | C2 `site.ts` | C1 `.targo-*` classes.
**Acceptance:** `src/lib/content/services.ts` (+`team.ts`, `process.ts`, `faq.ts`)
typed and seeded verbatim; `src/routes/services/[slug]/+page.ts` exports `entries()`;
**index route (Blocker 1):** `src/routes/services/+page.ts` + `+page.svelte` render the
service list from `services.ts` so the `/services` route itself exists and backs C6's
site-wide `<a href="/services">` (no dead internal link, no orphan index); detail
`+page.svelte` built only from existing `.targo-*` classes; every service reachable at
`/services/<slug>` prerendered; **inbound links (no orphan slugs):** the service cards in
`TargoServices.svelte` (today all `-> #contact`) become `<a href="/services/<slug>">` so
each detail page has at least one in-site link; `svelte-check` 0 errors; `vite build`
exit 0.
**QA (agent-executed):** happy — visit the `/services` index plus all 5 slugs, assert
each service card's `href` equals exactly `/services/<slug>` (N2: direct-URL visits
alone never prove the inbound links work), screenshot, evidence `.omo/evidence/c3/`;
failure — 404 QA runs against the PRODUCTION artifact, never the dev server, as two
ordered checks: **primary (host-independent)** — assert `build/404.html` EXISTS on disk
and contains C2's `+error.svelte` markup (the only emission proof that cannot be faked
by preview-side error rendering); **secondary** — start `vite preview` over `build/`,
request `/services/nope`, assert the C2 error page renders through C2's explicit 404
strategy (`build/404.html`, or the adapter `fallback` if that option was chosen; a blank
dev-server 404 is a FAIL). Preview-vs-host 404 fidelity differs per the OPEN
sveltejs/kit#10734, so the secondary run alone can neither pass nor fail the gate,
evidence same dir.
**Commit:** `feat(content): typed content layer and service pages (C3)`.

### 4. C4 evidence-bound case studies with fabrication removed

**Component trace:** C4 (depends on C2; parallel with C3).
**References:** `src/lib/components/TargoWork.svelte` (6 cards verbatim; HRMS =
concept; line-181 `+212%` badge; lead copy claims real-business shipments).
**Acceptance:** `src/lib/content/work.ts` + `src/routes/work/[slug]/` with `entries()`;
**index route (Blocker 1):** `src/routes/work/+page.ts` + `+page.svelte` render the
case-study list from `work.ts` so the `/work` route itself exists and backs C6's
site-wide `<a href="/work">` (no dead internal link, no orphan index); every entry
carries a `disclosure` label; `+212%` badge DELETED; lead copy corrected so
concept work is labelled concept; zero invented names/metrics/testimonials; **inbound
links (no orphan slugs):** the work cards in `TargoWork.svelte` become
`<a href="/work/<slug>">` so each case study has at least one in-site link;
`svelte-check` 0 errors; `vite build` exit 0.
**QA (agent-executed):** happy — visit the `/work` index and all work slugs, assert
each work card's `href` equals exactly `/work/<slug>` (N2: direct-URL visits alone
never prove the inbound links work), and run a disclosure-presence check
(each `/work/<slug>` DOM contains a non-empty disclosure label, zero-length = FAIL),
evidence `.omo/evidence/c4/`; failure — grep BOTH the source tree (`src/`) and the built
output (`build/`) for `212%` and confirm zero matches in each (fabrication-removal proof),
evidence same dir.
**Commit:** `feat(work): evidence-bound case studies, fabrication removed (C4)`.

### 5. C5 hosted lead capture plus consent-gated analytics

**Component trace:** C5 (depends on C2 + C3's services list).
**References:** `src/lib/components/TargoContact.svelte` cited **by symbol, not by line
numbers** (they drift): wizard state `step` + `TOTAL`, `next()` / `back()` / `validate()` /
`startOver()`, mailto composed inside `next()`, `sent` success state, `copyEmail()`,
`WHATSAPP_BASE` (wa.me) — current mailto + clipboard/WhatsApp fallback stays as the
fallback | C2 `site.ts` (gains the `BASIN_ENDPOINT` constant) | C3 services (step-1
dropdown source).
**Acceptance:** `site.ts` carries
`BASIN_ENDPOINT = 'https://usebasin.com/api/f/{{BASIN_KEY}}'` as an explicit placeholder
(owner pastes the real form key, A3); wizard POSTs via `fetch` to that endpoint and
falls back to the existing mailto/WhatsApp path on network failure or non-2xx;
hidden honeypot field; service dropdown sourced from C3; **no-JS contact path** — with
JS disabled the render still exposes >= 1 working contact path (the static
tel/mailto/WhatsApp links in the component) and ZERO empty `href` values on any mailto
anchor (`TargoContact.svelte` contains no `<form>` at all and `mailLink` starts `''`,
composed only inside `next()`, so "no-JS composes a mailto" has no referent in source
and must not be asserted); Plausible (EU, cookieless) loads ONLY after opt-in consent,
default-deny banner persisted in `localStorage`; `svelte-check` 0 errors.
**QA (agent-executed):** happy — Playwright `page.route()` intercepts the Basin
placeholder URL returning 200, submit, confirm success state, evidence
`.omo/evidence/c5/`; failure — same interception stubbed to 500 AND to `route.abort()`
(two runs), confirm the mailto/WhatsApp fallback appears with the composed message
intact; consent-gate failure run — assert ZERO requests to any Plausible host before
consent, the Plausible `<script>` present only after Accept, and the `localStorage`
consent flag still set after a page reload (persistence), evidence same dir.
**Commit:** `feat(leads): hosted form with fallback plus gated analytics (C5)`.

### 6. C6 legal, SEO, a11y and measured performance gates

**Component trace:** C6 (depends on C3 + C4 + C5; enumerates their routes).
**References:** `src/lib/targo.ts::armAutoplay` (no reduced-motion check; 800ms
interval; 4 document gesture listeners) | hero/about `<video>` (no pause control) |
`src/routes/+page.svelte` head (baseline meta to extend, no JSON-LD) |
`static/sitemap.xml` (hand-written, to replace) | footer dead Privacy/Terms spans
(becoming real links here, where the routes are created) | `src/lib/content/*.ts`
(sitemap + JSON-LD inputs).
**Acceptance:** `/privacy` + `/terms` real routes (India-appropriate, DPDP Act 2023
referenced, unverifiable facts as explicit `{{PLACEHOLDER}}`, no invented
GSTIN/CIN/address); **inbound links:** the footer's dead `<span>`s become
`<a href="/privacy">` / `<a href="/terms">` and the footer/nav expose site-wide links to
`/services` and `/work` (so C3/C4 slugs are reachable from every page, not orphaned;
both hrefs resolve because C3/C4 ship the `/services` and `/work` index routes that
back them);
JSON-LD `@graph` (ProfessionalService/Organization + WebSite +
WebPage + BreadcrumbList via `schema-dts`) on every route; `super-sitemap` v2
replacing the hand sitemap, wired with `excludeRoutePatterns` matching `/404` (its
`import.meta.glob` discovery would otherwise list the prerendered error route) and
explicit `paramValues` enumerating every `services.ts` slug and `work.ts` slug for the
`[slug]` routes (glob discovery cannot infer them); **OG manifest:** one static
1200x630 PNG per route listed in
a manifest — `static/og/{home,about,privacy,terms,services,work,services-<slug>,work-<slug>}.png`
(the two bare names are the C3/C4 index routes from Blocker 1) —
rendered at 1200x630 via Playwright screenshots of the live routes (query-param `og?title=`
images remain forbidden); **OG bootstrap order:** capture PNGs into `static/og/` FIRST,
then RE-RUN `vite build` so the built routes embed the final `og:image` URLs, and only
then run the og:image 200-check below; reduced-motion guard in `armAutoplay` + pause/play on hero+about
videos; targets >= 24x24; axe sweep via `@axe-core/playwright` (new devDep) scoped to every
C1-C6 route (including the `/services` + `/work` indexes) with threshold = **zero `serious`/`critical` violations**; mobile
median-of-3 Lighthouse (`npx lighthouse`, 3 runs, take the median): Perf >= 0.90,
A11y >= 0.95, BP >= 0.90, SEO >= 0.90 AND LCP <= 2.5s, CLS <= 0.1;
**INP gate:** Lighthouse navigation mode emits no INP value (GoogleChrome/lighthouse#15482),
so the lab gate is **TBT <= 200ms** as its documented proxy, while **INP <= 200ms stands as
the post-launch FIELD gate** measured via CrUX / RUM outside F1-F4; JS <= 300KB gzip;
poster (never `<video>`) is LCP.
**QA (agent-executed):** happy — Lighthouse median-of-3 (TBT <= 200ms lab gate; INP is
the post-launch CrUX/RUM field gate, not evaluated here) + `@axe-core/playwright` report
per route (0 serious/critical), plus OG check: every manifest entry exists and each
route's `og:image` URL returns HTTP 200 under `vite preview` over `build/`, run AFTER the
OG bootstrap re-build so the checked build embeds the final PNGs, evidence
`.omo/evidence/c6/`; failure — enable reduced-motion, confirm videos do not autoplay
and pause controls are present, evidence same dir.
**Commit:** `feat(trust): legal, SEO, a11y and perf gates (C6)`.

## Final verification wave

- [x] F1. Plan-compliance audit — every C1-C6 acceptance holds, every MUST-NOT-HAVE absent; evidence `.omo/evidence/f1/`
- [x] F2. Code-quality review — no dead code, no duplication, check/build clean; evidence `.omo/evidence/f2/`
- [x] F3. Browser QA (agent-executed — NOT human "manual" QA) — keyboard, mobile, no-JS, form failure, reduced-motion passes PLUS an internal link-integrity crawl (collect every internal `href` across all routes and assert each resolves HTTP 200 — zero internal 404s, the check that would have caught the unowned index routes); evidence `.omo/evidence/f3/`
- [x] F4. Scope-fidelity review — whole request delivered, no invented subset, no scope creep; evidence `.omo/evidence/f4/`

## Commit strategy

One commit per todo (messages above); F-wave fixes amend their todo's commit. No
squash across components — history must read C1..C6.

## Success criteria

`svelte-check` 0 errors; `vite build` exit 0; all C1-C6 acceptance + QA evidence
present under `.omo/evidence/`; F1-F4 all APPROVE; static export deployable from any
static host with the Basin key + Plausible snippet configured.
