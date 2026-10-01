# L6 Proofreading Review Sheet — verbatim H1 + lead per route

> READ-ONLY aid. All quotations are copy-pasted verbatim from source — never paraphrased, never "improved".
> Generated 2026-09-30. Route files enumerated via `src/routes/**/*.svelte` (11 files; route pages = 9 files, incl. 2 dynamic `[slug]` routes).
> Slug lists derived from content modules (NOT memory): 5 slugs from `src/lib/content/services.ts` (`SERVICES`), 6 slugs from `src/lib/content/work.ts` (`WORK`).
> Excluded per brief: `src/routes/404/+page.svelte` and `src/routes/+error.svelte`.

## Route-count note (please read first)

The brief header says "18 routes", but the itemised list sums to **17** distinct routes: `/` (1) + `/about` (1) + `/services` (1) + 5 service slugs + `/work` (1) + 6 work slugs + `/privacy` (1) + `/terms` (1) = **17**.
This sheet covers **all 17 itemised routes — zero skipped, zero merged**. If an 18th route exists, it is not in the itemised list; the human should name it before sign-off.

---

## 1. `/` — home

- **Source:** `src/routes/+page.svelte` (shell composing sections) + H1 lives in `src/lib/components/TargoHero.svelte:90-97`
- **H1 (verbatim, staircase spans render as one headline):**
  > "Building / The / Platform / For / Your / Growth"
  > Source spans (`TargoHero.svelte:91-96`): `Building` · `The` · `Platform` · `For` · `Your` · `Growth` — rendered reading: "Building The Platform For Your Growth"
- **Lead / intro (verbatim):** The hero carries **no `.targo-lead` paragraph** — only the H1 + a `Get started` CTA (`TargoHero.svelte:99-103`). The closest page-level intro copy is the meta description (`src/routes/+page.svelte:16-18`, also used for OG + JsonLd):
  > "Tech Pixel A2H helps small businesses get online, get automated, and get customers — web development, AI automation, design, content and marketing from one team in India."
- **Reviewer notes:** No client-engagement claims in hero. No metric-looking numbers in hero. No contact details in hero to cross-check.

## 2. `/about`

- **Source:** `src/routes/about/+page.svelte:68` (H1), `src/routes/about/+page.svelte:69-75` (lead)
- **H1 (verbatim):**
  > "The team behind the work."
  > Markup: `The team<br />behind <span class="t-accent">the work.</span>`
- **Lead / intro (verbatim):**
  > "Tech Pixel A2H started with a simple observation: small businesses don’t need bigger agencies — they need someone who listens, builds fast, and stays around after launch. We handle design, development, automation, and marketing under one roof, so you never have to coordinate between five different freelancers again. No jargon. No over-promising. Just work that makes a difference."
- **Reviewer notes:**
  - ADVISORY (not a work page, but metric-looking): stats band (`about/+page.svelte:6-11`) shows `25+` Projects delivered / `15+` Happy clients / `5` Core services / `100%` Support after launch — human to confirm each figure is evidenced before launch.
  - Contact check: WhatsApp CTA (`about/+page.svelte:135`) uses `https://wa.me/919597796186?text=…` — matches contact truth (`919597796186`). No contradiction.
  - No concept-work-as-client-engagement sentence on this route.

## 3. `/services` (index)

- **Source:** `src/routes/services/+page.svelte:48` (H1), `src/routes/services/+page.svelte:49-51` (lead)
- **H1 (verbatim):**
  > "Our Services"
  > Markup: `Our<br /><span class="t-accent">Services</span>`
- **Lead / intro (verbatim):**
  > "Five core services, one team. Pick what you need now — add more as you grow."
- **Reviewer notes:** No engagement claims, no metrics, no contact details in H1/lead. Card descriptions on this page render verbatim from `services.ts` (see entries 4–8).

## 4. `/services/web-development`

- **Source:** template `src/routes/services/[slug]/+page.svelte:39-40` (`<h1>{data.entry.title}</h1>` + `<p class="targo-lead">{data.entry.description}</p>`); values from `src/lib/content/services.ts:26-31`
- **H1 (verbatim):**
  > "Web Development"
