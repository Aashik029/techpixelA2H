import { describe, expect, test } from 'vitest';
import { createClient } from '../src/lib/supabase';
import {
	PUBLIC_SUPABASE_URL,
	PUBLIC_SUPABASE_PUBLISHABLE_KEY
} from '$env/static/public';

const CONFIGURED = Boolean(PUBLIC_SUPABASE_URL && PUBLIC_SUPABASE_PUBLISHABLE_KEY);

describe('supabase client', () => {
	test.skipIf(!CONFIGURED)('live REST probe returns 200 with the publishable key', async () => {
		const res = await fetch(
			`${PUBLIC_SUPABASE_URL}/rest/v1/enquiries?select=id&limit=1`,
			{ headers: { apikey: PUBLIC_SUPABASE_PUBLISHABLE_KEY } }
		);
		expect(res.status).toBe(200);
	});

	test('empty env throws a single clear error on first use, not at import', () => {
		expect(() => createClient('', '')).toThrow(/Supabase env missing/);
		expect(() => createClient('', 'x')).toThrow(/Supabase env missing/);
		expect(() => createClient('https://example.supabase.co', '')).toThrow(
			/Supabase env missing/
		);
	});
});
