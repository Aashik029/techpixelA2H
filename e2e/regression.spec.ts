/**
 * Regression spec (Phase 0). Ports `scripts/verify-wizard.mjs` assertions
 * to Playwright Test — green on the unmodified build.
 */
import { expect, test } from '@playwright/test';

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

const PROBES: Record<string, string> = {
	'Web Development': 'What kind of website',
	'AI Automation': 'Which tasks should automation',
	'Poster Design': 'What do you need designed',
	'Content Creation': 'What should we create',
	'Digital Marketing': 'What is the main goal',
	'Not sure yet': 'Describe your goal'
};

test.describe('contact wizard', () => {
	test.beforeEach(async ({ page }) => {
		const errors: string[] = [];
		page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
		page.on('console', (m) => {
			if (m.type() === 'error') errors.push('CONSOLE: ' + m.text());
		});
		await page.goto('/#contact', { waitUntil: 'networkidle' });
		await expect(page.locator('#contact').getByText('Step 1 of 4')).toBeVisible();
		// stash collector for the test to assert at the end
		(page as unknown as { __errors: string[] }).__errors = errors;
	});

	test('shows Step 1 of 4 and blocks empty continue', async ({ page }) => {
		await page.locator('#contact').getByRole('button', { name: /next/i }).click();
		await expect(page.locator('#contact [role="alert"]')).toBeVisible();
	});

	test('each service shows its own step-2 questions', async ({ page }) => {
		for (const [svc, probe] of Object.entries(PROBES)) {
			await page.locator('#contact').getByRole('button', { name: svc, exact: true }).click();
			await page.locator('#contact').getByRole('button', { name: /next/i }).click();
			await expect(page.locator('#contact').getByText(probe, { exact: false }).first()).toBeVisible();
			await page.locator('#contact').getByRole('button', { name: /back/i }).click();
		}
	});

	test('happy path reaches success with mailto + whatsapp fallback', async ({ page }) => {
		const errors = (page as unknown as { __errors: string[] }).__errors;
		// Stub the Basin placeholder endpoint (mirrors C5 QA): fail fast with 500
		// so the wizard takes its deterministic mailto/WhatsApp fallback path
		// instead of hanging on a real external POST.
		await page.route('**/usebasin.com/**', (route) =>
			route.fulfill({ status: 500, contentType: 'application/json', body: '{"error":"stubbed"}' })
		);
		await page.locator('#contact').getByRole('button', { name: 'Web Development', exact: true }).click();
		await page.locator('#contact').getByRole('button', { name: /next/i }).click();
		await expect(
			page.locator('#contact').getByText('What kind of website', { exact: false }).first()
		).toBeVisible();
		await page.locator('#contact').getByRole('button', { name: 'E-commerce store' }).click();
		await page.locator('#contact').getByRole('button', { name: '4–8 pages' }).click();
		await page.locator('#contact').getByRole('button', { name: 'Partially' }).click();
		await page.locator('#contact').getByRole('button', { name: /next/i }).click();
		await expect(page.locator('#contact').getByText('Budget range')).toBeVisible();
		await page.locator('#contact').getByRole('button', { name: /Growth/ }).click();
		await page.locator('#contact').getByRole('button', { name: '2–4 weeks' }).click();
		await page.locator('#contact').getByRole('button', { name: /next/i }).click();
		await page.locator('#tc-name').fill('Test User');
		await page.locator('#tc-phone').fill('+919876543210');
		await page.locator('#contact').getByRole('button', { name: /continue/i }).click();

		await expect(page.getByTestId('tc-success')).toBeVisible();
		await expect(page.getByTestId('tc-success').getByText('Thanks — request received')).toBeVisible();
		// Basin placeholder endpoint cannot succeed — fallback path must render.
		await expect(page.getByTestId('tc-fallback')).toBeVisible();
		const mailHref = await page.getByTestId('tc-send-email').getAttribute('href');
		expect(mailHref ?? '').toContain('mailto:');
		const decoded = decodeURIComponent(mailHref ?? '');
		for (const needle of [
			'Test User',
			'919876543210',
			'Web Development',
			'E-commerce store',
			'4–8 pages',
			'Partially',
			'Growth',
			'2–4 weeks'
		]) {
			expect(decoded).toContain(needle);
		}
		const waHref = await page.getByTestId('tc-whatsapp-fallback').getAttribute('href');
		expect(waHref ?? '').toContain('wa.me');
		const realErrors = errors.filter((e) => !e.includes('usebasin.com'));
		expect(realErrors).toEqual([]);
	});
});

test.describe('content routes + sitemap', () => {
	for (const slug of SERVICE_SLUGS) {
		test(`service slug renders: ${slug}`, async ({ page }) => {
			await page.goto(`/services/${slug}`);
			await expect(page.locator('body')).toContainText(/.+/);
		});
	}

	for (const slug of WORK_SLUGS) {
		test(`work slug renders: ${slug}`, async ({ page }) => {
			await page.goto(`/work/${slug}`);
			await expect(page.locator('body')).toContainText(/.+/);
		});
	}

	test('sitemap contains all service + work slugs', async ({ request }) => {
		const res = await request.get('/sitemap.xml');
		expect(res.ok()).toBeTruthy();
		const xml = await res.text();
		for (const slug of [...SERVICE_SLUGS, ...WORK_SLUGS]) {
			expect(xml).toContain(slug);
		}
	});
});
