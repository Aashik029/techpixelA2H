# professional-company-site - Draft

<!-- ulw-plan-request-state
{
  "phase": "plan-repair",
  "intent": "unclear",
  "review_required": true,
  "classification": "architecture",
  "plan_path": ".omo/plans/professional-company-site.md",
  "pending_action": "repair plan from Metis NO-GO report, then momus+oracle+metis re-review before execution",
  "status": "approved-via-start-work-bootstrap; metis-review-NO-GO-2-blockers"
}
-->

## Request

User intent, verbatim progression:
1. "i need like professional company website what can we do ? tell me"
2. "make a detailed plan for this to implement the tasks"

Origin site: `D:\pixel` (Tech Pixel A2H agency). SvelteKit 2 + Svelte 5 + Vite 6 + Tailwind 4 +
TypeScript strict. Routes: `/` and `/about` only.

## Classification

**Architecture** — 5+ new modules (services detail routes, case-study routes, contact backend,
legal pages, structured data, analytics, accessibility/perf hardening). Long-term surface.

## Routing

**intent: unclear** — the outcome "professional company website" is a quality bar, not a spec.
The assistant previously invented an A/B/C phased slice; the user declined to pick and asked for a
plan instead. Per `intent-unclear.md`, reduced subsets are never a valid scope, so the plan covers
the ENTIRE credibility + lead-gen + polish request. Do not interrogate; adopt announced defaults.

**review_required: true** — mandatory automatic dual high-accuracy review (momus + independent
oracle) after the plan file is written.

## Deviations from skill (environment-forced)

- `scripts/scaffold-plan.mjs` CANNOT be run: this session has no shell/execute tool available
  (`bash` is absent from the tool surface; only file/agent tools exist). Draft and plan artifacts
  are therefore hand-built to match the template the script emits, header-for-header and in order.
- No subagent was dispatched with `category=`, per delegation discipline.

## Prior session state (already implemented, NOT to be re-planned)

A previous cleanup pass already landed and must be treated as the BASELINE:
- Phone unified to `+91 95977 96186` / `tel:+919597796186` / `wa.me/919597796186`
  (TargoContact.svelte, TargoFooter.svelte).
- Contact wizard step 4: trim + >=10 digit validation, `required`/`pattern`/`inputmode`, and a
  clipboard copy-email fallback for `techpixela2h@gmail.com`.
- Dead code deleted: 12 legacy dark-system components, `+page.dark-backup.svelte.bak`,
  root `index.html`, 11 preview/mcp logs. Build passes.
- SEO baseline: canonical/robots/theme-color/OG/Twitter on `/` and `/about`;
  `static/robots.txt` + `static/sitemap.xml` created. Domain ASSUMED `https://techpixela2h.com`
  (unconfirmed with user).
- Video perf: hero `preload="metadata"`, about `preload="none"` + IntersectionObserver-gated
  `armAutoplay`, hero poster `<link rel="preload" as="image" fetchpriority="high">`.
- Trust: footer socials reduced to WhatsApp + Email (Instagram/LinkedIn REMOVED, handles unknown);
  CTO placeholder card removed; Ajay A (Founder & CEO) card retained.
- Build passes: `✓ built in 13.29s`, adapter-auto.
- Known pre-existing issues NOT yet fixed: `TargoNav.svelte:3` type error
  (`active = ''`); unused-CSS warning in `about/+page.svelte` (`.leader-photo-empty`).

## Components ledger (TOPOLOGY LOCK — every todo traces here)

Six components. Every todo in the plan maps to exactly one of these, and nothing in the plan
falls outside them. Dependency order is **C1 → C2 → {C3 ∥ C4} → C5 → C6**.

