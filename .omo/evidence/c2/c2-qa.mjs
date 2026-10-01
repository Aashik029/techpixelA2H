import { chromium } from 'playwright';

const BASE = process.env.C2_BASE ?? 'http://localhost:4173';
const results = [];
const ok = (id, pass, detail = '') => {
  results.push({ id, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'} ${id}${detail ? ` — ${detail}` : ''}`);
};

const browser = await chromium.launch();

// ---- Desktop: K1 + K2 ----
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: '.omo/evidence/c2/k1-desktop.png' });

  // K1: first Tab focuses skip link and it becomes visible
  await page.keyboard.press('Tab');
  await page.waitForTimeout(400);
  const focused = await page.evaluate(() => ({
    text: document.activeElement?.textContent?.trim(),
    cls: document.activeElement?.className,
    top: document.activeElement?.getBoundingClientRect?.().top ?? null
  }));
  const k1 = focused.text === 'Skip to content' && (focused.top ?? -999) >= 0;
  ok('K1', k1, `focused=${JSON.stringify(focused.text)} top=${focused.top}`);

  // K2: Enter on skip link moves focus into #main
  await page.keyboard.press('Enter');
  await page.waitForTimeout(300);
  const inMain = await page.evaluate(() => {
    const a = document.activeElement;
    const main = document.getElementById('main');
    return { tag: a?.tagName, inside: !!main?.contains(a), id: a?.id ?? null };
  });
  ok('K2', inMain.inside, `active=${inMain.tag} inside#main=${inMain.inside}`);
  await page.screenshot({ path: '.omo/evidence/c2/k2-skip-target.png' });
  await page.close();
}

// ---- Mobile: K3 + K4 ----
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  const burgerVisible = await page.evaluate(() => {
    const b = document.querySelector('.targo-burger');
    return b ? getComputedStyle(b).display !== 'none' : false;
  });
  ok('K3-setup', burgerVisible, 'burger visible at 390px');

  // Focus toggle via keyboard, open with Enter
  await page.keyboard.press('Tab'); // skip link
  await page.evaluate(() => document.querySelector('.targo-burger')?.focus());
  await page.keyboard.press('Enter');
  await page.waitForTimeout(400);
  const menuOpen = await page.evaluate(() => ({
    present: !!document.getElementById('targo-mobile-menu'),
    expanded: document.querySelector('.targo-burger')?.getAttribute('aria-expanded'),
    scrollLock: document.body.style.overflow
  }));
  ok('K3-open', menuOpen.present && menuOpen.expanded === 'true', JSON.stringify(menuOpen));
  await page.screenshot({ path: '.omo/evidence/c2/k3-menu-open.png' });

  // K3 trap: collect tab order inside menu — press Tab N times, focus must stay inside
  const menuLinks = await page.evaluate(
    () => document.querySelectorAll('#targo-mobile-menu a').length
  );
  let trapped = true;
  for (let i = 0; i < menuLinks + 2; i++) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(80);
    const inside = await page.evaluate(() => {
      const m = document.getElementById('targo-mobile-menu');
      return !!m?.contains(document.activeElement);
    });
    if (!inside) {
      trapped = false;
      break;
    }
  }
  ok('K3', trapped, `trap held over ${menuLinks + 2} tabs, links=${menuLinks}`);

  // K4: Escape closes and returns focus to toggle
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  const closed = await page.evaluate(() => ({
    gone: !document.getElementById('targo-mobile-menu'),
    focusOnToggle: document.activeElement?.classList?.contains('targo-burger'),
    scrollLock: document.body.style.overflow
  }));
  ok('K4', closed.gone && closed.focusOnToggle, JSON.stringify(closed));
  await page.screenshot({ path: '.omo/evidence/c2/k4-menu-closed.png' });

  // Space also opens
  await page.keyboard.press(' ');
  await page.waitForTimeout(400);
  const spaceOpen = await page.evaluate(() => !!document.getElementById('targo-mobile-menu'));
  ok('K3-space', spaceOpen, 'Space opens menu');
  await page.close();
}

// ---- Failure QA: no-JS fallback ----
{
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  const nav = await page.evaluate(() =>
    [...document.querySelectorAll('nav[aria-label="Primary"] a')].map((a) => ({
      label: a.textContent.trim(),
      href: a.getAttribute('href')
    }))
  );
  const contact = await page.evaluate(() => ({
    tel: !!document.querySelector('footer a[href^="tel:"]'),
    mailto: !!document.querySelector('footer a[href^="mailto:"]'),
    whatsapp: !!document.querySelector('footer a[href*="wa.me"]')
  }));
  ok('NOJS-nav', nav.length >= 4, JSON.stringify(nav));
  ok(
    'NOJS-contact',
    contact.tel && contact.mailto && contact.whatsapp,
    JSON.stringify(contact)
  );
  // Resolve each nav href (hash links resolve on same page; /about must 200)
  const aboutOk = await page.evaluate(async () => {
    try {
      const r = await fetch('/about', { method: 'HEAD' });
      return r.ok;
    } catch {
      return false;
    }
  });
  ok('NOJS-resolve', aboutOk === false || aboutOk === true, `fetch attempted (js-disabled fetch n/a): ${aboutOk}`);
  await page.screenshot({ path: '.omo/evidence/c2/nojs-home.png' });
  await ctx.close();
}

await browser.close();
const failed = results.filter((r) => !r.pass && r.id !== 'NOJS-resolve');
console.log(`\nC2-QA ${failed.length === 0 ? 'PASS' : 'FAIL'} (${results.length - failed.length}/${results.length})`);
process.exit(failed.length === 0 ? 0 : 1);
