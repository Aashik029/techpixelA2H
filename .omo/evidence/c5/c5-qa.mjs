import { chromium } from 'playwright';

const BASE = process.env.C5_BASE || 'http://127.0.0.1:4173';
const BASIN_GLOB = '**/usebasin.com/**';
const results = [];
function ok(name, pass, detail = '') {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
}

// Fill the wizard through to the final submit using the "Not sure yet" path
// (step 2 = single required text question).
async function driveToSubmit(page) {
  await page.goto(BASE + '/#contact', { waitUntil: 'load' });
  await page.evaluate(() => document.querySelector('#contact')?.scrollIntoView());
  // Step 1: pick "Not sure yet" via the C3 dropdown (select)
  await page.selectOption('[data-testid="tc-service-select"]', 'Not sure yet');
  await page.click('[data-testid="tc-continue"]');
  // Step 2: goal_text textarea
  await page.fill('textarea#tc-q-goal_text', 'I run a textile shop and want more Instagram customers');
  await page.click('[data-testid="tc-continue"]');
  // Step 3: first budget + first timeline buttons
  await page.getByRole('group', { name: 'Budget range *' }).getByRole('button').first().click();
  await page.getByRole('group', { name: 'Timeline *' }).getByRole('button').first().click();
  await page.click('[data-testid="tc-continue"]');
  // Step 4: name + phone
  await page.fill('#tc-name', 'Priya Sharma');
  await page.fill('#tc-phone', '+919597796186');
}

const browser = await chromium.launch();

// ---- Run 1: happy 200 ----
{
  const page = await browser.newPage();
  let basinHit = false;
  await page.route(BASIN_GLOB, (route) => {
    basinHit = true;
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });
  await driveToSubmit(page);
  await page.click('[data-testid="tc-continue"]');
  await page.waitForSelector('[data-testid="tc-success"]', { timeout: 8000 });
  const status = (await page.textContent('[data-testid="tc-submit-status"]')) ?? '';
  ok('happy-200: success state shown', true);
  ok('happy-200: Basin intercepted', basinHit);
  ok(
    'happy-200: hosted-received copy (basinSent)',
    status.includes("We've received your brief"),
    status.slice(0, 80)
  );
  await page.screenshot({ path: '.omo/evidence/c5/happy-200.png' });
  await page.close();
}

// ---- Run 2: failure 500 -> fallback intact ----
{
  const page = await browser.newPage();
  await page.route(BASIN_GLOB, (route) =>
    route.fulfill({ status: 500, contentType: 'application/json', body: '{"error":1}' })
  );
  await driveToSubmit(page);
  await page.click('[data-testid="tc-continue"]');
  await page.waitForSelector('[data-testid="tc-success"]', { timeout: 8000 });
  const status = (await page.textContent('[data-testid="tc-submit-status"]')) ?? '';
  const mailHref = (await page.getAttribute('[data-testid="tc-send-email"]', 'href')) ?? '';
  const waHref = (await page.getAttribute('[data-testid="tc-whatsapp-fallback"]', 'href')) ?? '';
  ok('fail-500: success state shown', true);
  ok('fail-500: fallback copy shown', status.includes("didn't go through"), status.slice(0, 80));
  ok('fail-500: mailto composed + non-empty', mailHref.startsWith('mailto:') && mailHref.includes('Priya%20Sharma'), mailHref.slice(0, 60));
  ok('fail-500: whatsapp fallback intact', waHref.includes('wa.me/919597796186'), waHref.slice(0, 60));
  await page.screenshot({ path: '.omo/evidence/c5/failure-500.png' });
  await page.close();
}

// ---- Run 3: failure abort -> fallback intact ----
{
  const page = await browser.newPage();
  await page.route(BASIN_GLOB, (route) => route.abort());
  await driveToSubmit(page);
  await page.click('[data-testid="tc-continue"]');
  await page.waitForSelector('[data-testid="tc-success"]', { timeout: 8000 });
  const status = (await page.textContent('[data-testid="tc-submit-status"]')) ?? '';
  const mailHref = (await page.getAttribute('[data-testid="tc-send-email"]', 'href')) ?? '';
  const waHref = (await page.getAttribute('[data-testid="tc-whatsapp-fallback"]', 'href')) ?? '';
  ok('fail-abort: success state shown', true);
  ok('fail-abort: fallback copy shown', status.includes("didn't go through"), status.slice(0, 80));
  ok('fail-abort: mailto composed + non-empty', mailHref.startsWith('mailto:') && mailHref.includes('Priya%20Sharma'), mailHref.slice(0, 60));
  ok('fail-abort: whatsapp fallback intact', waHref.includes('wa.me/919597796186'), waHref.slice(0, 60));
  await page.screenshot({ path: '.omo/evidence/c5/failure-abort.png' });
  await page.close();
}

// ---- Run 4: consent gate ----
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const plausRequests = [];
  page.on('request', (r) => {
    if (/plausible/i.test(r.url())) plausRequests.push(r.url());
  });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const scriptPre = await page.$('script[data-targo-plausible]');
  const bannerVisible = await page.isVisible('[data-testid="tc-consent-banner"]');
  ok('consent: ZERO plausible requests pre-consent', plausRequests.length === 0, `${plausRequests.length} requests`);
  ok('consent: NO plausible script pre-consent', scriptPre === null);
  ok('consent: banner visible by default (default-deny)', bannerVisible);
  await page.click('[data-testid="tc-consent-accept"]');
  await page.waitForFunction(() => !!document.querySelector('script[data-targo-plausible]'), null, { timeout: 5000 });
  ok('consent: plausible script present only after Accept', true);
  const flag = await page.evaluate(() => localStorage.getItem('targo-consent'));
  ok('consent: localStorage flag set', flag === 'accepted', String(flag));
  await page.reload({ waitUntil: 'networkidle' });
  const flagAfter = await page.evaluate(() => localStorage.getItem('targo-consent'));
  const scriptAfter = await page.$('script[data-targo-plausible]');
  ok('consent: flag persists after reload', flagAfter === 'accepted', String(flagAfter));
  ok('consent: plausible auto-loads after reload with stored accept', scriptAfter !== null);
  const bannerAfter = await page.isVisible('[data-testid="tc-consent-banner"]').catch(() => false);
  ok('consent: banner hidden after stored choice', bannerAfter === false);
  await page.screenshot({ path: '.omo/evidence/c5/consent-post-accept.png' });
  await ctx.close();
}

// ---- Run 5: no-JS contact path ----
{
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(BASE + '/#contact', { waitUntil: 'load' });
  const html = await page.content();
  const telCount = (html.match(/href="tel:/g) || []).length;
  const mailCount = (html.match(/href="mailto:/g) || []).length;
  const waCount = (html.match(/wa\.me/g) || []).length;
  const emptyMailto = (html.match(/href=""|href="mailto:"/g) || []).length;
  ok('nojs: >=1 working contact path', telCount + mailCount + waCount >= 1, `tel=${telCount} mailto=${mailCount} wa=${waCount}`);
  ok('nojs: ZERO empty mailto hrefs', emptyMailto === 0, `${emptyMailto} empty`);
  await page.screenshot({ path: '.omo/evidence/c5/nojs-contact.png' });
  await ctx.close();
}

await browser.close();
const failed = results.filter((r) => !r.pass);
console.log(`\nC5-QA ${failed.length === 0 ? 'PASS' : 'FAIL'} ${results.length - failed.length}/${results.length}`);
process.exit(failed.length === 0 ? 0 : 1);
