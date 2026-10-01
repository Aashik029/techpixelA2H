import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';

const BASE = process.env.C6_BASE ?? 'http://127.0.0.1:4173';
const browser = await chromium.launch();
const page = await (await browser.newContext()).newPage();
await page.goto(BASE + '/', { waitUntil: 'load' });
await page.waitForTimeout(1000);
const { violations } = await new AxeBuilder({ page })
  .withRules(['color-contrast'])
  .analyze();
for (const v of violations) {
  console.log(`RULE ${v.id} impact=${v.impact} nodes=${v.nodes.length}`);
  const seen = new Map();
  for (const n of v.nodes.slice(0, 40)) {
    const key = `${n.target.join(' ')} || ${String(n.html).slice(0, 110)}`;
    seen.set(key, (seen.get(key) ?? 0) + 1);
  }
  for (const [k, c] of seen) console.log(`  x${c} ${k}`);
}
await browser.close();
