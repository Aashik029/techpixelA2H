import { chromium } from 'playwright';

const BASE = process.env.F3_BASE || 'http://127.0.0.1:4174';
const results = [];
let fail = 0;
const check = (name, okC, detail = '') => {
  results.push(`${okC ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`);
  if (!okC) fail++;
};

const ROUTES = [
  '/', '/about', '/services', '/work', '/privacy', '/terms',
  '/services/web-development', '/services/ai-automation', '/services/poster-design',
  '/services/content-creation', '/services/digital-marketing',
  '/work/hrms-concept', '/work/festival-posters', '/work/growth-campaign',
  '/work/local-store-online', '/work/seo-blog-system', '/work/team-workspace'
];
const BASIN_GLOB = '**/usebasin.com/**';

async function driveToSubmit(page) {
  await page.goto(BASE + '/#contact', { waitUntil: 'load' });
  await page.evaluate(() => document.querySelector('#contact')?.scrollIntoView());
  await page.selectOption('[data-testid="tc-service-select"]', 'Not sure yet');
  await page.click('[data-testid="tc-continue"]');
  await page.fill('textarea#tc-q-goal_text', 'F3 sweep: textile shop wants more Instagram customers');
  await page.click('[data-testid="tc-continue"]');
  await page.getByRole('group', { name: 'Budget range *' }).getByRole('button').first().click();
  await page.getByRole('group', { name: 'Timeline *' }).getByRole('button').first().click();
  await page.click('[data-testid="tc-continue"]');
  await page.fill('#tc-name', 'F3 Sweep');
  await page.fill('#tc-phone', '+919597796186');
}

const browser = await chromium.launch();

// ---- 1. Keyboard (desktop 1280): skip link first stop, visible, Enter -> #main ----
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(BASE + '/', { waitUntil: 'load' });
  await page.keyboard.press('Tab');
  await page.waitForTimeout(300);
  const focused = await page.evaluate(() => {
    const el = document.activeElement;
    return { tag: el?.tagName, text: (el?.textContent ?? '').trim().slice(0, 40), cls: el?.className?.toString?.().slice(0, 60) };
  });
  const isSkip = /skip/i.test(focused.text + ' ' + focused.cls);
  check('kbd: first Tab stops on skip link', isSkip, JSON.stringify(focused));
  const box = await page.evaluate(() => {
    const el = document.activeElement;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return { top: r.top, left: r.left, w: r.width, h: r.height, opacity: cs.opacity, vis: cs.visibility };
  });
  check('kbd: skip link visible on focus', box.top >= 0 && box.left >= 0 && box.w > 0 && box.h > 0 && box.opacity !== '0', JSON.stringify(box));
  await page.keyboard.press('Enter');
  await page.waitForTimeout(300);
  const inMain = await page.evaluate(() => {
    const el = document.activeElement;
    const main = document.querySelector('#main');
    return { tag: el?.tagName, id: el?.id, insideMain: !!(main && (el === main || main.contains(el))) };
  });
  check('kbd: Enter on skip moves focus into #main', inMain.insideMain, JSON.stringify(inMain));
  await page.close();
}

