import { chromium } from 'playwright';

const BASE = process.env.F3_BASE || 'http://127.0.0.1:4174';
const results = [];
let fail = 0;
const check = (name, okC, detail = '') => {
  results.push(`${okC ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`);
  if (!okC) fail++;
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
await page.goto(BASE + '/', { waitUntil: 'load' });
const toggle = page.locator('header button[aria-expanded]').first();
await toggle.focus();
await page.keyboard.press('Enter');
await page.waitForTimeout(400);
check('reprobe: menu opens', (await toggle.getAttribute('aria-expanded')) === 'true');

// Correct scope: trap is menuEl (#targo-mobile-menu) + toggle per TargoNav.svelte:42-54,62
let escaped = false;
let trace = [];
for (let i = 0; i < 20; i++) {
  await page.keyboard.press('Tab');
  await page.waitForTimeout(60);
  const info = await page.evaluate(() => {
    const menu = document.querySelector('#targo-mobile-menu');
    const el = document.activeElement;
    const inMenu = !!(menu && menu.contains(el));
    const isToggle = !!(el && el.getAttribute && el.getAttribute('aria-expanded') !== null);
    return { inMenu, isToggle, tag: el?.tagName, text: (el?.textContent ?? '').trim().slice(0, 24) };
  });
  trace.push(`${info.tag}/${info.text}(menu=${info.inMenu},toggle=${info.isToggle})`);
  if (!info.inMenu && !info.isToggle) { escaped = true; break; }
}
check('reprobe: Tab trapped in #targo-mobile-menu (+toggle)', !escaped, escaped ? trace.join(' | ') : 'held 20 tabs');
await ctx.close();
await browser.close();
console.log(results.join('\n'));
console.log(trace.join('\n'));
process.exit(fail === 0 ? 0 : 1);