- **Lead / intro (verbatim):**
  > "Business websites, portfolios, landing pages and e-commerce stores. Fast, mobile-first, and built to convert visitors into customers."
- **Reviewer notes:** No engagement claim, no metric, no contact detail. `detail`/`deliverables` fields in `services.ts:38-39` are marked UNCONFIRMED placeholders — human to confirm scope wording before launch.

## 5. `/services/ai-automation`

- **Source:** template `src/routes/services/[slug]/+page.svelte:39-40`; values from `src/lib/content/services.ts:42-46`
- **H1 (verbatim):**
  > "AI Automation"
- **Lead / intro (verbatim):**
  > "WhatsApp bots, lead qualification, follow-up sequences and business reports — automation that runs your routine work while you sleep."
- **Reviewer notes:** No engagement claim, no metric, no contact detail. `detail` at `services.ts:54-55` is an UNCONFIRMED placeholder.

## 6. `/services/poster-design`

- **Source:** template `src/routes/services/[slug]/+page.svelte:39-40`; values from `src/lib/content/services.ts:58-62`
- **H1 (verbatim):**
  > "Poster Design"
- **Lead / intro (verbatim):**
  > "Festival creatives, offer posters, event flyers and brand kits that stop the scroll."
- **Reviewer notes:** No engagement claim, no metric, no contact detail. `detail` at `services.ts:70-71` is an UNCONFIRMED placeholder.

## 7. `/services/content-creation`

- **Source:** template `src/routes/services/[slug]/+page.svelte:39-40`; values from `src/lib/content/services.ts:74-78`
- **H1 (verbatim):**
  > "Content Creation"
- **Lead / intro (verbatim):**
  > "Product videos, reels, business profiles and presentation decks that tell your story."
- **Reviewer notes:** No engagement claim, no metric, no contact detail. `detail` at `services.ts:86-87` is an UNCONFIRMED placeholder.

## 8. `/services/digital-marketing`

- **Source:** template `src/routes/services/[slug]/+page.svelte:39-40`; values from `src/lib/content/services.ts:90-94`
- **H1 (verbatim):**
  > "Digital Marketing"
- **Lead / intro (verbatim):**
  > "SEO, social media and WhatsApp campaigns that bring a steady flow of new customers."
- **Reviewer notes:** No engagement claim, no metric, no contact detail. `detail` at `services.ts:97-98` is an UNCONFIRMED placeholder.

## 9. `/work` (index)

- **Source:** `src/routes/work/+page.svelte:48` (H1), `src/routes/work/+page.svelte:49-51` (lead)
- **H1 (verbatim):**
  > "Our Work"
  > Markup: `Our<br /><span class="t-accent">Work</span>`
- **Lead / intro (verbatim):**
  > "A sample of our design and build capabilities, including concept work."
- **Reviewer notes:** Honestly labelled — "including concept work" disclosed at index level. No metrics. No contact details. Each card carries its own `data-disclosure` line (see entries 10–15).

## 10. `/work/local-store-online`

- **Source:** template `src/routes/work/[slug]/+page.svelte:39-40` (H1 = `entry.title`, lead = `entry.disclosure`); values from `src/lib/content/work.ts:19-28`
- **H1 (verbatim):**
  > "Local Store, Online Overnight"
- **Lead / intro — rendered `data-disclosure` paragraph (verbatim):**
  > "Sample work — illustrative example, not a client engagement."
- **Summary / body (verbatim, for context — meta + first body para):**
  > "A complete online store for a neighborhood retailer — product catalog, WhatsApp ordering, and festival offer banners."
- **Reviewer notes:** PASS — concept/sample status disclosed, not presented as a client engagement. No metric-looking numbers. No contact details.

## 11. `/work/team-workspace`

- **Source:** template `src/routes/work/[slug]/+page.svelte:39-40`; values from `src/lib/content/work.ts:31-41`
- **H1 (verbatim):**
  > "One Workspace for the Whole Team"
- **Lead / intro — rendered `data-disclosure` paragraph (verbatim):**
  > "Sample work — illustrative example, not a client engagement."
- **Summary / body (verbatim):**
  > "A shared dashboard where a growing business tracks projects, clients, and daily tasks — all in one place."
