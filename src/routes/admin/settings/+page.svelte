<script lang="ts">
	import { onMount } from 'svelte';
	import { getSupabase } from '$lib/supabase';
	import { enquiriesStore, loadEnquiries, signOutAdmin } from '$lib/admin/store.svelte';
	import { downloadCsv } from '$lib/admin/enquiry';
	import {
		EMAIL,
		EMAIL_HREF,
		PHONE_DISPLAY,
		PHONE_TEL,
		LOCATION,
		DOMAIN,
		SITE_URL
	} from '$lib/content/site';
	import pkg from '../../../../package.json';

	/* ---- Account: client-only session probe (runs after prerender) ---- */
	let probeState = $state<'checking' | 'signed-in' | 'failed'>('checking');
	let probeError = $state('');
	let email = $state('—');

	/* ---- Data: truthful "last refreshed" for loads this page witnessed ---- */
	let lastRefreshed = $state<Date | null>(null);
	let wasLoading = false; // plain flag: deliberately NOT reactive

	const loadedCount = $derived(enquiriesStore.rows.length);
	const refreshedLabel = $derived(lastRefreshed === null ? '—' : lastRefreshed.toLocaleString());

	// Stamp the moment a load finishes without an error (never faked on mount).
	$effect(() => {
		const loading = enquiriesStore.loading;
		if (wasLoading && !loading && !enquiriesStore.error) {
			lastRefreshed = new Date();
		}
		wasLoading = loading;
	});

	onMount(() => {
		void probeUser();
	});

	async function probeUser(): Promise<void> {
		try {
			const { data, error } = await getSupabase().auth.getUser();
			if (error || !data.user) {
				probeState = 'failed';
				probeError = error?.message ?? 'No active session was returned.';
			} else {
				email = data.user.email ?? '—';
				probeState = 'signed-in';
			}
		} catch (err) {
			probeState = 'failed';
			probeError = err instanceof Error ? err.message : 'Session lookup failed.';
		}
	}

	async function handleSignOut(): Promise<void> {
		try {
			await signOutAdmin();
		} finally {
			// Full reload re-probes the session and lands on the login gate.
			window.location.assign('/admin');
		}
	}
</script>

<svelte:head>
	<title>Settings — Tech Pixel A2H Admin</title>
</svelte:head>

<header class="page-head">
	<h1 class="adm-h1">Settings</h1>
	<p class="adm-sub">
		Session details, enquiry data tools and the read-only workspace facts behind this admin
		build.
	</p>
</header>

