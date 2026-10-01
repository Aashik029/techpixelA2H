import { chromium } from 'playwright';
import { existsSync, readFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = join(process.cwd(), '.omo', 'evidence', 'c3') + '\\';
mkdirSync(OUT, { recursive: true });
const BASE = 'http://localhost:4173';
const SLUGS = ['web-development', 'ai-automation', 'poster-design', 'content-creation', 'digital-marketing'];
const results = [];
const ok = (name, pass, extra = '') => { results.push({ name, pass, extra }); console.log(`${pass ? 'PASS' : 'FAIL'} ${name}${extra ? ' — ' + extra : ''}`); };

// PRIMARY (host-independent): build/404.html on disk with C2 error markup
const p404 = 'build/404.html';
const exists = existsSync(p404);
ok('404.html exists on disk', exists, p404);
if (exists) {
  const html = readFileSync(p404, 'utf8');
  ok('404.html contains C2 error markup', html.includes('wandered off'), 'marker "wandered off"');
} else {
  ok('404.html contains C2 error markup', false, 'file missing');
}

const browser = await chromium.launch();
const page = await browser.newPage();

// HAPPY: index lists all 5 with links
let r = await page.goto(`${BASE}/services`, { waitUntil: 'load' });
ok('index /services 200', r?.status() === 200, `status=${r?.status()}`);
await page.screenshot({ path: OUT + 'happy-services-index.png' });
const indexLinks = await page.$$eval('a[href^="/services/"]', (as) => as.map((a) => a.getAttribute('href')));
for (const slug of SLUGS) {
  ok(`index links /services/${slug}`, indexLinks.includes(`/services/${slug}`), `found=${JSON.stringify(indexLinks)}`);
}

// HAPPY: all 5 slugs direct, 200 + title present
for (const slug of SLUGS) {
  const res = await page.goto(`${BASE}/services/${slug}`, { waitUntil: 'load' });
  ok(`slug /services/${slug} 200`, res?.status() === 200, `status=${res?.status()}`);
  const h1 = await page.textContent('h1');
  ok(`slug /services/${slug} h1 non-empty`, !!h1?.trim(), `h1=${JSON.stringify(h1?.trim())}`);
  await page.screenshot({ path: OUT + `happy-services-${slug}.png` });
}

// N2: inbound card hrefs on home #services equal exactly /services/<slug>
await page.goto(`${BASE}/`, { waitUntil: 'load' });
const cardHrefs = await page.$$eval('#services a[href^="/services/"]', (as) => as.map((a) => a.getAttribute('href')));
for (const slug of SLUGS) {
  ok(`home card href == /services/${slug}`, cardHrefs.includes(`/services/${slug}`), `found=${JSON.stringify(cardHrefs)}`);
}
await page.screenshot({ path: OUT + 'happy-home-services-cards.png' });

// SECONDARY (kit#10734 caveat): /services/nope under preview
const nope = await page.goto(`${BASE}/services/nope`, { waitUntil: 'load' });
const nopeBody = await page.textContent('body');
const renders404 = nopeBody?.includes('wandered off') ?? false;
console.log(`INFO /services/nope status=${nope?.status()} renders-C2-404=${renders404} (secondary only; kit#10734 caveat — neither passes nor fails the gate alone)`);
ok('secondary /services/nope renders C2 404 (informational)', renders404, `status=${nope?.status()}`);
await page.screenshot({ path: OUT + 'failure-services-nope.png' });

await browser.close();
const fails = results.filter((x) => !x.pass && !x.name.startsWith('secondary'));
console.log(fails.length === 0 ? 'C3-QA PASS' : `C3-QA FAIL (${fails.length})`);
process.exit(fails.length === 0 ? 0 : 1);
