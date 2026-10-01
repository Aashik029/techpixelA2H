import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:4173';
const results = [];
const googleHosts = ['fonts.googleapis.com', 'fonts.gstatic.com'];

async function happy(browser) {
  for (const route of ['/', '/about']) {
    for (const width of [390, 1280]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await page.goto(BASE + route, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1200);
      const a = await page.evaluate(() => document.scrollingElement.scrollWidth <= window.innerWidth);
      const bQ = await page.evaluate(() => document.fonts.check('700 16px Quantico'));
      const bS = await page.evaluate(() => document.fonts.check('400 16px "Space Grotesk"'));
      const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
      const c = bg !== 'rgb(5, 7, 11)';
      const name = `${route === '/' ? 'home' : 'about'}-${width}`;
      await page.screenshot({ path: `.omo/evidence/c1/happy-${name}.png` });
      results.push({ run: `happy ${route} @${width}`, overflow_ok: a, quantico: bQ, grotesk: bS, body_bg: bg, body_light: c });
      console.log(JSON.stringify(results[results.length - 1]));
      await page.close();
    }
  }
}

async function failure(browser) {
  for (const route of ['/', '/about']) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const hits = [];
    await page.route('**/*', (r) => {
      const url = r.request().url();
      if (googleHosts.some((h) => url.includes(h))) { hits.push(url); return r.abort(); }
      return r.continue();
    });
    // hard-block google hosts at network level too
    await page.route(/fonts\.g(oogleapis|static)\.com.*/, (r) => { hits.push(r.request().url()); return r.abort(); });
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    const bQ = await page.evaluate(() => document.fonts.check('700 16px Quantico'));
    const bS = await page.evaluate(() => document.fonts.check('400 16px "Space Grotesk"'));
    const name = route === '/' ? 'home' : 'about';
    await page.screenshot({ path: `.omo/evidence/c1/failure-${name}.png` });
    results.push({ run: `failure ${route} (google blocked)`, google_requests: hits.length, quantico: bQ, grotesk: bS });
    console.log(JSON.stringify(results[results.length - 1]));
    await page.close();
  }
}

const browser = await chromium.launch();
await happy(browser);
await failure(browser);
await browser.close();
const pass = results.every((r) =>
  (r.overflow_ok ?? true) && r.quantico && r.grotesk && (r.body_light ?? true) && ((r.google_requests ?? 0) === 0));
console.log(pass ? 'C1-QA PASS' : 'C1-QA FAIL');
if (!pass) process.exit(1);
