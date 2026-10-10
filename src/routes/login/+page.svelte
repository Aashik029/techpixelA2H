<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { getSupabase } from '$lib/supabase';
	import { initAuth, authStore, resolveLandingPath, signOut } from '$lib/auth/store.svelte';
	import TargoNav from '$lib/components/TargoNav.svelte';

	/**
	 * Admin sign-in, forgot-password and password recovery in one prerendered
	 * route: no SSR, so Supabase / window / location are only ever touched
	 * inside onMount or event handlers — never at module scope. Sign-in is
	 * fail-closed: only is_admin = true sessions are routed on; every other
	 * account is signed back out with an explanatory error.
	 */

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let busy = $state(false);

	let showForgot = $state(false);
	let forgotEmail = $state('');
	let forgotBusy = $state(false);
	let forgotStatus = $state('');

	let recoveryMode = $state(false);
	let recoveryPassword = $state('');
	let recoveryConfirm = $state('');
	let recoveryBusy = $state(false);

	// Start (and keep) the shared auth session listener.
	onMount(() => initAuth());
	// Recovery links land on /login#access_token=…&type=recovery — inspect the
	// hash only here so the prerendered build never touches `window`. The
	// hashchange listener also covers a same-document hash update (a second
	// visit to the route that does not remount it).
	onMount(() => {
		const syncRecovery = () => {
			recoveryMode = window.location.hash.includes('type=recovery');
		};
		syncRecovery();
		window.addEventListener('hashchange', syncRecovery);
		return () => window.removeEventListener('hashchange', syncRecovery);
	});

	const NON_ADMIN_MESSAGE = 'This account does not have admin access.';

	// Already authenticated? Bounce to /admin — but never while an admin is
	// setting a new password from a recovery link. Fail-closed: a session
	// without is_admin is signed back out here instead of routed anywhere.
	$effect(() => {
		if (authStore.ready && authStore.isAuthenticated && !recoveryMode) {
			void resolveLandingPath().then((landing) => {
				if (landing) {
					void goto(landing, { replaceState: true });
					return;
				}
				error = NON_ADMIN_MESSAGE;
				void signOut();
			});
		}
	});

	/** Honour ?redirect= but only same-site paths — no open redirects. */
	function safeRedirect(fallback: string): string {
		const target = page.url.searchParams.get('redirect');
		if (
			target &&
			target.startsWith('/') &&
			!target.startsWith('//') &&
			!target.startsWith('/\\')
		) {
			return target;
		}
		return fallback;
	}

	async function onLogin(event: SubmitEvent) {
		event.preventDefault();
		error = '';
		if (busy) return;
		if (!email.trim()) {
			error = 'Enter your email address.';
			return;
		}
		if (!password) {
			error = 'Enter your password.';
			return;
		}

		busy = true;
		try {
			const { error: signInError } = await getSupabase().auth.signInWithPassword({
				email: email.trim(),
				password
			});
			if (signInError) {
				error = signInError.message;
			} else {
				const landing = await resolveLandingPath();
				if (landing) {
					await goto(safeRedirect(landing));
				} else {
					error = NON_ADMIN_MESSAGE;
					await signOut();
				}
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Sign-in failed. Please try again.';
		} finally {
			busy = false;
		}
	}

	function toggleForgot() {
		showForgot = !showForgot;
		error = '';
		forgotStatus = '';
	}

	async function onForgot(event: SubmitEvent) {
		event.preventDefault();
		error = '';
		forgotStatus = '';
		if (forgotBusy) return;
		if (!forgotEmail.trim()) {
			error = 'Enter your email address to reset your password.';
			return;
		}

		forgotBusy = true;
		try {
			// Handler-only: `location` must never be read at module scope.
			const { error: resetError } = await getSupabase().auth.resetPasswordForEmail(
				forgotEmail.trim(),
				{ redirectTo: location.origin + '/login' }
			);
			if (resetError) {
				error = resetError.message;
			} else {
				forgotStatus = 'Reset link sent — check your email to continue.';
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Could not send the reset link.';
		} finally {
			forgotBusy = false;
		}
	}

	async function onRecovery(event: SubmitEvent) {
		event.preventDefault();
		error = '';
		if (recoveryBusy) return;
		if (recoveryPassword.length < 8) {
			error = 'Use at least 8 characters for your new password.';
			return;
		}
		if (recoveryConfirm !== recoveryPassword) {
			error = 'Passwords do not match.';
			return;
		}

		recoveryBusy = true;
		try {
			const { error: updateError } = await getSupabase().auth.updateUser({
				password: recoveryPassword
			});
			if (updateError) {
				error = updateError.message;
			} else {
				recoveryPassword = '';
				recoveryConfirm = '';
				const landing = await resolveLandingPath();
				if (landing) {
					await goto(landing);
				} else {
					recoveryMode = false;
					error = NON_ADMIN_MESSAGE;
					await signOut();
				}
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Could not update your password.';
		} finally {
			recoveryBusy = false;
		}
	}
</script>

<svelte:head>
	<title>Sign in — Tech Pixel A2H</title>
	<meta
		name="description"
		content="Sign in to the Tech Pixel A2H admin console, reset a lost password or set a new one."
	/>
	<meta name="robots" content="noindex, nofollow" />
	<meta name="theme-color" content="#12212e" />
</svelte:head>

<TargoNav active="login" />

<main id="main" class="targo-band" tabindex="-1">
	<section
		class="flex min-h-[62vh] items-center justify-center px-5 py-14 md:py-20"
		aria-labelledby="login-title"
	>
		<div class="targo-card auth-card">
			<p class="targo-eyebrow">Admin access</p>
			<h1 class="targo-title auth-title" id="login-title">
				Welcome<br /><span class="t-accent">Back</span>
			</h1>
			<p class="targo-lead auth-lead">
				Sign in to manage enquiries and site administration.
			</p>

			{#if error}
				<p class="auth-error" data-testid="login-error" role="alert">{error}</p>
			{/if}

			{#if recoveryMode}
				<div class="auth-recovery">
					<h2 class="targo-quant auth-recovery-title" id="recovery-heading">
						Set a new password
					</h2>
					<p class="auth-recovery-note">
						Recovery link detected — choose a new password for your account.
					</p>
					<form class="auth-form" novalidate onsubmit={onRecovery}>
						<div class="auth-field">
							<label class="targo-field-label" for="login-recovery-password">New password</label>
							<input
								id="login-recovery-password"
								data-testid="login-recovery-password"
								class="targo-field"
								type="password"
								name="new-password"
								autocomplete="new-password"
								placeholder="At least 8 characters"
								bind:value={recoveryPassword}
							/>
						</div>
						<div class="auth-field">
							<label class="targo-field-label" for="login-recovery-confirm">Confirm new password</label>
							<input
								id="login-recovery-confirm"
								class="targo-field"
								type="password"
								name="confirm-new-password"
								autocomplete="new-password"
								placeholder="Re-enter your new password"
								bind:value={recoveryConfirm}
							/>
						</div>
						<button
							class="targo-btn auth-submit"
							type="submit"
							data-testid="login-recovery-submit"
							disabled={recoveryBusy}
						>
							{recoveryBusy ? 'Saving…' : 'Save password'}
						</button>
					</form>
				</div>
				<hr class="auth-rule" />
			{/if}

			<form class="auth-form" novalidate onsubmit={onLogin}>
				<div class="auth-field">
					<label class="targo-field-label" for="login-email">Email</label>
					<input
						id="login-email"
						data-testid="login-email"
						class="targo-field"
						type="email"
						name="email"
						autocomplete="email"
						placeholder="you@example.com"
						bind:value={email}
					/>
				</div>
				<div class="auth-field">
					<label class="targo-field-label" for="login-password">Password</label>
					<input
						id="login-password"
						data-testid="login-password"
						class="targo-field"
						type="password"
						name="password"
						autocomplete="current-password"
						placeholder="Your password"
						bind:value={password}
					/>
				</div>
				<button
					class="targo-btn auth-submit"
					type="submit"
					data-testid="login-submit"
					disabled={busy}
				>
					{busy ? 'Signing in…' : 'Sign in'}
				</button>
			</form>

			<div class="auth-row">
				<button
					class="targo-focus auth-toggle"
					type="button"
					data-testid="login-forgot-toggle"
					aria-expanded={showForgot}
					aria-controls="login-forgot-panel"
					onclick={toggleForgot}
				>
					Forgot password?
				</button>
			</div>

			{#if showForgot}
				<form class="auth-form auth-forgot" id="login-forgot-panel" novalidate onsubmit={onForgot}>
					<div class="auth-field">
						<label class="targo-field-label" for="login-forgot-email">Reset via email</label>
						<input
							id="login-forgot-email"
							data-testid="login-forgot-email"
							class="targo-field"
							type="email"
							name="forgot-email"
							autocomplete="email"
							placeholder="you@example.com"
							bind:value={forgotEmail}
						/>
					</div>
					<button
						class="targo-btn auth-submit"
						type="submit"
						data-testid="login-forgot-submit"
						disabled={forgotBusy}
					>
						{forgotBusy ? 'Sending…' : 'Send reset link'}
					</button>
					{#if forgotStatus}
						<p class="auth-status" data-testid="login-forgot-status" role="status">
							{forgotStatus}
						</p>
					{/if}
				</form>
			{/if}

		</div>
	</section>
</main>

<style>
	/* .targo-card chamfers 22px off each corner and ships no inner padding:
	   inset the content so the first glyph is never sliced by the cut. */
	.auth-card {
		width: 100%;
		max-width: 470px;
		padding: 30px 28px 34px;
	}
	.auth-title {
		margin: 12px 0 0;
		font-size: clamp(34px, 5.5vw, 52px);
	}
	.auth-lead {
		margin-top: 14px;
		font-size: 15px;
	}
	.auth-error,
	.auth-status {
		margin-top: 20px;
		padding: 12px 14px;
		border-left: 3px solid #8a2b1f;
		background: rgba(138, 43, 31, 0.07);
		color: #8a2b1f;
		font-size: 14px;
		line-height: 1.55;
		animation: auth-rise 0.2s ease;
	}
	.auth-status {
		border-color: #16794a;
		background: rgba(22, 121, 74, 0.08);
		color: #16794a;
	}
	.auth-recovery {
		margin-top: 20px;
		padding: 18px;
		border: 1px dashed rgba(10, 111, 140, 0.45);
		background: rgba(21, 188, 223, 0.06);
	}
	.auth-recovery-title {
		margin: 0;
		font-size: 18px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: #12212e;
	}
	.auth-recovery-note {
		margin: 8px 0 0;
		font-size: 13px;
		line-height: 1.55;
		color: #3d4653;
	}
	.auth-rule {
		margin: 24px 0 0;
		border: 0;
		border-top: 1px solid rgba(18, 33, 46, 0.12);
	}
	.auth-form {
		margin-top: 24px;
		display: flex;
		flex-direction: column;
		gap: 18px;
	}
	.auth-recovery .auth-form {
		margin-top: 16px;
		gap: 14px;
	}
	.auth-row {
		margin-top: 14px;
		display: flex;
		justify-content: flex-end;
	}
	.auth-toggle {
		padding: 6px 0;
		border: 0;
		background: none;
		cursor: pointer;
		font-family: 'Quantico', 'Space Grotesk', system-ui, sans-serif;
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.04em;
		color: #0a6f8c;
		text-decoration: underline;
		text-underline-offset: 3px;
		transition: color 0.2s ease;
	}
	.auth-toggle:hover {
		color: #15bcdf;
	}
	.auth-forgot {
		margin-top: 16px;
		padding: 18px;
		border: 1px solid rgba(18, 33, 46, 0.12);
		background: rgba(18, 33, 46, 0.03);
	}
	.auth-forgot .auth-status {
		margin-top: 0;
	}
	.auth-submit {
		width: 100%;
		margin-top: 4px;
	}
	.auth-submit:disabled {
		opacity: 0.65;
		cursor: progress;
	}
	.auth-submit:disabled:hover {
		background: #12212e;
		transform: none;
	}
	@keyframes auth-rise {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.auth-error,
		.auth-status,
		.auth-toggle {
			animation: none;
			transition: none;
		}
	}
</style>
