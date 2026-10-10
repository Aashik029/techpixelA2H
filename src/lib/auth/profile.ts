/**
 * Profile data layer: read the caller's own `public.profiles` row. All access
 * is mediated by Supabase RLS ("own row" policies from 0002_customer_auth.sql),
 * so no id is trusted from the caller — the authenticated session is the only
 * source of identity.
 *
 * Prerender-safe: no client is constructed at import time.
 */

import { getSupabase } from '$lib/supabase';

export interface CustomerProfile {
	id: string;
	is_admin: boolean;
	name: string;
	email: string;
	phone: string;
	company: string;
	created_at: string;
}

const PROFILE_COLUMNS = 'id, is_admin, name, email, phone, company, created_at';

export type ProfileResult = { profile: CustomerProfile | null; error: string };

/** Read the signed-in viewer's profile row. */
export async function getMyProfile(): Promise<ProfileResult> {
	try {
		const supabase = getSupabase();
		const {
			data: { user },
			error: userError
		} = await supabase.auth.getUser();
		if (userError || !user) {
			return { profile: null, error: userError?.message ?? 'Not signed in' };
		}
		const { data, error } = await supabase
			.from('profiles')
			.select(PROFILE_COLUMNS)
			.eq('id', user.id)
			.maybeSingle();
		if (error) return { profile: null, error: error.message };
		return { profile: (data as CustomerProfile | null) ?? null, error: '' };
	} catch (err) {
		return { profile: null, error: err instanceof Error ? err.message : 'Failed to load profile' };
	}
}