### C1 — Design-system consolidation (make `targo.css` the only design layer)
`src/app.css` (183 lines) is still the legacy DARK system and is imported by `+layout.svelte`, so
the near-black `@theme` tokens, `html`/`body` background `#05070b`, the dark `::-webkit-scrollbar`
(#05070b track / #1c2635 thumb / #22d9ee hover), `::selection`, the `#22d9ee` focus outline and
~20 dead classes all sit underneath a light design. `targo.css` (130 lines) holds the real light
tokens but is only imported per-page.
**Work:** strip the dead dark tokens/classes out of `app.css` down to what is actually referenced
(`.grain`, `.reveal` + the reduced-motion block), re-point the root layout at `targo.css`, recolor
scrollbar/selection/focus to the light palette, add the missing primitives the new routes need
(`.targo-prose`, focus-visible ring, reduced-motion-safe defaults). Self-host Quantico +
Space Grotesk via `@fontsource/*` to delete the render-blocking Google-Fonts CDN request in
`src/app.html` (third-party request = DPDP/GDPR exposure and a LCP tax).
**Why first:** every new route inherits this layer. Nothing is safe to build on top of a
near-black root.

### C2 — One app shell (single nav, layout-owned footer, error page, contact-truth module)
`TargoHero.svelte` carries a **full duplicate of the nav** (markup lines 44-90, ~140 lines of
duplicated `.targo-*` nav CSS lines 164-302, its own `menuOpen`/`isMobile` state at lines 6-7 and
its own `onMount` mq listener) alongside `TargoNav.svelte`. `TargoNav.svelte:3` is also a live
`svelte-check` type error (`active = ''` is not assignable to `'home' | 'about'`, so it can never
match). The mobile menu has no Escape / focus trap / outside-click / scroll lock, `isMobile`
defaults to `false` so desktop markup is SSR'd then swapped (flash + broken no-JS), the header is
`position: relative` not sticky, and there is **no skip link anywhere in the repo**. The footer
lives page-level (outside `<main>`) and its "Privacy Policy" / "Terms of Service" are dead
`<span>`s pretending to be links.
**Work:** delete the hero's nav copy + its nav CSS and make `TargoNav.svelte` the single nav; fix
the `active` prop default; sticky header with `scroll-margin-top` for WCAG 2.4.11 focus-not-obscured;
skip link; complete keyboard mobile menu; `isMobile` SSR-safe; move `TargoFooter` into
`+layout.svelte`; add `src/routes/+error.svelte`; add `src/lib/content/site.ts` as the single
source of phone / email / WhatsApp / domain / nav / socials so the phone-mismatch class of bug
cannot recur.
**Why second:** a duplicated nav is a live inconsistency bug, and every new route needs a shell.

### C3 — Typed content layer + service detail routes
`TargoServices.svelte` renders 5 services (`01 Web Development` / `02 AI Automation` /
`03 Poster Design` / `04 Content Creation` / `05 Digital Marketing`) as inline `{n,t,d,tag}`
objects, every card pointing at `#contact`. There is no detail page for anything.
**Work:** `src/lib/content/services.ts` (typed, seeded from the existing 5 verbatim), plus
`team.ts`, `process.ts`, `faq.ts`; `src/routes/services/[slug]/+page.ts` exporting `entries()`
(dynamic prerender REQUIRES `entries()` — crawling is unreliable) and a `+page.svelte` built
entirely from existing `.targo-*` classes.
**Why:** depth is what separates a company site from a landing page, and `services.ts` + `site.ts`
become the inputs that C5 (form service dropdown) and C6 (sitemap + JSON-LD) enumerate.

### C4 — Case studies, evidence-bound (`/work/[slug]`)
`TargoWork.svelte` shows 6 anonymized cards with pure-CSS mockups, no links, no detail pages — and
its lead copy claims *"A sample of websites, designs, and campaigns we've shipped for real
businesses."* while at least one entry (HRMS) self-describes as a *"concept interface"* and one
card visual carries a **hardcoded `+212%` badge (line 181) that is a fabricated metric already
live on the site.**
**Work:** `src/lib/content/work.ts` + `src/routes/work/[slug]/` with `entries()`; every entry
carries a `disclosure` label and zero invented numbers; **delete the `+212%` badge**; correct the
lead copy so concept work is labelled as concept work.
**MUST-NOT-HAVE (hard constraint):** do NOT invent client names, metrics, testimonials, or
industry results. The credibility gap is closed by *removing* the fabrication and labelling what
is real — never by manufacturing case studies.
**Why:** the single largest credibility liability on the site is a claims-vs-evidence mismatch.

### C5 — Real lead capture + consent-gated analytics
The primary CTA today is a `mailto:` composed at `TargoContact.svelte:253-254` with a
clipboard/WhatsApp fallback (~line 605-616). A "professional company website" whose only intake is
a mail client loses the leads who never open mail.
**DECISION — stay fully static (`adapter-static`) and post to a hosted endpoint (Basin).**
Grounded: SvelteKit form `actions` **cannot be prerendered** and are incompatible with
`adapter-static` — so it is server-adapter OR hosted form, never both. Hosted wins here: zero
infra, $0 tier, multi-step support, Turnstile/hCaptcha/reCAPTCHA, webhook retries.
**Work:** Basin endpoint constant in `site.ts`; the 4-step wizard POSTs via `fetch` and **falls
back to the existing mailto/WhatsApp path on network failure or non-2xx** (progressive
enhancement — the no-JS path stays alive); hidden honeypot field; map the step-1 service select to
`site.ts` services. Analytics: **Plausible Cloud, EU region, cookieless, loaded only after
opt-in consent**, default-deny banner persisted in `localStorage`.
**Why analytics needs the gate:** India's DPDP Act 2023 + 2025 Draft Rules are consent-centric with
no broad legitimate-interest basis; the Board stood up 13 Nov 2025 and full enforcement lands
~13 May 2027. A cookieless EU-hosted tool behind a default-deny gate is the defensible default;
this is recorded as needing counsel sign-off, not asserted as legal advice.

### C6 — Trust, SEO and measured quality gates
- **Legal:** real `/privacy` + `/terms` routes replacing the footer dead spans. India-appropriate
  (DPDP Act 2023 referenced), all entity facts clearly marked as owner-supplied placeholders.
  MUST-NOT invent a GSTIN, CIN, or registered address.
- **SEO:** JSON-LD `@graph` (`ProfessionalService`/`Organization` + `WebSite` + `WebPage` +
  `BreadcrumbList`, typed via `schema-dts`) on every route; `super-sitemap` v2 replacing the
  hand-written `static/sitemap.xml` so `/services/[slug]` + `/work/[slug]` enumerate from
  `entries()`; one static 1200x630 OG PNG per route. **MUST-NOT ship query-param-dynamic
  `/og?title=` OG images on `adapter-static` — scrapers 404.**
- **A11y:** `prefers-reduced-motion` guard inside `targo.ts::armAutoplay` (confirmed: none
  today — the 800ms retry interval and four document-level gesture listeners fire regardless of
  the motion setting) plus a real pause/play control on the hero and about videos; targets
  >= 24x24px (2.5.8); focus-not-obscured; keyboard-complete mobile menu; axe sweep.
- **Perf gates (mobile, median of 3):** Lighthouse Perf >= 0.90, A11y >= 0.95, Best Practices
  >= 0.90, SEO >= 0.90 — asserted on the RAW metrics too (LCP <= 2.5s, INP <= 200ms,
  CLS <= 0.1), because a green score can hide a failing metric. JS <= 300KB gzip. The poster,
  never `<video>`, must be the LCP element.

## Open-assumptions ledger

Format: assumption | adopted default | rationale | reversible? | owner input needed?

### A. Owner decisions — SURFACED in the brief (not silently defaulted)

| # | Assumption | Adopted default | Reversible? |
|---|---|---|---|
| A1 | **Live domain** | `https://techpixela2h.com` (carried over from the previous session's SEO pass, still unconfirmed) | No — it is baked into canonical, sitemap, JSON-LD and every OG tag. Public config surface = owner-decision. |
| A2 | **Static host** | any static host (Netlify / Vercel / Cloudflare Pages / nginx) | Partly — but choosing it forces the `adapter-auto` -> `adapter-static` swap, so it must be named now. |
| A3 | **Form backend account** | Basin (usebasin.com) free tier — 50 submissions/mo, multi-step, spam-protected | Yes — one constant in `site.ts`. **The user must create the account and paste the form key**; I cannot. |
| A4 | **Analytics vendor + spend** | Plausible Cloud EU, ~$9/mo, cookieless behind a consent gate | Yes — self-hosted Umami (MIT) is the $0 alternative, but that is a server to run. Money + external account = owner-decision. |
| A5 | **Legal entity facts** | privacy + terms written as India-appropriate templates (DPDP Act 2023) with every unverifiable fact left as an explicit `{{PLACEHOLDER}}` | Yes, and deliberately so — I will NOT invent a GSTIN, CIN, or registered address. User must supply them before launch. |

### B. Reversible internals — ADOPTED and announced, not asked

| # | Assumption | Adopted default | Rationale |
|---|---|---|---|
| B1 | Content format | typed `.ts` modules, **not** mdsvex | 5 services / 6 case studies do not justify a content pipeline, and mdsvex + Svelte 5 runes is thinly documented in 2026. Also makes `entries()` trivially typed. |
| B2 | Prerendering | explicit `entries()` in each `[slug]` `+page.ts` | Official guidance: dynamic prerender is unreliable via crawling alone. |
| B3 | Sitemap | `super-sitemap` v2 (`super-sitemap/sveltekit`) | Enumerates from `entries()` instead of a hand-rolled glob that will silently rot when a route is added. |
| B4 | OG images | hand-made static 1200x630 PNGs per route now; build-time generation (`sveltekit-og`/satori) deferred | Fastest to launch, best brand control, and scraper-safe on `adapter-static`. |
| B5 | Fonts | self-host via `@fontsource/quantico` + `@fontsource/space-grotesk` | Removes the render-blocking third-party CDN request in `app.html` — helps LCP and removes a GDPR/DPDP third-party dependency. |
| B6 | Test strategy | **QA-driven, no unit-test framework introduced**: `svelte-check` (must reach 0 errors) + `vite build` + Playwright (already a devDep at `^1.63.0`) for Lighthouse, axe, keyboard and form-submit verification | The repo has zero tests and no runner; Playwright is already installed so real browser QA costs nothing new. Introducing Vitest is a separate project, not part of "make the site professional". |
| B7 | Form delivery on failure | POST to hosted endpoint, fall back to the **existing** mailto/WhatsApp path | Zero regression risk to a path that already works; the no-JS case keeps functioning. |
| B8 | `adapter-auto` -> `adapter-static` | swap to `adapter-static` + `export const prerender = true` on all marketing routes | Required by the hosted-form decision in C5; `ssr` stays ON for all marketing routes. |

### C. Known research conflicts — recorded, not papered over

Formspree tier pricing (sources disagree: $10 vs $15 entry, 1k vs 200 subs); Basin free tier (50
vs 100/mo) and Web3Forms "250/mo vs unlimited" — neither is the chosen vendor, so the conflict does
not block the plan, but the exact Basin figure is marked "~50/mo, verify at signup" in the plan
rather than asserted. Umami event caps and SendGrid free-tier permanence are the same shape of
unverified vendor claim. Cookieless-analytics legitimate-interest is a **vendor claim, not case
law** — the plan therefore uses a default-deny consent gate instead of relying on it, and records
that counsel sign-off is still owed. mdsvex/Svelte-5 and Satori's flex-only CSS subset are avoided
by construction via B1 and B4.

## Approval gate

- **status: awaiting-approval**
- **approach:** consolidate the design system to one light layer (C1), collapse the duplicated nav
  into a single accessible shell (C2), add real depth pages from a typed content layer (C3) and
  evidence-bound case studies (C4), replace the `mailto:`-only intake with a hosted form plus
  consent-gated cookieless analytics (C5), then land the legal/SEO/a11y/perf surface and hold
  hard numeric gates (C6). Static site throughout; no server adapter, no database.
- **credentials to carry into the plan:** the C4 no-fabrication hard constraint; the static-vs-
  actions incompatibility; the DPDP default-deny consent posture; the never-`<video>`-as-LCP rule.
- **next action:** present the brief to the user and WAIT for an explicit okay. Approval authorizes
  writing `.omo/plans/professional-company-site.md` ONLY. After that: Metis gap analysis, then the
  automatic dual high-accuracy review (momus + independent oracle) because `review_required: true`.
- **never:** implementation. Execution is a separate worker session the user starts.

## Review status

- **Delegated dual review: BLOCKED (environment outage).** Metis gap analysis, momus
  high-accuracy review, and independent oracle review were each dispatched in parallel;
  all three `task()` calls failed with API connection errors (`ses_f173bc20…`,
  `ses_f173bc21…`, `ses_f173bc27…` run-continuation records). No verdicts fabricated —
  these three reviews remain PENDING and must run before handoff once delegation recovers.
- **Orchestrator self-check: GO (no blockers).** Verified cold against the authoritative
  source reads: C1 traces to `src/app.css` (near-black root under a light design);
  C2 traces to the hero duplicate nav (`TargoHero.svelte` 44-90 + 164-302) and the
  `TargoNav.svelte:3` type error; C3 seeds verbatim from `TargoServices.svelte`'s 5
  services; C4 carries the no-fabrication hard constraint (`+212%` badge line 181,
  HRMS = concept work); C5 honors the adapter-static-vs-actions incompatibility with
  mailto/WhatsApp fallback preserved; C6 guards `armAutoplay` (no reduced-motion check
  today) and holds numeric gates (LCP <= 2.5s, INP <= 200ms, CLS <= 0.1; Lighthouse
  Perf >= 0.90, A11y >= 0.95, BP >= 0.90, SEO >= 0.90; JS <= 300KB gzip). Structure:
  template headers verbatim and in order, column-zero `- [ ] N.` / `- [ ] F<n>.`
  rows, 6 todos + 4 wave items, each todo with References + acceptance + happy+failure
  QA with evidence path + Commit line. Owner decisions A1-A5 surfaced, B1-B8 adopted
  and announced, research conflicts recorded. Dependency order C1 -> C2 -> {C3 || C4}
  -> C5 -> C6 is executable; C3||C4 share no files.
- **Next:** run the three pending reviews on recovery, then dispatch execution waves.
- **Metis gap review (recovered API, ses_f1736ea4): NO-GO — 2 blockers + 7 majors + 7 minors.**
  BLOCKER 1: adapter-static/prerender swap (B8) owned by no todo — repair by assigning to
  C2 (add dep, swap config, add +layout.ts prerender, prove with build/index.html).
  BLOCKER 2: /services + /work slugs orphaned (zero inbound links) and C6 references
  footer-span wiring its acceptance drops — repair with inbound-link lines in C3/C4/C6
  acceptance. Majors: M1 C1 visual-regression unmeasurable -> behavioral assertions;
  M2 C3 404 QA origin + adapter-404 explicit; M3 C5 Basin placeholder + route-interception
  QA; M4 C5 consent-gate zero-requests failure test; M5 C6 OG manifest + recipe;
  M6 plan omits A1-A5 -> add Owner-decisions section inside ## Scope + SITE_URL in C2;
  M7 declare lighthouse/axe tooling + playwright chromium pre-flight in C1. Minors:
  m1 drop C2->C5 forward-ref; m2 cite TargoContact by symbol not drifted lines;
  m3 fonts.check + zero-googleapis assertions; m4 C2 keyboard named assertions;
  m5 axe scope/threshold; m6 rename F3 to browser QA + evidence f1..f4;
  m7 C4 grep + disclosure-presence script. All repairs land inside existing todos.
