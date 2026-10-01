import { chromium } from 'playwright';

const BASE = process.env.C4_BASE ?? 'http://localhost:4173';
const SLUGS = [
  'local-store-online',
  'team-workspace',
  'hrms-concept',
  'festival-posters',
  'seo-blog-system',
  'growth-campaign'
];

const browser = await chromium.launch();
const page = await browser.newPage();
const results = [];
let fail = 0;
const check = (name, ok, detail = '') => {
  results.push(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`);
  if (!ok) fail++;
};

// Happy: /work index
await page.goto(BASE + '/work', { waitUntil: 'networkidle' });
check('index-200', page.url().endsWith('/work'));
const indexLinks = await page.$$eval('a.targo-card', (els) =>
  els.map((e) => e.getAttribute('href'))
);
for (const slug of SLUGS) {
  check(`index-card-href-/work/${slug}`, indexLinks.includes(`/work/${slug}`), JSON.stringify(indexLinks));
}
const indexDisclosures = await page.$$eval('[data-disclosure]', (els) =>
  els.map((e) => (e.textContent ?? '').trim().length)
);
check('index-disclosures-all-nonempty', indexDisclosures.length === 6 && indexDisclosures.every((n) => n > 0), JSON.stringify(indexDisclosures));

// Happy: home work cards href equality (N2 inbound-link proof)
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
const homeHrefs = await page.$$eval('#work a.targo-card', (els) =>
  els.map((e) => e.getAttribute('href'))
);
for (const slug of SLUGS) {
  check(`home-card-href-/work/${slug}`, homeHrefs.includes(`/work/${slug}`), JSON.stringify(homeHrefs));
}
// +212% badge absent in home DOM
const homeText = await page.textContent('#work');
check('home-no-212pct', !homeText.includes('+212%') && !homeText.includes('212%'));

// Happy: each slug — 200 + non-empty disclosure in DOM
for (const slug of SLUGS) {
  const resp = await page.goto(BASE + `/work/${slug}`, { waitUntil: 'networkidle' });
  check(`slug-${slug}-200`, resp.ok());
  const d = await page.$eval('[data-disclosure]', (e) => (e.textContent ?? '').trim());
  check(`slug-${slug}-disclosure-nonempty`, d.length > 0, JSON.stringify(d.slice(0, 80)));
  if (slug === 'hrms-concept') {
    const body = await page.textContent('main, section');
    check('hrms-concept-labelled', /concept/i.test(body ?? ''));
  }
}

console.log(results.join('\n'));
console.log(fail === 0 ? 'C4-QA PASS' : `C4-QA FAIL (${fail})`);
await browser.close();
process.exit(fail === 0 ? 0 : 1);
