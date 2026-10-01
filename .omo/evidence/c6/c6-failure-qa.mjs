import { chromium } from 'playwright';

const BASE = process.env.C6_BASE ?? 'http://127.0.0.1:4173';
const results = [];
let fail = 0;
const check = (name, ok, detail = '') => {
  results.push(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`);
  if (!ok) fail++;
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ reducedMotion: 'reduce' });
const page = await ctx.newPage();

await page.goto(BASE + '/', { waitUntil: 'load' });
await page.waitForTimeout(2500);

const heroPaused = await page.$eval('.targo-hero-media video', (v) => v.paused).catch(() => 'no-video');
check('reduced-motion hero does not autoplay', heroPaused === true, `paused=${heroPaused}`);

const heroToggle = await page.$('[data-testid="hero-video-toggle"]');
check('hero pause control present', heroToggle !== null);
if (heroToggle) {
  check('hero toggle reads Play under reduced-motion', ((await heroToggle.textContent()) ?? '').trim() === 'Play');
  const box = await heroToggle.boundingBox();
  check('hero toggle >=24x24', !!box && box.width >= 24 && box.height >= 24, JSON.stringify(box));
  await heroToggle.click();
  await page.waitForTimeout(800);
  const truthful = await page.evaluate(() => {
    const v = document.querySelector('.targo-hero-media video');
    const b = document.querySelector('[data-testid="hero-video-toggle"]');
    const label = (b.textContent ?? '').trim();
    return { paused: v.paused, label, consistent: (label === 'Pause') === !v.paused };
  });
  check(
    'hero toggle stays truthful after click (headless mp4 may not decode)',
    truthful.consistent,
    JSON.stringify(truthful)
  );
}

const aboutToggle = await page.$('[data-testid="about-video-toggle"]');
check('about pause control present', aboutToggle !== null);
if (aboutToggle) {
  const box = await aboutToggle.boundingBox();
  check('about toggle >=24x24', !!box && box.width >= 24 && box.height >= 24, JSON.stringify(box));
}
// About video is lazy (IntersectionObserver): scroll into view, must STAY paused under reduced-motion
await aboutToggle?.scrollIntoViewIfNeeded();
await page.waitForTimeout(2500);
const aboutPaused = await page.$eval('.targo-about-right video, .targo-video-wrap video', (v) => v.paused).catch(() => 'no-video');
check('reduced-motion about does not autoplay after scroll', aboutPaused === true, `paused=${aboutPaused}`);

console.log(results.join('\n'));
console.log(fail === 0 ? 'C6-FAILURE-QA PASS' : `C6-FAILURE-QA FAIL (${fail})`);
await browser.close();
process.exit(fail === 0 ? 0 : 1);
