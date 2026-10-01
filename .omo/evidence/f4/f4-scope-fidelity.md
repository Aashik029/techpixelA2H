# F4 Scope-Fidelity Review — VERDICT: APPROVE

Date: 2026-09-29. Review only — zero product files modified.
Plan: `.omo/plans/professional-company-site.md` Scope lines 13-44.
Draft: `.omo/drafts/professional-company-site.md` Request + Classification + TOPOLOGY LOCK C1-C6 + ledger A/B/C.

## 1. Whole request delivered (no invented subset)

Request verbatim (draft L18): "i need like professional company website" → "make a detailed plan".
Classification: Architecture. Routing: intent UNCLEAR → full-scope default (no reduced A/B/C slice).
All six topology components delivered on disk under `src/`:

| C | Plan owns | On-disk proof |
|---|---|---|
| C1 light system | app.css light-only, targo.css root import, fontsource, no CDN | `+layout.svelte` imports `@fontsource/quantico` + `space-grotesk`; `app.html` no googleapis (grep 0); `app.css` + `targo.css` carry `prefers-reduced-motion` blocks; c1 evidence present |
| C2 shell | single nav, layout footer, +error, /404, site.ts, adapter-static | `TargoNav.svelte` single nav (hero duplicate deleted); `site.ts` exists; `+error.svelte` + `404/+page.svelte` + `TargoNotFound.svelte`; `svelte.config.js` = `adapter-static`; `+layout.ts` prerender=true |
| C3 services | services.ts/team.ts/process.ts/faq.ts + /services index + [slug] entries() + card hrefs | all 4 content modules exist; `services/+page.ts` + `+page.svelte`, `[slug]/+page.ts` + `+page.svelte`; `TargoServices` cards → `/services/<slug>` (c3 QA 29/29) |
| C4 work | work.ts + /work index + [slug] entries() + 212% deleted + disclosure | `work.ts` 6 entries w/ disclosure; `/work` index + `[slug]` routes; grep `212%` = 0 in `src/`; lead copy "including concept work" (c4 QA 29/29) |
| C5 leads | BASIN_ENDPOINT placeholder, fetch POST + mailto/WhatsApp fallback, honeypot, C3 dropdown, Plausible-behind-consent | `site.ts:29` `{{BASIN_KEY}}` placeholder; `TargoContact` fetch + fallback + `tc-honeypot` + service select from C3, zero `<form>`; `TargoConsent.svelte` default-deny + localStorage (c5 QA 21/21) |
| C6 trust | /privacy + /terms placeholders, JSON-LD @graph every route, super-sitemap v2 + excludeRoutePatterns + paramValues, 17 OG PNGs, reduced-motion guard + pause/play, axe + Lighthouse gates | `/privacy` + `/terms` routes exist; `JsonLd.svelte` `@graph` + ProfessionalService; `sitemap.xml/+server.ts` excludeRoutePatterns + paramValues; `static/og/` = 17 PNGs (home,about,privacy,terms,services,work + 5 svc + 6 work); `targo.ts` reduced-motion guard + hero/about pause/play; `@axe-core/playwright` + `super-sitemap` in package.json; c6 QA scripts + evidence present |

Index routes (Oracle OB1): `/services` + `/work` indexes exist and back C6's site-wide hrefs
(footer `/services`, `/work`, `/privacy`, `/terms` all `<a>` — verified). OG manifest includes
both bare index names. No dead internal links by construction; link-crawl is F3's runtime proof.

## 2. No scope creep (no unrequested additions)

MUST-NOT-HAVE (plan L26-29) all absent from `src/`:
- `212%` → 0 hits (src). Fabricated metric deleted, not replaced.
- GSTIN/CIN/address → ONLY as `{{PLACEHOLDER_*}}` in privacy/terms (A5 by design). Zero invented facts.
- `/og?title=` → 0 hits. OG = 17 static PNGs only.
- SvelteKit form `actions` → 0 hits (`export const actions`, `+page.server` absent). Hosted Basin POST only.
- mdsvex / Vitest → 0 hits; typed `.ts` modules + Playwright QA per B1/B6.
- Google-Fonts CDN → 0 hits; self-hosted fontsource.
- `<video>` as LCP → poster-driven `armAutoplay`, no native autoplay attr (hero/about comments cite C6).
No extra routes, vendors, or frameworks beyond plan. `site.ts` constants (BASIN/PLAUSIBLE/CONSENT)
are plan-owned C5 surface, not creep.

## 3. A1-A5 surfaced with owners (not silently defaulted)

- A1 live domain → `SITE_URL='https://techpixela2h.com'` + `SITE_URL_UNCONFIRMED=true`, marked UNCONFIRMED in-code. Owner action: confirm domain. LAUNCH-BLOCKING by design.
- A2 static host → `adapter-static` + prerender; any static host. Named, not blocking.
- A3 Basin account → `BASIN_ENDPOINT='https://usebasin.com/api/f/{{BASIN_KEY}}'` explicit placeholder. Owner action: create account + paste key. LAUNCH-BLOCKING by design.
- A4 Plausible EU ~$9/mo → constants + default-deny consent gate; Umami alternative recorded. Owner action: approve/fund or pick Umami. LAUNCH-BLOCKING by design.
- A5 legal facts → `{{PLACEHOLDER_*}}` throughout privacy/terms (registered address, CIN/GSTIN, grievance, jurisdiction). Owner action: supply facts. LAUNCH-BLOCKING by design.
Owner-actions paragraph (plan L41-45) correctly scopes these as blocking launch, not build.

## 4. Scope delta

None. APPROVE with zero deltas. No reduced subset taken; no additions beyond plan;
UNCLEAR-routing full scope honored; triple review (Metis GO / Momus APPROVE / Oracle APPROVE)
repairs (OB1/OB2, N1/N2, minors) all verified present in code.

## 5. Method (read-only)

`glob src/**` (39 files), `read site.ts`, greps: `212%|GSTIN|CIN|og?title|vitest|mdsvex|googleapis`
→ only placeholder GSTIN/CIN; `excludeRoutePatterns|paramValues|armAutoplay|BASIN|honeypot|
adapter-static|prerender|fontsource|@graph|Plausible|CONSENT|PLACEHOLDER` → all present;
`export const actions|vitest|mdsvex|+page.server` in src → 0; footer hrefs → all four real links;
`static/og/*.png` → 17 files. No file written outside `.omo/evidence/f4/`.
