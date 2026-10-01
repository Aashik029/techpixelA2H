import { chromium } from 'playwright';

const BASE = process.env.C6_BASE ?? 'http://127.0.0.1:4173';
const ROUTES = ['/', '/about', '/privacy', '/terms', '/services', '/work', '/services/web-development', '/work/hrms-concept', '/404'];
const browser = await chromium.launch();
for (const route of ROUTES) {
  const pg = await browser.newPage();
  let mismatch = false;
  pg.on('console', (m) => {
    if (m.text().includes('hydration_mismatch')) mismatch = true;
  });
  await pg.goto(BASE + route, { waitUntil: 'load' });
  await pg.waitForTimeout(1500);
  const links = await pg.evaluate(() => document.querySelectorAll('link[rel="stylesheet"]').length);
  console.log(`${mismatch ? 'MISMATCH' : 'clean   '} links=${links} ${route}`);
  await pg.close();
}
await browser.close();
