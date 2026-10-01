import { chromium } from 'playwright';
import { spawn } from 'node:child_process';

const preview = spawn('npm', ['run', 'preview', '--', '--port', '4176', '--strictPort'], { cwd: 'D:\\pixel', shell: true });
await new Promise((r) => setTimeout(r, 8000));
const BASE = 'http://localhost:4176';

const b = await chromium.launch();
const page = await b.newPage();
const step_text = async () => await page.locator('#contact .targo-card').first().textContent().then(t => (t ?? '').slice(0, 200));
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await page.locator('#contact').scrollIntoViewIfNeeded();
console.log('STEP1:', JSON.stringify(await step_text()));
const opts = await page.locator('#tc-service-select option').allTextContents();
console.log('OPTIONS:', JSON.stringify(opts));
await page.locator('#tc-service-select').selectOption({ label: 'Web Development' });
await page.getByTestId('tc-continue').click();
await page.waitForTimeout(800);
console.log('STEP2:', JSON.stringify(await step_text()));
const groups = page.locator('#contact [role="group"]');
console.log('GROUPS step2:', await groups.count());
for (let g = 0; g < await groups.count(); g++) {
  const first = groups.nth(g).locator('button[type="button"]').first();
  if ((await first.count()) > 0) { await first.click(); await page.waitForTimeout(200); }
}
const areas = page.locator('#contact textarea');
for (let a = 0; a < await areas.count(); a++) await areas.nth(a).fill('test details');
await page.getByTestId('tc-continue').click();
await page.waitForTimeout(800);
console.log('STEP3:', JSON.stringify(await step_text()));
const groups3 = page.locator('#contact [role="group"]');
console.log('GROUPS step3:', await groups3.count());
for (let g = 0; g < await groups3.count(); g++) {
  const first = groups3.nth(g).locator('button[type="button"]').first();
  if ((await first.count()) > 0) { await first.click(); await page.waitForTimeout(200); }
}
await page.getByTestId('tc-continue').click();
await page.waitForTimeout(800);
console.log('STEP4:', JSON.stringify(await step_text()));
console.log('tc-name count:', await page.locator('#tc-name').count());
await page.screenshot({ path: '.omo/evidence/c5/debug-step.png' });
await b.close();
preview.kill();
