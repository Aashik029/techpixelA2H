import { chromium } from 'playwright';

const BASE = process.env.C6_BASE ?? 'http://127.0.0.1:4173';
const browser = await chromium.launch();
const pg = await browser.newPage();
pg.on('console', async (m) => {
  const args = await Promise.all(m.args().map((a) => a.jsonValue().catch(() => '[unserializable]')));
  console.log(`CONSOLE ${m.type()} ${m.text().slice(0, 300)}`);
  for (const a of args) {
    const s = typeof a === 'string' ? a : JSON.stringify(a);
    if (s && s.length > 5 && s.length < 2000) console.log('  ARG:', s.slice(0, 1200));
  }
});
await pg.goto(BASE + '/', { waitUntil: 'load' });
await pg.waitForTimeout(2000);
await browser.close();
