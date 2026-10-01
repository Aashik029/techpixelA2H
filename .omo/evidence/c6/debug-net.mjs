import { chromium } from 'playwright';

const BASE = process.env.C6_BASE ?? 'http://127.0.0.1:4173';
const browser = await chromium.launch();
const pg = await browser.newPage();
pg.on('response', (r) => {
  const u = r.url();
  if (u.includes('_app') || u.includes('.css') || u.includes('.js')) {
    console.log(`RESP ${r.status()} ${r.headers()['content-type']} ${u.slice(BASE.length)}`);
  }
});
pg.on('requestfailed', (r) => {
  console.log(`FAILED ${r.failure()?.errorText} ${r.url().slice(BASE.length)}`);
});
pg.on('console', (m) => console.log(`CONSOLE ${m.type()} ${m.text().slice(0, 160)}`));
await pg.goto(BASE + '/', { waitUntil: 'load' });
await pg.waitForTimeout(2000);
console.log('link-count:', await pg.evaluate(() => document.querySelectorAll('link[rel="stylesheet"]').length));
await browser.close();