- **Reviewer notes:** PASS — disclosed as sample work. No metrics. No contact details.

## 12. `/work/hrms-concept`

- **Source:** template `src/routes/work/[slug]/+page.svelte:39-40`; values from `src/lib/content/work.ts:43-53`
- **H1 (verbatim):**
  > "HR Without the Spreadsheets"
- **Lead / intro — rendered `data-disclosure` paragraph (verbatim):**
  > "Concept work — interface concept, not shipped for a client."
- **Summary / body (verbatim):**
  > "Attendance, leave requests, and employee records in a clean visual system — concept interface for modern HR teams."
  > Second body para: "This is a concept exploration, not a shipped client engagement."
- **Reviewer notes:** PASS — explicitly labelled concept work, twice (disclosure + body). No metrics. No contact details.

## 13. `/work/festival-posters`

- **Source:** template `src/routes/work/[slug]/+page.svelte:39-40`; values from `src/lib/content/work.ts:55-65`
- **H1 (verbatim):**
  > "Festival Season, Fully Designed"
- **Lead / intro — rendered `data-disclosure` paragraph (verbatim):**
  > "Sample work — illustrative example, not a client engagement."
- **Summary / body (verbatim):**
  > "A complete set of offer posters, social creatives, and banners for a retail brand’s festival campaign."
- **Reviewer notes:** PASS — disclosed as sample work. No metrics. No contact details.

## 14. `/work/seo-blog-system`

- **Source:** template `src/routes/work/[slug]/+page.svelte:39-40`; values from `src/lib/content/work.ts:67-77`
- **H1 (verbatim):**
  > "Content That Brings Customers"
- **Lead / intro — rendered `data-disclosure` paragraph (verbatim):**
  > "Sample work — illustrative example, not a client engagement."
- **Summary / body (verbatim):**
  > "A search-optimized blog and content engine that turns everyday questions into a steady stream of new enquiries."
- **Reviewer notes:** PASS — disclosed as sample work. No metrics. No contact details.

## 15. `/work/growth-campaign`

- **Source:** template `src/routes/work/[slug]/+page.svelte:39-40`; values from `src/lib/content/work.ts:79-89`
- **H1 (verbatim):**
  > "From Invisible to Booked Out"
- **Lead / intro — rendered `data-disclosure` paragraph (verbatim):**
  > "Sample work — illustrative example, not a client engagement."
- **Summary / body (verbatim):**
  > "Social media creatives, WhatsApp follow-ups, and review engine — a full local growth loop for a service business."
- **Reviewer notes:** PASS — disclosed as sample work. "Booked Out" is a headline aspiration, not a numeric metric claim; no numbers on the page. No contact details.

## 16. `/privacy`

- **Source:** `src/routes/privacy/+page.svelte:49` (H1), `src/routes/privacy/+page.svelte:50-54` (lead)
- **H1 (verbatim):**
  > "Privacy Policy"
  > Markup: `Privacy<br /><span class="t-accent">Policy</span>`
- **Lead / intro (verbatim):**
  > "Last updated: 29 September 2026. Tech Pixel A2H (“we”, “us”) respects your privacy and processes personal data in line with India’s Digital Personal Data Protection Act, 2023 (DPDP Act)."
- **Reviewer notes:** Body carries expected legal `{{PLACEHOLDER_*}}` tokens (report-only, see placeholder census below) — human fills with counsel/owner values. No work-engagement claims, no metrics. Contact line in body uses placeholders, not live contact truth — no contradiction with `site.ts` (placeholders ≠ claims).

## 17. `/terms`

- **Source:** `src/routes/terms/+page.svelte:49` (H1), `src/routes/terms/+page.svelte:50-53` (lead)
- **H1 (verbatim):**
  > "Terms of Service"
  > Markup: `Terms of<br /><span class="t-accent">Service</span>`
- **Lead / intro (verbatim):**
  > "Last updated: 29 September 2026. These terms govern quotations, delivery and use of services provided by Tech Pixel A2H, India."
- **Reviewer notes:** Body carries expected legal `{{PLACEHOLDER_*}}` tokens (report-only). No work-engagement claims, no metrics. Contact line uses placeholders — no contradiction with `site.ts`.

---

