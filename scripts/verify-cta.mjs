import { chromium } from 'playwright';

const errors = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });

let popups = 0;
page.on('popup', () => popups++);

await page.goto('http://localhost:4173/?fresh=cta1', { waitUntil: 'load' });
await page.waitForTimeout(2500);

// 1. Click each CTA, assert lands on #contact, no popup
const ctas = [
  ['hero get started', '.targo-hero .targo-cta'],
  ['about learn more', '.targo-about .targo-cta'],
  ['service enquire #1', '#services .targo-card a'],
  ['work start project', '#work .targo-btn'],
];
for (const [label, sel] of ctas) {
  await page.evaluate((s) => { window.scrollTo(0, 0); }, sel);
  await page.waitForTimeout(400);
  await page.click(sel);
  await page.waitForTimeout(1500);
  const hash = await page.evaluate(() => location.hash);
  const contactVisible = await page.evaluate(() => {
    const r = document.querySelector('#contact').getBoundingClientRect();
    return r.top < innerHeight && r.bottom > 0;
  });
  console.log(`${label}: hash=${hash} contactVisible=${contactVisible} popups=${popups}`);
}

// 2. Fill + submit form, check mailto link
await page.fill('#tc-name', 'Test User');
await page.fill('#tc-phone', '+919876543210');
await page.click('#contact button[aria-pressed="false"]');
await page.fill('#tc-msg', 'Need a website');
await page.click('#contact button[type="submit"]');
await page.waitForTimeout(800);
const mailto = await page.evaluate(() => document.querySelector('#contact .targo-btn-cyan')?.getAttribute('href') ?? 'NONE');
console.log('mailto:', decodeURIComponent(mailto).slice(0, 220));
const successHeading = await page.textContent('#contact [role="status"] h3');
console.log('success heading:', successHeading?.trim());

// 3. Count wa.me hrefs in DOM
const waCount = await page.evaluate(() => [...document.querySelectorAll('a[href*="wa.me"]')].length);
const waLabels = await page.evaluate(() => [...document.querySelectorAll('a[href*="wa.me"]')].map(a => a.textContent.trim().replace(/\s+/g, ' ')));
console.log('wa.me links:', waCount, JSON.stringify(waLabels));

console.log('ERRORS:', errors.length ? errors : 'none');
await browser.close();
