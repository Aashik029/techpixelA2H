import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.C6_BASE ?? 'http://127.0.0.1:4173';
const OUT = join(process.cwd(), 'static', 'og');
mkdirSync(OUT, { recursive: true });

const SERVICE_SLUGS = [
  'web-development',
  'ai-automation',
  'poster-design',
  'content-creation',
  'digital-marketing'
];
const WORK_SLUGS = [
  'local-store-online',
  'team-workspace',
  'hrms-concept',
  'festival-posters',
  'seo-blog-system',
  'growth-campaign'
];

const TARGETS = [
  ['/', 'home.png'],
  ['/about', 'about.png'],
  ['/privacy', 'privacy.png'],
  ['/terms', 'terms.png'],
  ['/services', 'services.png'],
  ['/work', 'work.png'],
  ...SERVICE_SLUGS.map((s) => [`/services/${s}`, `services-${s}.png`]),
  ...WORK_SLUGS.map((s) => [`/work/${s}`, `work-${s}.png`])
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
let fail = 0;
for (const [route, file] of TARGETS) {
  const res = await page.goto(BASE + route, { waitUntil: 'load' });
  if (res?.status() !== 200) {
    console.log(`FAIL ${route} status=${res?.status()}`);
    fail++;
    continue;
  }
  await page.waitForTimeout(800);
  await page.screenshot({ path: join(OUT, file) });
  console.log(`PASS ${route} -> ${file}`);
}
await browser.close();
console.log(fail === 0 ? 'C6-OG-CAPTURE PASS' : `C6-OG-CAPTURE FAIL (${fail})`);
process.exit(fail === 0 ? 0 : 1);
