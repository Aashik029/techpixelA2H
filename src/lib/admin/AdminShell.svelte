<script lang="ts">
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';

	/** Admin chrome only: topbar, tab nav, sign-out. No data logic here —
	 *  the active tab is derived from the current URL, never passed in. */
	let { onSignOut, children }: { onSignOut: () => void; children: Snippet } = $props();

	const path = $derived(page.url.pathname);

	const TABS = [
		{ href: '/admin', label: 'Overview' },
		{ href: '/admin/enquiries', label: 'Enquiries' },
		{ href: '/admin/analytics', label: 'Analytics' },
		{ href: '/admin/settings', label: 'Settings' }
	];

	function isActive(href: string): boolean {
		const current = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
		return href === '/admin'
			? current === '/admin'
			: current === href || current.startsWith(`${href}/`);
	}
</script>

<a class="adm-skip" href="#main">Skip to content</a>

<header class="adm-topbar">
	<div class="adm-topbar-inner">
		<a class="adm-brand" href="/admin" aria-label="Tech Pixel A2H — admin overview">
			<span class="adm-brand-mark" aria-hidden="true"><span class="adm-brand-ellipse"></span></span>
			<span class="adm-brand-word">a2h</span>
			<span class="adm-brand-divider" aria-hidden="true"></span>
			<span class="adm-brand-admin">ADMIN</span>
		</a>

		<nav class="adm-nav" aria-label="Admin sections">
			{#each TABS as tab (tab.href)}
				<a
					class="adm-nav-link"
					href={tab.href}
					aria-current={isActive(tab.href) ? 'page' : undefined}>{tab.label}</a
				>
			{/each}
		</nav>

		<button
			class="adm-btn adm-btn--ghost adm-btn--sm"
			type="button"
			data-testid="admin-signout"
			onclick={onSignOut}
		>
			Sign out
		</button>
	</div>
</header>

<main id="main" class="targo-band adm-main" tabindex="-1"><div class="adm-page">{@render children()}</div></main>
