import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public';

// Testable seam: pure function of its inputs. The unit probe calls this
// directly with '' values; the singleton below is the only production caller.
export function createClient(url: string, key: string): SupabaseClient {
	if (!url || !key) {
		throw new Error(
			'Supabase env missing: set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env'
		);
	}
	return createSupabaseClient(url, key);
}

// Lazy singleton: constructed on first access only, never at module scope.
// The static import chain (+page.svelte -> TargoContact -> enquiries.ts ->
// supabase.ts) executes during prerender, so an import-time throw would break
// `vite build` under an empty .env. First USE throws the single clear error.
let cached: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
	if (cached) return cached;
	cached = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY);
	return cached;
}
