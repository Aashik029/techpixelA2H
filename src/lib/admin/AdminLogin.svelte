<script lang="ts">
	import { getSupabase } from '$lib/supabase';

	let { onSignedIn }: { onSignedIn: () => void } = $props();

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let busy = $state(false);

	async function signIn() {
		error = '';
		busy = true;
		try {
			const supabase = getSupabase();
			const { error: authError } = await supabase.auth.signInWithPassword({
				email,
				password
			});
			if (authError) {
				error = authError.message;
			} else {
				onSignedIn();
			}
		} catch (err) {
			// Includes the A2 empty-env first-use throw: always surface it as
			// admin-error so auth-gate test 1 passes even without env.
			error = err instanceof Error ? err.message : 'Sign-in failed';
		} finally {
			busy = false;
		}
	}
</script>

<form class="targo-card" onsubmit={(e) => e.preventDefault()}>
	<h2 class="targo-quant">Admin sign in</h2>
	<label class="targo-field-label" for="admin-email">Email</label>
	<input
		id="admin-email"
		data-testid="admin-email"
		class="targo-field"
		type="email"
		autocomplete="username"
		bind:value={email}
		required
	/>
	<label class="targo-field-label" for="admin-password">Password</label>
	<input
		id="admin-password"
		data-testid="admin-password"
		class="targo-field"
		type="password"
		autocomplete="current-password"
		bind:value={password}
		required
	/>
	{#if error}
		<p data-testid="admin-error" role="alert">{error}</p>
	{/if}
	<button
		data-testid="admin-signin"
		class="targo-btn"
		type="submit"
		disabled={busy}
		onclick={signIn}
	>
		{busy ? 'Signing in…' : 'Sign in'}
	</button>
</form>
