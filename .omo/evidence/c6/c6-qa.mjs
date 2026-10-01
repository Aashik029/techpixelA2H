import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { existsSync } from 'node:fs';

const BASE = process.env.C6_BASE ?? 'http://127.0.0.1:4173';
const SERVICE_SLUGS = ['web-development', 'ai-automation', 'poster-design', 'content-creation', 'digital-marketing'];
const WORK_SLUGS = ['local-store-online', 'team-workspace', 'hrms-concept', 'festival-posters', 'seo-blog-system', 'growth-campaign'];
const ROUTES = [
  '/', '/about', '/privacy', '/terms', '/services', '/work', '/404',
  ...SERVICE_SLUGS.map((s) => `/services/${s}`),
  ...WORK_SLUGS.map((s) => `/work/${s}`)
];
const OG_MANIFEST = {
  '/': 'home.png', '/about': 'about.png', '/privacy': 'privacy.png', '/terms': 'terms.png',
  '/services': 'services.png', '/work': 'work.png',
  ...Object.fromEntries(SERVICE_SLUGS.map((s) => [`/services/${s}`, `services-${s}.png`])),
  ...Object.fromEntries(WORK_SLUGS.map((s) => [`/work/${s}`, `work-${s}.png`]))
};

const results = [];
let fail = 0;
const check = (name, ok, detail = '') => {
  results.push(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`);
  if (!ok) fail++;
};

const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();

// 1. OG manifest: file exists + route og:image 200 (post-rebuild preview)
for (const [route, file] of Object.entries(OG_MANIFEST)) {
  check(`og-manifest-exists ${file}`, existsSync(`static/og/${file}`));
  await page.goto(BASE + route, { waitUntil: 'load' });
  const og = await page.getAttribute('meta[property="og:image"]', 'content');
  check(`og-image-meta ${route}`, !!og && og.endsWith(`/og/${file}`), String(og));
  const res = await page.request.get(BASE + new URL(og ?? '', BASE).pathname);
  check(`og-image-200 ${route}`, res.status() === 200, `status=${res.status()}`);
}

// 2. JSON-LD @graph on every route
for (const route of ROUTES) {
  await page.goto(BASE + route, { waitUntil: 'load' });
  const raw = await page.$eval('script[type="application/ld+json"]', (e) => e.textContent).catch(() => null);
  let ok = false, detail = 'missing';
  if (raw) {
    try {
      const j = JSON.parse(raw);
      const types = (j['@graph'] ?? []).map((n) => n['@type']);
      ok = ['Organization', 'ProfessionalService', 'WebSite', 'WebPage', 'BreadcrumbList'].every((t) => types.includes(t));
      detail = JSON.stringify(types);
    } catch (e) { detail = 'unparseable'; }
  }
  check(`jsonld-graph ${route}`, ok, detail);
}

// 3. Sitemap: 200, all slugs, no /404
{
  const res = await page.request.get(BASE + '/sitemap.xml');
  check('sitemap-200', res.status() === 200, `status=${res.status()}`);
  const xml = await res.text();
  for (const s of [...SERVICE_SLUGS.map((x) => `/services/${x}`), ...WORK_SLUGS.map((x) => `/work/${x}`), '/privacy', '/terms', '/services', '/work']) {
    check(`sitemap-has ${s}`, xml.includes(`<loc>https://techpixela2h.com${s}</loc>`));
  }
  check('sitemap-excludes-404', !xml.includes('/404'));
}

// 4. Footer + nav inbound links resolve
{
  await page.goto(BASE + '/', { waitUntil: 'load' });
  for (const href of ['/privacy', '/terms', '/services', '/work', '/about']) {
    const res = await page.request.get(BASE + href);
    check(`inbound-link-200 ${href}`, res.status() === 200, `status=${res.status()}`);
  }
  const footerHrefs = await page.$$eval('footer a[href]', (els) => els.map((e) => e.getAttribute('href')));
  for (const href of ['/privacy', '/terms', '/services', '/work']) {
    check(`footer-has ${href}`, footerHrefs.includes(href), JSON.stringify(footerHrefs));
  }
}

// 5. Targets >= 24x24 (every route)
for (const route of ROUTES) {
  await page.goto(BASE + route, { waitUntil: 'load' });
  const small = await page.$$eval('a[href], button', (els) =>
    els
      .filter((e) => (e.offsetParent !== null))
      .map((e) => { const r = e.getBoundingClientRect(); return { t: e.tagName, h: e.getAttribute('href') ?? e.getAttribute('aria-label') ?? (e.textContent ?? '').trim().slice(0, 20), w: Math.round(r.width), hgt: Math.round(r.height) }; })
      .filter((x) => x.w < 24 || x.hgt < 24)
  );
  check(`targets-24 ${route}`, small.length === 0, small.length ? JSON.stringify(small.slice(0, 5)) : `${await page.$$eval('a[href], button', (els) => els.filter((e) => e.offsetParent !== null).length)} targets measured`);
}

// 6. Poster is LCP setup: preload + poster attrs, video has no autoplay attr
{
  await page.goto(BASE + '/', { waitUntil: 'load' });
  check('lcp-poster-preload', (await page.$('link[rel="preload"][href="/videos/hero-poster.jpg"]')) !== null);
  check('hero-poster-attr', (await page.getAttribute('#home video, .targo-hero-media video', 'poster')) === '/videos/hero-poster.jpg');
  check('hero-no-autoplay-attr', (await page.getAttribute('.targo-hero-media video', 'autoplay')) === null);
  check('hero-toggle-present', (await page.$('[data-testid="hero-video-toggle"]')) !== null);
  check('about-toggle-present', (await page.$('[data-testid="about-video-toggle"]')) !== null);
}

// 7. axe per route: zero serious/critical
for (const route of ROUTES) {
  await page.goto(BASE + route, { waitUntil: 'load' });
  const { violations } = await new AxeBuilder({ page }).analyze();
  const bad = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  check(`axe ${route}`, bad.length === 0, bad.length ? JSON.stringify(bad.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length }))) : `${violations.length} minor/notice total`);
}

console.log(results.join('\n'));
console.log(fail === 0 ? 'C6-QA PASS' : `C6-QA FAIL (${fail})`);
await browser.close();
process.exit(fail === 0 ? 0 : 1);
