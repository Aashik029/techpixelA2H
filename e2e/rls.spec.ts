/**
 * RLS spec (Phase 1, T1.1). Proves the enquiries access contract directly
 * against the Supabase REST API:
 *   - anon POST  -> 201 (public contact form may insert)
 *   - anon GET   -> zero rows (nobody may read leads without admin auth)
 *   - admin GET  -> rows visible; PATCH status -> 204, then restored to 'new'
 *
 * Skips cleanly when Supabase env is absent. RED until migration
 * 0001_enquiries.sql is applied and the admin user is bootstrapped.
 */
import { expect, request, test } from '@playwright/test';

const URL = process.env.PUBLIC_SUPABASE_URL ?? '';
const ANON = process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '';
const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL ?? '';
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? '';

const CONFIGURED = Boolean(URL && ANON && ADMIN_EMAIL && ADMIN_PASSWORD);

test.describe('enquiries RLS contract', () => {
	test.skip(!CONFIGURED, 'Supabase E2E env not configured (.env)');

	test('anon can insert but cannot read; admin can read + update', async () => {
		const api = await request.newContext({
			baseURL: URL,
			extraHTTPHeaders: { apikey: ANON, 'Content-Type': 'application/json' }
		});

		const marker = `E2E RLS ${Date.now()}`;

		// 1. anon insert -> 201 (return=minimal: no body; RETURNING would
		// require an anon SELECT policy, which is forbidden - leads stay
		// write-only for anon)
		const post = await api.post('/rest/v1/enquiries', {
			headers: { Prefer: 'return=minimal' },
			data: {
				name: marker,
				phone: '+91 90000 00000',
				service: 'Web Development',
				answers: { probe: 'rls-contract' },
				budget: 'E2E',
				timeline: 'E2E',
				subject: `RLS probe ${marker}`,
				message: 'RLS contract probe row — safe to ignore.'
			}
		});
	expect(post.status(), 'anon insert must succeed (201)').toBe(201);
	// return=minimal sends no body: resolve the probe row via the admin read
	// (admin GET moved above the anon DELETE because row.id no longer comes
	// from the POST body)
	const tokenRes = await api.post('/auth/v1/token?grant_type=password', {
		data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD }
	});
	expect(tokenRes.status(), 'admin sign-in must succeed').toBe(200);
	const { access_token } = await tokenRes.json();

	const adminGet = await api.get(
		`/rest/v1/enquiries?name=eq.${encodeURIComponent(marker)}&select=id,status`,
		{ headers: { Authorization: `Bearer ${access_token}` } }
	);
	expect(adminGet.status()).toBe(200);
	const found = await adminGet.json();
	expect(found.length, 'admin must see the probe row').toBeGreaterThan(0);
	expect(found[0].status, 'probe row lands as new').toBe('new');
	const probeId = found[0].id;

		// 2. anon read -> must reveal nothing
		const anonGet = await api.get('/rest/v1/enquiries?select=id&limit=5');
		if (anonGet.status() === 200) {
			const rows = await anonGet.json();
			expect(rows, 'anon GET must return zero rows').toEqual([]);
		} else {
			expect([401, 403, 404]).toContain(anonGet.status());
		}

	// 3. anon delete/update must be denied
	const anonDelete = await api.delete(`/rest/v1/enquiries?id=eq.${probeId}`);
	expect([401, 403, 404]).toContain(anonDelete.status());

	// 4. admin update (read row already resolved above)
	const patch = await api.patch(`/rest/v1/enquiries?id=eq.${probeId}`, {
		headers: { Authorization: `Bearer ${access_token}` },
		data: { status: 'read' }
	});
	expect([200, 204]).toContain(patch.status());

	// restore to 'new' so the probe row is indistinguishable from fresh leads
	await api.patch(`/rest/v1/enquiries?id=eq.${probeId}`, {
		headers: { Authorization: `Bearer ${access_token}` },
		data: { status: 'new' }
	});

		await api.dispose();
	});
});
