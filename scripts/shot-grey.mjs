// Grey-side check: screenshot hero, sample left vs right background tone.
// Run: node scripts/shot-grey.mjs
import { chromium } from 'playwright';

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push('CONSOLE: ' + m.text());
});

await page.goto('http://localhost:4173/?grey', { waitUntil: 'networkidle' });
await page.waitForTimeout(6000);

const tones = await page.evaluate(() => {
  const shot = (x0, x1) => {
    const c = document.createElement('canvas');
    c.width = 100; c.height = 100;
    const g = c.getContext('2d');
    // sample page pixels via screenshot-free approach: read hero bg gradient stops
    return null;
  };
  const hero = document.querySelector('#home');
  const cs = getComputedStyle(hero);
  return { bg: cs.backgroundImage.slice(0, 200) };
});
console.log(JSON.stringify(tones, null, 2));
await page.screenshot({ path: 'C:\\Users\\aashi\\AppData\\Local\\Temp\\opencode\\grey-hero.png' });
console.log(errors.length ? errors.join('\n') : 'NO-PAGE-ERRORS');
await browser.close();
