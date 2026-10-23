# AIEO / GEO implementation — Tech Pixel A2H

This document covers the work done to make the site easier for AI answer engines
(ChatGPT, Perplexity, Gemini, Copilot, Google AI Overviews) to crawl, understand
and cite. It also lists the maintenance steps that keep the implementation
accurate.

The guiding rule: **only publish claims that already appear on the public site.**
No invented prices, client names, testimonials, social profiles, team sizes,
addresses or metrics.

## What is in place

### 1. Crawler access

- `static/robots.txt` allows public pages and explicitly welcomes the main AI
  crawlers: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot,
  Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Applebot,
  Applebot-Extended, Bingbot, CCBot, meta-externalagent, Amazonbot,
  DuckAssistBot, YouBot and cohere-ai.
- Private routes (`/admin`, `/login`, `/cms/`) stay disallowed.
- The sitemap is declared in `robots.txt`.

### 2. Machine-readable site summaries

- `static/llms.txt` — concise site summary, services, work disclosures, FAQs and
  contact details, following the llms.txt convention.
- `static/llms-full.txt` — the full public site text in one file: about, company
  facts, services, work (with sample/concept labels), process, all FAQs and
  contact details.
- `src/app.html` links to both the sitemap and `llms.txt`.

### 3. Structured data

`src/lib/components/JsonLd.svelte` builds one JSON-LD graph per page:

- **Business**: `Organization` + `ProfessionalService`, with legal name, URL,
  logo, description, slogan, email, phone, country, area served, founders,
  employee, `knowsAbout`, contact point and a five-service offer catalog.
- **People**: `Person` nodes for Ajay A (Founder & CEO, with photo) and Hanush S
  (CTO), linked to their `/about#...` anchors.
- **Website**: `WebSite` with publisher and language.
- **Pages**: `WebPage`, `AboutPage`, `CollectionPage`, `FAQPage` or `ItemPage`
  depending on the route, with `isPartOf`, `about`, `mainEntity`, breadcrumbs
  and publisher.
- **Services**: a `Service` node on each service detail page, including
  deliverables, audience, provider, area served and page reference.
- **Work**: a `CreativeWork` node on each work detail page, including the
  summary, full body text and the published sample/concept disclosure.
- **Indexes**: `ItemList` on `/services` and `/work`.
- **FAQs**: `FAQPage` with all questions and answers on `/faq`.
- **Breadcrumbs**: `BreadcrumbList` on every page except the home page.

No `sameAs` links are included because there are no confirmed social profiles
yet. Add them only when real profiles exist.

### 4. Answer-first content

- New `/faq` page with 13 visible Q&As, FAQPage schema, contact sidebar and
  internal links.
- Home-page "Straight answers" block (`TargoAnswers.svelte`) showing the four
  highest-value questions and linking to the full FAQ.
- Home hero subtitle naming the five services and the Trichy base, while
  serving clients across India.
- About page "Company at a glance" definition list: services, audience, track
  record, timeline, reply time, project start, leadership and base location.
- Service detail pages now include an "at a glance" block: best for, base
  location, how it starts and next step.
- Services and work index pages explain how engagements start and how sample /
  concept work is labelled.
- Footer links to FAQ, Resources and `llms.txt`; the contact section links to the
  FAQ.
- The founder photo (`static/images/ajay-ceo.jpg`) is now used on the About page
  and in the Person schema.

### 5. Metadata and discovery

- Canonical URLs, Open Graph and Twitter metadata on the new FAQ page.
- The sitemap automatically includes `/faq` and `/download`.
- The Google Search Console verification file remains at
  `static/google1c54b92ce1c885f8.html` and at the repository root.

## Files to know

| File | Purpose |
| --- | --- |
| `src/lib/components/JsonLd.svelte` | Central JSON-LD graph and page-type logic |
| `src/routes/faq/+page.svelte` | Visible FAQ page + FAQPage schema |
| `src/lib/components/TargoAnswers.svelte` | Home-page answer block |
| `src/lib/content/data/faq/*.json` | FAQ source of truth (13 entries) |
| `src/lib/content/faq.ts` | FAQ aggregator |
| `src/lib/content/data/services/*.json` | Service copy, deliverables and detail |
| `src/lib/content/data/work/*.json` | Work copy, body and disclosure labels |
| `static/llms.txt` | Concise AI-readable summary |
| `static/llms-full.txt` | Full AI-readable site text |
| `static/robots.txt` | Crawler policy |
| `src/app.html` | Site-wide author, llms.txt and sitemap links |

## How to maintain it

### Updating an FAQ

1. Edit or add a JSON file in `src/lib/content/data/faq/`.
2. Keep the answer answer-first: one direct sentence, then supporting detail.
3. Only use facts already published on the site. If a fact is new, get owner
   confirmation and publish it on the relevant page first.
4. Update the same Q&A in `static/llms.txt` and `static/llms-full.txt`.
5. Run `npm run check` and `npm run build`.
6. Update the content snapshot if the FAQ copy changed:
   `npx vitest run -u tests/content.baseline.test.ts`.