<!-- ================= Account ================= -->
<section class="adm-panel" aria-labelledby="settings-account-title">
	<header class="adm-panel-head">
		<h2 class="adm-panel-title" id="settings-account-title">Account</h2>
		{#if probeState === 'checking'}
			<span class="adm-pill">Checking…</span>
		{:else if probeState === 'signed-in'}
			<span class="adm-pill">Signed in</span>
		{/if}
	</header>

	{#if probeState === 'failed'}
		<p class="adm-alert" role="alert">{probeError}</p>
	{/if}

	<dl class="rows">
		<div class="row">
			<dt>Email</dt>
			<dd>{email}</dd>
		</div>
		<div class="row">
			<dt>Role</dt>
			<dd>Administrator</dd>
		</div>
	</dl>

	<hr class="adm-divider" />

	<div class="adm-actions">
		<button
			class="adm-btn adm-btn--ghost adm-btn--sm"
			type="button"
			data-testid="admin-settings-signout"
			onclick={handleSignOut}
		>
			Sign out
		</button>
	</div>
</section>

<!-- ================= Data ================= -->
<section class="adm-panel" aria-labelledby="settings-data-title">
	<header class="adm-panel-head">
		<h2 class="adm-panel-title" id="settings-data-title">Data</h2>
	</header>

	{#if enquiriesStore.error}
		<p class="adm-alert" role="alert">{enquiriesStore.error}</p>
	{/if}

	<p class="adm-meta">Loaded {loadedCount} of latest 100</p>

	{#if enquiriesStore.loading}
		<p class="adm-loading" role="status">Loading…</p>
	{/if}

	<p class="adm-meta">Last refreshed: {refreshedLabel}</p>

	<hr class="adm-divider" />

	<div class="adm-actions">
		<button
			class="adm-btn"
			type="button"
			data-testid="admin-settings-refresh"
			onclick={loadEnquiries}
			disabled={enquiriesStore.loading}
		>
			Refresh
		</button>
		<button
			class="adm-btn adm-btn--primary"
			type="button"
			data-testid="admin-settings-export"
			onclick={() => downloadCsv(enquiriesStore.rows)}
			disabled={loadedCount === 0}
		>
			Export all enquiries (CSV)
		</button>
	</div>
</section>

<!-- ================= Workspace ================= -->
<section class="adm-panel" aria-labelledby="settings-workspace-title">
	<header class="adm-panel-head">
		<h2 class="adm-panel-title" id="settings-workspace-title">Workspace</h2>
		<span class="adm-pill">Read-only</span>
	</header>

	<p class="adm-sub">
		Public contact facts sourced from the site content module — display only, never editable from
		admin.
	</p>

	<dl class="rows">
		<div class="row">
			<dt>Brand</dt>
			<dd>Tech Pixel A2H</dd>
		</div>
		<div class="row">
			<dt>Email</dt>
			<dd><a href={EMAIL_HREF}>{EMAIL}</a></dd>
		</div>
		<div class="row">
			<dt>Phone</dt>
			<dd><a href={PHONE_TEL}>{PHONE_DISPLAY}</a></dd>
		</div>
		<div class="row">
			<dt>Location</dt>
			<dd>{LOCATION}</dd>
		</div>
		<div class="row">
			<dt>Domain</dt>
			<dd>{DOMAIN}</dd>
		</div>
		<div class="row">
			<dt>Site URL</dt>
			<dd>{SITE_URL}</dd>
		</div>
	</dl>
</section>

<!-- ================= About ================= -->
<section class="adm-panel" aria-labelledby="settings-about-title">
	<header class="adm-panel-head">
		<h2 class="adm-panel-title" id="settings-about-title">About</h2>
	</header>

	<dl class="rows">
		<div class="row">
			<dt>App title</dt>
			<dd>Tech Pixel A2H Admin</dd>
		</div>
		<div class="row">
			<dt>Build</dt>
			<dd>Static site (SvelteKit + adapter-static)</dd>
		</div>
		<div class="row">
			<dt>Storage</dt>
			<dd>Enquiries stored in Supabase (RLS-protected)</dd>
		</div>
		<div class="row">
			<dt>Crawlers</dt>
			<dd>/admin is excluded from robots.txt and the sitemap, and served noindex</dd>
		</div>
		<div class="row">
			<dt>Package</dt>
			<dd>{pkg.name} · v{pkg.version}</dd>
		</div>
	</dl>
</section>

<style>
	.page-head {
		margin-bottom: 22px;
	}

	/* Read-only definition rows — every value traces to an --adm-* token. */
	.rows {
		margin: 0;
	}

	.row {
		display: grid;
		grid-template-columns: minmax(120px, 180px) 1fr;
		gap: 4px 16px;
		align-items: baseline;
		padding: 12px 0;
		border-bottom: 1px solid var(--adm-line);
	}

	.row:first-child {
		padding-top: 0;
	}

	.row:last-child {
		padding-bottom: 0;
		border-bottom: 0;
	}

	.row dt {
		margin: 0;
		font-family: var(--adm-quant);
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--adm-muted);
	}

	.row dd {
		margin: 0;
		font-family: var(--adm-body);
		font-size: 15px;
		line-height: 1.6;
		color: var(--adm-ink);
		overflow-wrap: anywhere;
		font-variant-numeric: tabular-nums;
	}

	.row a {
		color: var(--adm-cyan-dark);
		text-decoration: underline;
		text-underline-offset: 3px;
		transition: color 0.18s ease;
	}

	.row a:hover {
		color: var(--adm-ink);
	}

	@media (max-width: 640px) {
		.row {
			grid-template-columns: 1fr;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.row a {
			transition: none;
		}
	}
</style>
