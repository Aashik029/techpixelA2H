// Capture PURE video pixels (via canvas — no page overlay baked in).
// Run: node scripts/capture-posters.mjs
import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://127.0.0.1:4173/?poster', { waitUntil: 'networkidle' });

async function grabFrame(selector, time, outPath) {
  const dataUrl = await page.locator(selector).first().evaluate((v, t) => {
    const el = v;
    return new Promise((resolve, reject) => {
      el.muted = true;
      const timer = setTimeout(() => reject(new Error('seek timeout')), 15000);
      el.addEventListener(
        'seeked',
        () => {
          clearTimeout(timer);
          const c = document.createElement('canvas');
          c.width = el.videoWidth;
          c.height = el.videoHeight;
          c.getContext('2d').drawImage(el, 0, 0);
          resolve(c.toDataURL('image/jpeg', 0.85));
        },
        { once: true }
      );
      el.currentTime = t;
    });
  }, time);
  const buf = Buffer.from(dataUrl.split(',')[1], 'base64');
  writeFileSync(outPath, buf);
  console.log(outPath, buf.length, 'bytes');
}

await grabFrame('#home video', 3, 'static/videos/hero-poster.jpg');
await page.locator('#about video').first().scrollIntoViewIfNeeded();
await grabFrame('#about video', 2.5, 'static/videos/about-poster.jpg');

await browser.close();
console.log('done');
