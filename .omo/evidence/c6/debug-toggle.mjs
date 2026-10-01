import { chromium } from 'playwright';

const BASE = process.env.C6_BASE ?? 'http://127.0.0.1:4173';
const browser = await chromium.launch();
const pg = await browser.newPage();
await pg.goto(BASE + '/', { waitUntil: 'load' });
await pg.waitForTimeout(1500);
const info = await pg.evaluate(() => {
  const el = document.querySelector('[data-testid="hero-video-toggle"]');
  const cs = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  const links = [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.getAttribute('href'));
  return {
    cls: el.className,
    pos: cs.position,
    minH: cs.minHeight,
    pad: cs.padding,
    h: Math.round(r.height),
    w: Math.round(r.width),
    x: Math.round(r.x),
    y: Math.round(r.y),
    text: el.textContent.trim(),
    stylesheets: links
  };
});
console.log(JSON.stringify(info, null, 1));
await pg.screenshot({ path: '.omo/evidence/c6/debug-hero-toggle.png' });
await browser.close();