7. Redeploy.

The first four FAQ entries (by filename order) also appear on the home page.
Keep the most commercially important questions in positions 01–04.

### Updating a service or work entry

1. Edit the JSON file in `src/lib/content/data/services/` or
   `src/lib/content/data/work/`.
2. The page copy and JSON-LD update automatically.
3. Update the matching section in `static/llms-full.txt` (and the summary in
   `static/llms.txt` if the description changed).
4. Run `npm run check` and `npm run build`.
5. Redeploy.

Work entries must keep an honest `disclosure` value. Do not remove the
sample/concept labels.

### Adding social profiles

When real profiles exist, add their URLs to the business node in
`src/lib/components/JsonLd.svelte`:

```ts
sameAs: [
  'https://www.linkedin.com/company/...',
  'https://www.instagram.com/...'
]
```

Use only profiles the owner controls. Do not add placeholder URLs.

### Moving to a custom domain

`SITE_URL` lives in `src/lib/content/site.ts`. A domain change also requires:

- replacing the hardcoded canonical / Open Graph URLs in the route files,
- updating `static/llms.txt`, `static/llms-full.txt` and `static/robots.txt`,
- updating the Vercel domain and re-verifying Google Search Console,
- redeploying and re-submitting the sitemap.

### Changing the AI crawler policy

The current policy allows both AI search/assistant crawlers and AI training
crawlers. To opt out of training while keeping search visibility:

- Block `GPTBot` (OpenAI training) but keep `OAI-SearchBot` (ChatGPT search).
- Block `Google-Extended` (Gemini training/grounding) but keep `Googlebot`
  (Google Search). Note that `Google-Extended` does not control AI Overviews.
- Block `ClaudeBot` (training) but keep `Claude-SearchBot` and `Claude-User`.
- Block `CCBot` (Common Crawl) and `Applebot-Extended` (Apple training) if
  desired.

Edit the relevant groups in `static/robots.txt` and redeploy. This is a business
decision, not a technical requirement.

## Validation

Run locally:

```bash
npm run check
npm run build
npm run test:unit
npm run test:e2e
```

The content snapshot test covers the services, work, team, process and FAQ
modules. The live Supabase probe in `tests/supabase-client.test.ts` depends on
the configured Supabase host being reachable; a DNS failure there is unrelated
to the static AIEO output. The auth/RLS end-to-end specs in `e2e/` have the same
dependency and may fail while that host is unreachable.

External checks after deployment:

- Google Rich Results Test: <https://search.google.com/test/rich-results>
- Schema Markup Validator: <https://validator.schema.org/>
- Bing Webmaster Tools: <https://www.bing.com/webmasters>
- Google Search Console: submit or refresh `sitemap.xml`
- Open `/llms.txt`, `/llms-full.txt`, `/robots.txt` and `/faq` directly.

Quick live checks:

```text
/                                  -> hero subtitle + "Straight answers" block
/faq                               -> 13 visible questions + FAQPage JSON-LD
/llms.txt                          -> text/plain summary
/llms-full.txt                     -> full site text
/robots.txt                        -> AI crawler groups
/sitemap.xml                       -> includes /faq and /download
/google1c54b92ce1c885f8.html       -> Google verification body
```

## Monitoring AI visibility

Analytics is not yet enabled. When it is, watch for referrals from:

- `chatgpt.com` / `chat.openai.com`
- `perplexity.ai`
- `gemini.google.com`
- `copilot.microsoft.com`
- `claude.ai`

A simple monthly check is to ask each assistant:

1. "What is Tech Pixel A2H?"
2. "Who offers web development and AI automation for small businesses in India?"
3. "How much does a website cost for a small business in India?"
4. "Who can build a WhatsApp automation for a small business in India?"

Record whether the brand is mentioned, which page is cited, and whether the
facts are correct. Fix any incorrect facts at the source page first, then update
the llms files.

## Off-site next actions

These are outside the codebase and need owner involvement:

1. **Google Business Profile** — create/claim a service-area business profile if
   eligible. Use the same name, phone, email and website as the site. No fake
   address.
2. **LinkedIn / Instagram** — only if the owner will maintain them. Add the
   URLs to `sameAs` once live.
3. **Consistent citations** — use the same business name, phone, email and URL
   on directories, marketplaces and social profiles.
4. **Custom domain** — a branded `.com` improves trust for both search and AI
   citations. The current `vercel.app` URL is functional but less authoritative.
5. **Real case studies and testimonials** — publish only with client permission.
   Keep the current sample/concept labels on illustrative work.
6. **Expert explainer content** — if the owner can supply real experience,
   publish answer-first articles on topics buyers already ask about (website
   costs, timelines, WhatsApp automation, local SEO). Avoid generic AI-written
   filler.
7. **Reviews** — ask real clients for reviews on Google or another verified
   platform. Do not invent ratings or review counts.
