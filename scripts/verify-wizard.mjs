import { chromium } from 'playwright';

const errors = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });

await page.goto('http://localhost:4173/#contact', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
const out = [];

// step 1 visible, progress shows Step 1 of 4
out.push('step1-progress=' + await page.textContent('#contact [role="progressbar"] ~ *, #contact div').catch(() => '?'));
const prog = await page.locator('#contact').getByText('Step 1 of 4').count();
out.push('shows-Step-1-of-4=' + (prog > 0));

// Next without choosing -> error
await page.locator('#contact').getByRole('button', { name: /next/i }).click();
await page.waitForTimeout(300);
out.push('empty-step1-error=' + (await page.locator('#contact [role="alert"]').count() > 0));

// each service shows its own step-2 questions
const probes = {
  'Web Development': 'What kind of website',
  'AI Automation': 'Which tasks should automation',
  'Poster Design': 'What do you need designed',
  'Content Creation': 'What should we create',
  'Digital Marketing': 'What is the main goal',
  'Not sure yet': 'Describe your goal'
};
for (const [svc, probe] of Object.entries(probes)) {
  await page.locator('#contact').getByRole('button', { name: svc, exact: true }).click();
  await page.locator('#contact').getByRole('button', { name: /next/i }).click();
  await page.waitForTimeout(300);
  const seen = await page.locator('#contact').getByText(probe, { exact: false }).count();
  out.push(`${svc} => probe-visible=${seen > 0}`);
  await page.locator('#contact').getByRole('button', { name: /back/i }).click();
  await page.waitForTimeout(300);
}

// full run: Web Development path
await page.locator('#contact').getByRole('button', { name: 'Web Development', exact: true }).click();
await page.locator('#contact').getByRole('button', { name: /next/i }).click();
await page.waitForTimeout(300);
await page.locator('#contact').getByRole('button', { name: 'E-commerce store' }).click();
await page.locator('#contact').getByRole('button', { name: '4–8 pages' }).click();
await page.locator('#contact').getByRole('button', { name: 'Partially' }).click();
await page.locator('#contact').getByRole('button', { name: /next/i }).click();
await page.waitForTimeout(300);
out.push('step3-budget-visible=' + (await page.locator('#contact').getByText('Budget range').count() > 0));
await page.locator('#contact').getByRole('button', { name: /Growth/ }).click();
await page.locator('#contact').getByRole('button', { name: '2–4 weeks' }).click();
await page.locator('#contact').getByRole('button', { name: /next/i }).click();
await page.waitForTimeout(300);
await page.locator('#tc-name').fill('Test User');
await page.locator('#tc-phone').fill('+919876543210');
await page.locator('#contact').getByRole('button', { name: /continue/i }).click();
await page.waitForTimeout(500);
const success = await page.locator('#contact').getByText('Thanks — request received').count();
const mailHref = await page.locator('#contact').getByRole('link', { name: 'Send via Email' }).getAttribute('href');
out.push('success-panel=' + (success > 0));
out.push('mailto-starts=' + (mailHref || '').slice(0, 30));
const decoded = decodeURIComponent(mailHref || '');
for (const needle of ['Test User', '919876543210', 'Web Development', 'E-commerce store', '4–8 pages', 'Partially', 'Growth', '2–4 weeks']) {
  out.push(`mailto-has[${needle}]=${decoded.includes(needle)}`);
}

console.log(out.join('\n'));
console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'NO-PAGE-ERRORS');
await browser.close();
if (errors.length) process.exit(1);
