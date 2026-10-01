import { chromium } from 'playwright';

const BASE = process.env.C6_BASE ?? 'http://127.0.0.1:4173';
const browser = await chromium.launch();
const ctx = await browser.newContext({ reducedMotion: 'reduce' });
const page = await ctx.newPage();
pg_log: {
  page.on('console', (m) => console.log(`CONSOLE ${m.type()} ${m.text().slice(0, 200)}`));
  page.on('pageerror', (e) => console.log(`PAGEERROR ${String(e).slice(0, 300)}`));
}
await page.goto(BASE + '/', { waitUntil: 'load' });
await page.waitForTimeout(2000);
const v = await page.evaluate(() => {
  const el = document.querySelector('.targo-hero-media video');
  return {
    canPlayMp4: el.canPlayType('video/mp4'),
    readyState: el.readyState,
    networkState: el.networkState,
    error: el.error ? { code: el.error.code, msg: el.error.message } : null,
    paused: el.paused,
    src: el.currentSrc.slice(-20)
  };
});
console.log('VIDEO:', JSON.stringify(v, null, 1));
const btn = await page.$('[data-testid="hero-video-toggle"]');
await btn.click();
await page.waitForTimeout(1200);
const after = await page.evaluate(() => {
  const el = document.querySelector('.targo-hero-media video');
  const b = document.querySelector('[data-testid="hero-video-toggle"]');
  return { paused: el.paused, label: b.textContent.trim(), pressed: b.getAttribute('aria-pressed'), err: el.error ? el.error.code : null };
});
console.log('AFTER CLICK:', JSON.stringify(after));
await browser.close();