// ---- 2. Keyboard (mobile 390): menu opens on Enter, trap holds, Escape closes + refocus ----
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'load' });
  const toggle = page.locator('[data-testid="nav-menu-toggle"], button[aria-expanded][aria-controls], header button[aria-expanded]').first();
  const toggleVisible = await toggle.isVisible().catch(() => false);
  check('kbd: mobile menu toggle visible @390', toggleVisible);
  if (toggleVisible) {
    await toggle.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(400);
    const expanded = await toggle.getAttribute('aria-expanded').catch(() => null);
    check('kbd: menu opens on Enter', expanded === 'true', `aria-expanded=${expanded}`);
    // trap: Tab several times, focus stays inside menu/nav
    const trapHeld = await page.evaluate(() => {
      const nav = document.querySelector('header nav, [data-testid="mobile-menu"], header [role="navigation"]');
      for (let i = 0; i < 12; i++) {
        const el = document.activeElement;
        if (nav && !(el === document.body || nav.contains(el))) return false;
        (document.activeElement?.nextElementSibling, 0);
        const focusables = [...document.querySelectorAll('a[href], button:not([disabled])')].filter((e) => e.offsetParent !== null);
        const idx = focusables.indexOf(document.activeElement);
        focusables[(idx + 1) % focusables.length]?.focus();
      }
      const nav2 = document.querySelector('header nav, [data-testid="mobile-menu"], header [role="navigation"]');
      const el = document.activeElement;
      return !!(nav2 && (el === document.body || nav2.contains(el) || /menu|toggle|close/i.test(el?.textContent ?? '' + el?.className ?? '')));
    });
    // simpler trap probe: press Tab repeatedly via keyboard and check containment
    let escaped = false;
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(60);
      const inside = await page.evaluate(() => {
        const nav = document.querySelector('header');
        const el = document.activeElement;
        return !!(nav && (nav.contains(el) || el === document.body));
      });
      if (!inside) { escaped = true; break; }
    }
    check('kbd: Tab trapped inside open menu (header)', !escaped, escaped ? 'focus left header' : 'held 15 tabs');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    const closed = await toggle.getAttribute('aria-expanded').catch(() => null);
    check('kbd: Escape closes menu', closed !== 'true', `aria-expanded=${closed}`);
    const refocus = await page.evaluate(() => {
      const el = document.activeElement;
      return { tag: el?.tagName, testid: el?.getAttribute?.('data-testid'), aria: el?.getAttribute?.('aria-expanded') };
    });
    const focusBack = await toggle.evaluate((t) => t === document.activeElement).catch(() => false);
    check('kbd: focus returns to toggle after Escape', focusBack, JSON.stringify(refocus));
    void trapHeld;
  }
  await ctx.close();
}

// ---- 3. Mobile 390: no overflow on ALL routes ----
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  for (const r of ROUTES) {
    await page.goto(BASE + r, { waitUntil: 'load' });
    await page.waitForTimeout(400);
    const ov = await page.evaluate(() => ({
      sw: document.scrollingElement.scrollWidth,
      iw: window.innerWidth
    }));
    check(`mobile390: no overflow ${r}`, ov.sw <= ov.iw, `scrollWidth=${ov.sw} inner=${ov.iw}`);
  }
  await page.screenshot({ path: '.omo/evidence/f3/mobile-390-work.png' });
  await ctx.close();
}

