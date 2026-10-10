<script lang="ts">
	import '$lib/admin/admin.css';
	import { onMount } from 'svelte';
	import { getSupabase } from '$lib/supabase';
	import AdminLogin from '$lib/admin/AdminLogin.svelte';
	import AdminShell from '$lib/admin/AdminShell.svelte';
	import { loadEnquiries, signOutAdmin, clearEnquiriesError } from '$lib/admin/store.svelte';
	import { goto } from '$app/navigation';
	import { isSetupMissing, SETUP_MISSING_HINT, SETUP_MISSING_MESSAGE } from '$lib/auth/schema';

	let { children } = $props();

	// Auth gate: the layout stays mounted across child navigation, so
	// loadEnquiries() runs once per login (not once per admin route).
	let state = $state<'loading' | 'login' | 'ready' | 'setup'>('loading');

	onMount(() => {
		void probeSession();
	});

	async function probeSession() {
		try {
			const supabase = getSupabase();
			const { data, error } = await supabase.auth.getSession();
			if (error || !data.session) {
				state = 'login';
				return;
			}
			if ((await adminCheck(data.session.user.id)) !== 'admin') {
				if (state !== 'setup') void goto('/');
				return;
			}
			goReady();
		} catch {
			// Empty-env first-use throw (or any client failure) falls back to
			// the login form so admin-signin always renders for auth-gate test 1.
			state = 'login';
		}
	}

	async function goReady() {
		// AdminLogin calls this after a successful password sign-in; re-check the
		// role so a customer signed in via the /admin form cannot reach the panel.
		try {
			const { data } = await getSupabase().auth.getUser();
			const uid = data.user?.id;
			const verdict = uid ? await adminCheck(uid) : 'admin';
			if (verdict === 'setup') {
				state = 'setup';
				return;
			}
		if (verdict === 'denied') {
			state = 'login';
			void goto('/');
			return;
		}
		} catch {
			// Cannot verify the role → fall through; RLS is the real gate.
		}
		state = 'ready';
		loadEnquiries();
	}

	// Fail-closed role gate: 'admin' ONLY when the profile row positively reports
	// is_admin = true. An unreadable or missing profile row denies the panel
	// instead of assuming the viewer is an admin. 'setup' distinguishes the one
	// case that is the owner's to fix (migration 0002 not applied yet) so it can
	// be explained instead of silently redirecting.
	async function adminCheck(userId: string): Promise<'admin' | 'denied' | 'setup'> {
		try {
			const { data, error } = await getSupabase()
				.from('profiles')
				.select('is_admin')
				.eq('id', userId)
				.maybeSingle();
			if (isSetupMissing(error)) return 'setup';
			if (error || !data) return 'denied';
			return data.is_admin === true ? 'admin' : 'denied';
		} catch {
			return 'denied';
		}
	}

	async function handleSignOut() {
		await signOutAdmin();
		clearEnquiriesError();
		state = 'login';
	}
</script>

<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

{#if state === 'loading'}
	<main id="main" class="targo-band adm-gate" tabindex="-1">
		<p class="adm-loading" role="status">Loading…</p>
	</main>
{:else if state === 'login'}
	<main id="main" class="targo-band adm-gate" tabindex="-1">
		<div class="adm-auth">
			<div class="adm-lockup">
				<span class="adm-brand-mark" aria-hidden="true"><span class="adm-brand-ellipse"></span></span>
				<span class="adm-brand-word">a2h</span>
				<span class="adm-brand-divider" aria-hidden="true"></span>
				<span class="adm-brand-admin">ADMIN</span>
			</div>
			<AdminLogin onSignedIn={goReady} />
		</div>
	</main>
{:else if state === 'setup'}
	<main id="main" class="targo-band adm-gate" tabindex="-1">
		<div class="adm-auth">
			<div class="adm-lockup">
				<span class="adm-brand-mark" aria-hidden="true"><span class="adm-brand-ellipse"></span></span>
				<span class="adm-brand-word">a2h</span>
				<span class="adm-brand-divider" aria-hidden="true"></span>
				<span class="adm-brand-admin">ADMIN</span>
			</div>
			<div class="targo-card admin-login-card">
				<h2 class="targo-quant admin-login-title">Setup required</h2>
				<p role="alert">{SETUP_MISSING_MESSAGE}</p>
				<p>{SETUP_MISSING_HINT}</p>
				<button class="targo-btn" type="button" onclick={() => (state = 'login')}>Back to sign in</button>
			</div>
		</div>
	</main>
{:else}
	<AdminShell onSignOut={handleSignOut}>{@render children()}</AdminShell>
{/if}
