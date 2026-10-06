<script lang="ts">
	import { onMount } from 'svelte';
	import { getSupabase } from '$lib/supabase';
	import AdminLogin from '$lib/admin/AdminLogin.svelte';
	import EnquiriesInbox from '$lib/admin/EnquiriesInbox.svelte';

	let state = $state<'loading' | 'login' | 'inbox'>('loading');

	onMount(async () => {
		try {
			const supabase = getSupabase();
			const { data, error } = await supabase.auth.getSession();
			state = !error && data.session ? 'inbox' : 'login';
		} catch {
			// Empty-env first-use throw (or any client failure) falls back to
			// the login form so admin-signin always renders for auth-gate test 1.
			state = 'login';
		}
	});
</script>

<svelte:head>
	<title>Admin — Tech Pixel A2H</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main id="main" class="targo-band" tabindex="-1">
	{#if state === 'loading'}
		<p>Loading…</p>
	{:else if state === 'login'}
		<AdminLogin onSignedIn={() => (state = 'inbox')} />
	{:else}
		<EnquiriesInbox onSignedOut={() => (state = 'login')} />
	{/if}
</main>
