/**
 * Admin auth-gate spec (Phase 3, T3.1). Proves /admin is a statically-served
 * route whose inbox is visible only to the authenticated admin:
 *   - signed out  -> login form visible, inbox absent
 *   - wrong pw    -> error shown, still signed out
 *   - correct     -> inbox table visible with >= 1 row
 *   - status flip -> row updates; sign out -> back to login
 *   - sitemap.xml -> contains no /admin URL
 *
 * The admin area is a multi-route dashboard (T3): /admin (overview),
 * /admin/enquiries (inbox table + detail drawer), /admin/analytics and
 * /admin/settings. The auth gate lives in src/routes/admin/+layout.svelte,
 * so EVERY admin route shows the sign-in form until a session exists.
 */
import { expect, test } from '@playwright/test';

test.describe('/admin auth gate + inbox', () => {
	test('signed out sees login only; wrong password errors', async ({ page }) => {
		await page.goto('/admin', { waitUntil: 'networkidle' });
		await expect(page.locator('[data-testid="admin-signin"]')).toBeVisible();
		await expect(page.locator('[data-testid="admin-inbox"]')).toHaveCount(0);

		await page.locator('[data-testid="admin-email"]').fill('nobody@example.com');
		await page.locator('[data-testid="admin-password"]').fill('wrong-password');
		await page.locator('[data-testid="admin-signin"]').click();
		await expect(page.locator('[data-testid="admin-error"]')).toBeVisible();
		await expect(page.locator('[data-testid="admin-inbox"]')).toHaveCount(0);
	});

	test('correct credentials open the inbox; status flip + sign out work', async ({ page }) => {
		const email = process.env.E2E_ADMIN_EMAIL ?? '';
		const password = process.env.E2E_ADMIN_PASSWORD ?? '';
		test.skip(!email || !password, 'Supabase E2E admin env not configured (.env)');

		// The inbox now lives at /admin/enquiries; the layout gate shows the
		// sign-in form on that route until authenticated.
		await page.goto('/admin/enquiries', { waitUntil: 'networkidle' });
		await page.locator('[data-testid="admin-email"]').fill(email);
		await page.locator('[data-testid="admin-password"]').fill(password);
		await page.locator('[data-testid="admin-signin"]').click();

		const inbox = page.locator('[data-testid="admin-inbox"]');
		await expect(inbox).toBeVisible();
		const rows = inbox.locator('[data-testid="admin-row"]');
		expect(await rows.count()).toBeGreaterThan(0);

		// flip the first row to read, assert the badge follows
		const first = rows.first();
		await first.locator('[data-testid="admin-mark-read"]').click();
		await expect(first.getByText(/^read$/i)).toBeVisible();

		// sign out returns to the login form
		await page.locator('[data-testid="admin-signout"]').click();
		await expect(page.locator('[data-testid="admin-signin"]')).toBeVisible();
		await expect(page.locator('[data-testid="admin-inbox"]')).toHaveCount(0);
	});

	test('sitemap excludes /admin', async ({ page }) => {
		const res = await page.goto('/sitemap.xml');
		expect(res?.status()).toBe(200);
		const body = (await page.content()).toLowerCase();
		expect(body).not.toContain('/admin');
	});
});
