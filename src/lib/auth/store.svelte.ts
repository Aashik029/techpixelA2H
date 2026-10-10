/**
 * The shared auth session layer (Svelte 5 runes), used by the public navbar,
 * the sign-in page and the enquiry form.
 *
 * Prerender-safe: this module only declares `$state` at scope and touches the
 * Supabase client inside `initAuth()`/`signOut()` — never at import
 * time — so static rendering under an empty .env never constructs a client.
 *
 * It mirrors the admin store pattern: private module `$state` exposed through
 * a getter facade so consumers (and `$derived`) stay reactive.
 */

import { getSupabase } from '$lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

let session = $state<Session | null>(null);
let ready = $state(false);

let viewerName = $state<string | null>(null);
let viewerIsAdmin = $state(false);
let viewerProfileFor = $state<string | null>(null);
let viewerProfileLoading = false;

/** Reactive facade over the module $state — read members, never destructure. */
export const authStore = {
	get session(): Session | null {
		return session;
	},
	get user(): User | null {
		return session?.user ?? null;
	},
	/** True once the initial session probe has settled (found or not). */
	get ready(): boolean {
		return ready;
	},
	get isAuthenticated(): boolean {
		return session !== null;
	},
	get viewerName(): string | null {
		return viewerName;
	},
	/** Presentational only — RLS, not this flag, is what authorizes anything. */
	get isAdmin(): boolean {
		return viewerIsAdmin;
	}
};

let started = false;

/**
 * Start listening to Supabase auth. Safe to call from many components: the
 * guard makes the first call authoritative and subsequent calls no-ops.
 * Resolves `ready` even when the client cannot be constructed (empty env), so
 * gates fall back to the logged-out state rather than hanging.
 */
export function initAuth(): void {
	if (started) return;
	started = true;
	try {
		const supabase = getSupabase();
		supabase.auth
			.getSession()
			.then(({ data }) => {
				session = data.session;
			})
			.catch(() => {
				session = null;
			})
			.finally(() => {
				ready = true;
			});
		supabase.auth.onAuthStateChange((_event, next) => {
			if (next?.user?.id !== viewerProfileFor) {
				viewerName = null;
				viewerIsAdmin = false;
				viewerProfileFor = null;
			}
			session = next;
			ready = true;
		});
	} catch {
		// Empty-env first-use throw: settle to logged-out.
		session = null;
		ready = true;
	}
}

/** Sign the viewer out. onAuthStateChange clears the session reactively. */
export async function signOut(): Promise<void> {
	await getSupabase().auth.signOut();
}

/**
 * Load the viewer's own profile row (display name + is_admin) for the navbar.
 * Idempotent per user and a no-op while signed out, so components can call it
 * freely from an $effect. Never throws; a failed read just leaves the chip on
 * the email fallback.
 */
export async function ensureViewerProfile(): Promise<void> {
	const user = authStore.user;
	if (!user) {
		viewerName = null;
		viewerIsAdmin = false;
		viewerProfileFor = null;
		return;
	}
	if (viewerProfileFor === user.id || viewerProfileLoading) return;
	viewerProfileLoading = true;
	try {
		const { data } = await getSupabase()
			.from('profiles')
			.select('name, is_admin')
			.eq('id', user.id)
			.maybeSingle();
		if (authStore.user?.id !== user.id) return;
		const meta = user.user_metadata?.name;
		const metaName = typeof meta === 'string' ? meta.trim() : '';
		const profileName = typeof data?.name === 'string' ? data.name.trim() : '';
		viewerName = profileName || metaName || null;
		viewerIsAdmin = data?.is_admin === true;
		viewerProfileFor = user.id;
	} catch {
		// Unreachable profile row: keep the email/initial fallback.
	} finally {
		viewerProfileLoading = false;
	}
}

/**
 * Where a freshly authenticated viewer belongs. Fail-closed: `/admin` is only
 * ever returned when the profile row positively reports is_admin = true; an
 * unreadable, missing or non-admin profile resolves to null so the caller can
 * reject the sign-in instead of routing anyone anywhere. Never throws.
 */
export async function resolveLandingPath(): Promise<'/admin' | null> {
	try {
		const { data: userData } = await getSupabase().auth.getUser();
		const uid = userData.user?.id;
		if (!uid) return null;
		const { data, error } = await getSupabase()
			.from('profiles')
			.select('is_admin')
			.eq('id', uid)
			.maybeSingle();
		if (error || !data) return null;
		return data.is_admin === true ? '/admin' : null;
	} catch {
		return null;
	}
}
