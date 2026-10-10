/**
 * The ONLY Supabase data layer for the admin area (Svelte 5 runes).
 *
 * Prerender-safe: the module only declares `$state` at scope; the client is
 * touched inside the exported functions, never at import time — so static
 * rendering of /admin under an empty .env never constructs a client.
 */

import { getSupabase } from '$lib/supabase';
import type { Enquiry } from './enquiry';

let rows = $state<Enquiry[]>([]);
let loading = $state(false);
let loaded = $state(false);
let error = $state('');

/**
 * Reactive facade. Each member is a getter over the module `$state`, so
 * consumers (and `$derived` that read them) stay reactive — while the
 * `$state` bindings themselves stay private to this module.
 */
export const enquiriesStore = {
	get rows(): Enquiry[] {
		return rows;
	},
	get loading(): boolean {
		return loading;
	},
	get loaded(): boolean {
		return loaded;
	},
	get error(): string {
		return error;
	}
};

/** Load the latest 100 enquiries (same query as the legacy inbox). */
export async function loadEnquiries(): Promise<void> {
	error = '';
	loading = true;
	try {
		const supabase = getSupabase();
		const { data, error: queryError } = await supabase
			.from('enquiries')
			.select('*')
			.order('created_at', { ascending: false })
			.limit(100);
		if (queryError) {
			error = queryError.message;
		} else {
			rows = (data ?? []) as Enquiry[];
			loaded = true;
		}
	} catch (err) {
		error = err instanceof Error ? err.message : 'Failed to load enquiries';
	} finally {
		loading = false;
	}
}

/** Persist a status change, then apply it optimistically to `rows`. */
export async function setEnquiryStatus(id: string, status: 'read' | 'replied'): Promise<void> {
	try {
		const supabase = getSupabase();
		const { error: updateError } = await supabase
			.from('enquiries')
			.update({ status })
			.eq('id', id);
		if (updateError) {
			error = updateError.message;
			return;
		}
		rows = rows.map((r) => (r.id === id ? { ...r, status } : r));
	} catch (err) {
		error = err instanceof Error ? err.message : 'Failed to update status';
	}
}

/** Sign the admin out (the layout flips back to the login gate itself). */
export async function signOutAdmin(): Promise<void> {
	await getSupabase().auth.signOut();
}

/** Reset the sticky error string (used after login/logout transitions). */
export function clearEnquiriesError(): void {
	error = '';
}