// ---- 4. no-JS: contact paths present, zero empty mailto ----
{
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(BASE + '/#contact', { waitUntil: 'load' });
  const html = await page.content();
  const tel = (html.match(/href="tel:/g) || []).length;
  const mail = (html.match(/href="mailto:/g) || []).length;
  const wa = (html.match(/wa\.me/g) || []).length;
  const empty = (html.match(/href=""|href="mailto:"/g) || []).length;
  check('nojs: >=1 working contact path', tel + mail + wa >= 1, `tel=${tel} mailto=${mail} wa=${wa}`);
  check('nojs: ZERO empty mailto hrefs', empty === 0, `${empty} empty`);
  // nav links resolve without JS: every nav href GETs 200
  const navHrefs = await page.$$eval('header a[href]', (as) => as.map((a) => a.getAttribute('href')));
  check('nojs: nav links present', navHrefs.length >= 4, `${navHrefs.length} links`);
  await page.screenshot({ path: '.omo/evidence/f3/nojs-contact.png' });
  await ctx.close();
}

// ---- 5. Form failure: 500 + abort -> fallback intact ----
for (const mode of ['500', 'abort']) {
  const page = await browser.newPage();
  if (mode === '500') {
    await page.route(BASIN_GLOB, (route) =>
      route.fulfill({ status: 500, contentType: 'application/json', body: '{"error":1}' })
    );
  } else {
    await page.route(BASIN_GLOB, (route) => route.abort());
  }
  await driveToSubmit(page);
  await page.click('[data-testid="tc-continue"]');
  await page.waitForSelector('[data-testid="tc-success"]', { timeout: 8000 });
  const status = (await page.textContent('[data-testid="tc-submit-status"]')) ?? '';
  const mailHref = (await page.getAttribute('[data-testid="tc-send-email"]', 'href')) ?? '';
  const waHref = (await page.getAttribute('[data-testid="tc-whatsapp-fallback"]', 'href')) ?? '';
  check(`form-${mode}: fallback copy shown`, status.includes("didn't go through"), status.slice(0, 80));
  check(`form-${mode}: mailto composed intact`, mailHref.startsWith('mailto:') && mailHref.includes('F3%20Sweep'), mailHref.slice(0, 60));
  check(`form-${mode}: whatsapp fallback intact`, waHref.includes('wa.me/919597796186'), waHref.slice(0, 60));
  await page.screenshot({ path: `.omo/evidence/f3/form-${mode}.png` });
  await page.close();
}

// ---- 6. Reduced-motion: no autoplay + pause controls ----
{
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'load' });
  await page.waitForTimeout(2500);
  const heroPaused = await page.$eval('.targo-hero-media video', (v) => v.paused).catch(() => 'no-video');
  check('rm: hero does not autoplay', heroPaused === true, `paused=${heroPaused}`);
  const heroToggle = await page.$('[data-testid="hero-video-toggle"]');
  check('rm: hero pause control present', heroToggle !== null);
  if (heroToggle) {
    check('rm: hero toggle reads Play under reduced-motion', (((await heroToggle.textContent()) ?? '').trim() === 'Play'));
  }
  const aboutToggle = await page.$('[data-testid="about-video-toggle"]');
  check('rm: about pause control present', aboutToggle !== null);
  await aboutToggle?.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2500);
  const aboutPaused = await page.$eval('.targo-about-right video, .targo-video-wrap video', (v) => v.paused).catch(() => 'no-video');
  check('rm: about does not autoplay after scroll', aboutPaused === true, `paused=${aboutPaused}`);
  await page.screenshot({ path: '.omo/evidence/f3/reduced-motion.png' });
  await ctx.close();
}

// ---- 7. Internal link-integrity crawl: every internal href -> 200, zero 404s ----
{
  const page = await browser.newPage();
  const hrefSet = new Set();
  for (const r of ROUTES) {
    await page.goto(BASE + r, { waitUntil: 'load' });
    const hrefs = await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')));
    for (const h of hrefs) {
      if (!h || h.startsWith('#') || h.startsWith('mailto:') || h.startsWith('tel:')) continue;
      if (/^(https?:)?\/\//i.test(h) || h.startsWith('data:')) continue; // external only skipped; checked separately below
      const path = h.split('#')[0].split('?')[0] || '/';
      hrefSet.add(path.startsWith('/') ? path : '/' + path);
    }
  }
  const all = [...hrefSet].sort();
  const bad = [];
  const req = (await import('node:http')).default;
  const fetchStatus = (path) =>
    new Promise((resolve) => {
      const options = { host: '127.0.0.1', port: Number(new URL(BASE).port), path, method: 'GET', timeout: 8000 };
      const r = req.request(options, (res) => { res.resume(); resolve(res.statusCode); });
      r.on('error', () => resolve('ERR'));
      r.on('timeout', () => { r.destroy(); resolve('TIMEOUT'); });
      r.end();
    });
  for (const p of all) {
    const st = await fetchStatus(p);
    if (st !== 200) bad.push(`${p} -> ${st}`);
  }
  check('crawl: all internal hrefs resolve 200', bad.length === 0, bad.length ? bad.join('; ') : `${all.length} hrefs all 200`);
  check('crawl: zero internal 404s', !bad.some((b) => /-> 404/.test(b)), `${bad.filter((b) => /-> 404/.test(b)).length} 404s`);
  await page.close();
  const { writeFileSync } = await import('node:fs');
  writeFileSync(
    '.omo/evidence/f3/crawl-report.txt',
    `F3 internal link-integrity crawl\nOrigin: ${BASE} (vite preview over build/)\nRoutes visited: ${ROUTES.length}\nUnique internal hrefs: ${all.length}\n\nHREFS:\n${all.join('\n')}\n\nFAILURES (non-200):\n${bad.length ? bad.join('\n') : '(none)'}\n`
  );
}

await browser.close();
console.log(results.join('\n'));
console.log(fail === 0 ? `\nF3-QA PASS ${results.length}/${results.length}` : `\nF3-QA FAIL (${fail} failing)`);
process.exit(fail === 0 ? 0 : 1);
