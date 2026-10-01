import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';

const BASE = process.env.C6_BASE ?? 'http://127.0.0.1:4173';
const ROUTES = (process.env.C6_ROUTES ?? '/').split(',');
const browser = await chromium.launch();
const page = await (await browser.newContext()).newPage();
let fail = 0;
for (const route of ROUTES) {
  await page.goto(BASE + route, { waitUntil: 'load' });
  await page.waitForTimeout(800);
  const { violations } = await new AxeBuilder({ page }).analyze();
  const bad = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  const ok = bad.length === 0;
  if (!ok) fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'} axe ${route}${ok ? ` (${violations.length} minor/notice)` : ' ' + JSON.stringify(bad.map((v) => ({ id: v.id, n: v.nodes.length, t: v.nodes.slice(0, 6).map((x) => x.target.join(' ')) })))}`);
}
console.log(fail === 0 ? 'AXE-ALL PASS' : `AXE-ALL FAIL (${fail})`);
await browser.close();
process.exit(fail === 0 ? 0 : 1);
