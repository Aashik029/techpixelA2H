// Zero-interaction check: no mouse moves, no clicks. Verifies the globe
// is visible + playing on load alone. Run: node scripts/verify-no-touch.mjs
import { chromium } from 'playwright';

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push('CONSOLE: ' + m.text());
});

await page.goto('http://127.0.0.1:4173/?notouch', { waitUntil: 'networkidle' });
// NOTE: no mouse.move, no click, no scroll — hands off.
await page.waitForTimeout(6000);

const state = await page.evaluate(() => {
  const v = document.querySelector('#home video');
  const r = v.getBoundingClientRect();
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  // sample pixels from the globe area (right-center of the video box)
  c.getContext('2d').drawImage(v, v.videoWidth * 0.55, v.videoHeight * 0.25, v.videoWidth * 0.3, v.videoHeight * 0.4, 0, 0, 64, 64);
  const d = c.getContext('2d').getImageData(0, 0, 64, 64).data;
  let sum = 0, n = 0;
  for (let i = 0; i < d.length; i += 4) { sum += (d[i] + d[i + 1] + d[i + 2]) / 3; n++; }
  return {
    paused: v.paused,
    readyState: v.readyState,
    currentTime: v.currentTime,
    poster: v.getAttribute('poster'),
    meanBrightness: Math.round(sum / n),
    videoBox: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }
  };
});
console.log(JSON.stringify(state, null, 2));
await page.screenshot({ path: 'C:\\Users\\aashi\\AppData\\Local\\Temp\\opencode\\notouch-hero.png' });
console.log(errors.length ? errors.join('\n') : 'NO-PAGE-ERRORS');
await browser.close();