## Appendix A — Contact truth (from `src/lib/content/site.ts`, verbatim)

Quoted character-for-character so the human can consistency-check every page:

- `PHONE_DISPLAY` (`site.ts:15`): `+91 95977 96186`
- `PHONE_TEL` (`site.ts:16`): `tel:+919597796186`
- `EMAIL` (`site.ts:17`): `techpixela2h@gmail.com`
- `EMAIL_HREF` (`site.ts:18`): `mailto:techpixela2h@gmail.com`
- `WHATSAPP_NUMBER` (`site.ts:19`): `919597796186`
- `WHATSAPP_HREF` (`site.ts:20-21`): `https://wa.me/919597796186?text=Hi%20Tech%20Pixel%20A2H!`
- `LOCATION` (`site.ts:22`): `India`
- `SITE_URL` (`site.ts:11`, UNCONFIRMED per `site.ts:8` + `SITE_URL_UNCONFIRMED = true`): `https://techpixela2h.com`

**Cross-check result (H1/lead scope):** no quoted H1 or lead above contradicts contact truth — the only live contact value inside the reviewed copy is the about-page WhatsApp CTA (`wa.me/919597796186`), which matches `WHATSAPP_NUMBER`. Privacy/terms contact lines are placeholders, not competing claims.

## Appendix B — Placeholder census (verification only, zero edits made)

- `{{PLACEHOLDER_` occurrences in `src/`: **21 occurrences** across 2 files (`privacy/+page.svelte`: 9, `terms/+page.svelte`: 12), comprising **17 unique tokens** — the known legal set, expected per brief:
  - Privacy (7 unique): `{{PLACEHOLDER_REGISTERED_ADDRESS}}`, `{{PLACEHOLDER_CIN_GSTIN}}`, `{{PLACEHOLDER_PRIVACY_EMAIL}}` (×2), `{{PLACEHOLDER_GRIEVANCE_NAME}}`, `{{PLACEHOLDER_GRIEVANCE_EMAIL}}`, `{{PLACEHOLDER_GRIEVANCE_PHONE}}`, `{{PLACEHOLDER_BUSINESS_PHONE}}`
  - Terms (12 unique, incl. shared address/phone): `{{PLACEHOLDER_QUOTE_VALIDITY_DAYS}}`, `{{PLACEHOLDER_PAYMENT_MODES}}`, `{{PLACEHOLDER_GST_TREATMENT}}`, `{{PLACEHOLDER_LATE_FEE_TERMS}}`, `{{PLACEHOLDER_GSTIN}}`, `{{PLACEHOLDER_DEFECT_REPORT_DAYS}}`, `{{PLACEHOLDER_TERMINATION_NOTICE}}`, `{{PLACEHOLDER_JURISDICTION_CITY}}`, `{{PLACEHOLDER_REGISTERED_ADDRESS}}`, `{{PLACEHOLDER_BUSINESS_EMAIL}}`, `{{PLACEHOLDER_BUSINESS_PHONE}}`, `{{PLACEHOLDER_CIN}}`
- No `{{PLACEHOLDER_` tokens appear in any quoted H1/lead above. No `{{BASIN_KEY}}` in page copy (lives only in `site.ts:29` config, out of proof scope).
- `+212%`: zero hits expected (deleted badge) — not re-verified in this run beyond the quoted copy; F1/F2 evidence holds the grep proof.

## Appendix C — Flag summary for the human

1. **Concept-work labelling: PASS** — all 6 work slugs carry explicit sample/concept disclosures; index discloses "including concept work". No sentence presents concept work as a client engagement.
2. **Metrics in work pages: PASS** — zero numeric claims in any work H1/lead/summary/disclosure/body.
3. **Contact contradictions in quoted copy: NONE** — single live value (about WhatsApp CTA) matches `site.ts`.
4. **Advisory, out of work scope:** `/about` stats band (`25+` / `15+` / `5` / `100%`) — human to evidence before launch.
5. **Advisory, service scope:** 5 service `detail` fields are UNCONFIRMED placeholders (`services.ts:39,55,71,87,98`) — human to confirm before presenting as fact.
6. **Count note:** 17 entries, not 18 — the brief's itemised list sums to 17 (see top note).
