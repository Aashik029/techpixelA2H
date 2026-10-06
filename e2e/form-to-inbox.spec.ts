/**
 * Form-to-inbox spec (Phase 2, T2.1). Full wizard submit with a distinctive
 * name, then asserts the lead row landed in Supabase with status 'new' and
 * every field intact.
 *
 * FIXME: requires the Supabase-backed submit (T2.3). Marked fixme until the
 * wizard posts to enquiries instead of the Basin placeholder — un-mark when
 * T2 lands, then this must go green.
 */
import { expect, request, test } from '@playwright/test';

const URL = process.env.PUBLIC_SUPABASE_URL ?? '';
const ANON = process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '';
const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL ?? '';
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? '';

const CONFIGURED = Boolean(URL && ANON && ADMIN_EMAIL && ADMIN_PASSWORD);

test.describe('wizard submit lands in enquiries inbox', () => {
	test.skip(!CONFIGURED, 'Supabase E2E env not configured (.env)');
	test.fixme(true, 'requires Supabase-backed submit (T2.3) — un-mark when it lands');

	test('full submit creates a status=new row with all fields', async ({ page }) => {
		const marker = `E2E Inbox ${Date.now()}`;

		await page.goto('/#contact', { waitUntil: 'networkidle' });
		const contact = page.locator('#contact');

		// Step 1: pick a service, continue
		await contact.getByRole('button', { name: 'Web Development', exact: true }).click();
		await contact.getByRole('button', { name: /next/i }).click();

		// Step 2: answer the service questions via their option buttons
		// (Web Development follow-ups are multi/single buttons only — no textboxes)
		await contact.getByRole('button', { name: 'E-commerce store' }).click();
		await contact.getByRole('button', { name: '4–8 pages' }).click();
		await contact.getByRole('button', { name: 'Partially' }).click();
		await contact.getByRole('button', { name: /next/i }).click();

		// Step 3: budget + timeline (required — validate(3) blocks on empty)
		await contact.getByRole('button', { name: /Growth/ }).click();
		await contact.getByRole('button', { name: '2–4 weeks' }).click();
		await contact.getByRole('button', { name: /next/i }).click();

		// Step 4: identity
		await contact.getByLabel(/name/i).fill(marker);
		await contact.getByLabel(/phone/i).fill('+91 90000 00000');
		await contact.getByRole('button', { name: /continue/i }).click();

		// Success branch: the "received" status, not the fallback branch
		await expect(contact.locator('[data-testid="tc-success"]')).toBeVisible();
		const status = await contact.locator('[data-testid="tc-submit-status"]').textContent();
		expect(status ?? '').toMatch(/received/i);

		// Admin REST: the row exists with status 'new' and all fields intact
		const api = await request.newContext({
			baseURL: URL,
			extraHTTPHeaders: { apikey: ANON, 'Content-Type': 'application/json' }
		});
		const tokenRes = await api.post('/auth/v1/token?grant_type=password', {
			data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD }
		});
		expect(tokenRes.status()).toBe(200);
		const { access_token } = await tokenRes.json();

		const get = await api.get(
			`/rest/v1/enquiries?name=eq.${encodeURIComponent(marker)}&select=name,phone,service,budget,timeline,subject,message,status`,
			{ headers: { Authorization: `Bearer ${access_token}` } }
		);
		expect(get.status()).toBe(200);
		const [lead] = await get.json();
		expect(lead.status).toBe('new');
		expect(lead.service).toBe('Web Development');
		expect(lead.message.length).toBeGreaterThan(0);
		await api.dispose();
	});
});
