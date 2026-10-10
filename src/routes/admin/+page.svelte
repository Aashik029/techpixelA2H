<script lang="ts">
	import { enquiriesStore, loadEnquiries } from '$lib/admin/store.svelte';
	import {
		statusCounts,
		needsAttention,
		recentRows,
		weekDelta,
		withinDays
	} from '$lib/admin/metrics';
	import { formatWhen, show } from '$lib/admin/enquiry';

	// Reactive snapshots over the store facade — never destructure the store,
	// so every read below re-runs when the underlying $state flips.
	const rows = $derived(enquiriesStore.rows);
	const counts = $derived(statusCounts(rows));
	const attention = $derived(needsAttention(rows).slice(0, 5));
	const recent = $derived(recentRows(rows, 5));
	const recentCount = $derived(withinDays(rows, 7).length);
	const delta = $derived(weekDelta(rows));

	const initialLoad = $derived(enquiriesStore.loading && !enquiriesStore.loaded);
	const isEmpty = $derived(enquiriesStore.loaded && rows.length === 0);
</script>

<svelte:head>
	<title>Dashboard — Tech Pixel A2H Admin</title>
</svelte:head>

<header class="ov-head">
	<div class="ov-head-text">
		<h1 class="adm-h1">Overview</h1>
		<p class="adm-sub">Enquiries, response status and recent activity at a glance.</p>
	</div>
	<div class="ov-head-actions">
		<button
			class="adm-btn adm-btn--ghost adm-btn--sm"
			type="button"
			data-testid="admin-overview-refresh"
			disabled={enquiriesStore.loading}
			onclick={loadEnquiries}
		>
			Refresh
		</button>
		<a class="adm-btn adm-btn--primary" href="/admin/enquiries">Open inbox</a>
	</div>
</header>

{#if enquiriesStore.error}
	<p class="adm-alert" role="alert" data-testid="admin-overview-error">
		{enquiriesStore.error}
	</p>
{/if}

<section class="adm-kpi-grid ov-kpis" aria-label="Key metrics">
	<div class="adm-kpi">
		<span class="adm-kpi-label">Total</span>
		<span class="adm-kpi-value">{counts.total}</span>
	</div>
	<div class="adm-kpi adm-kpi--new">
		<span class="adm-kpi-label">Needs attention</span>
		<span class="adm-kpi-value">{counts.new}</span>
	</div>
	<div class="adm-kpi adm-kpi--read">
		<span class="adm-kpi-label">Read</span>
		<span class="adm-kpi-value">{counts.read}</span>
	</div>
	<div class="adm-kpi adm-kpi--replied">
		<span class="adm-kpi-label">Replied</span>
		<span class="adm-kpi-value">{counts.replied}</span>
	</div>
	<div class="adm-kpi">
		<span class="adm-kpi-label">Last 7 days</span>
		<span class="adm-kpi-value">{recentCount}</span>
		<span class="adm-kpi-delta adm-kpi-delta--{delta >= 0 ? 'up' : 'down'}">{delta >= 0 ? '+' : ''}{delta}</span>
	</div>
</section>

{#if initialLoad}
	<p class="adm-loading ov-loading" role="status">Loading enquiries…</p>
{:else if isEmpty}
	<section class="adm-panel">
		<div class="adm-empty">
			<p class="adm-empty-title">No enquiries yet</p>
			<p class="adm-sub ov-empty-note">
				When customers get in touch, their enquiries will land here. Pull the latest data or open
				the inbox to get started.
			</p>
			<button
				class="adm-btn adm-btn--primary adm-btn--sm"
				type="button"
				disabled={enquiriesStore.loading}
				onclick={loadEnquiries}
			>
				Refresh
			</button>
		</div>
	</section>
{:else if rows.length > 0}
	<section class="adm-panel">
		<div class="adm-panel-head">
			<h2 class="adm-panel-title">Needs attention</h2>
			{#if counts.new > 5}
				<span class="adm-meta ov-panel-meta">Showing 5 of {counts.new}</span>
			{/if}
		</div>
		{#if attention.length === 0}
			<div class="adm-empty">
				<p class="adm-empty-title">Nothing needs attention</p>
				<p class="adm-sub ov-empty-note">New enquiries will appear here.</p>
			</div>
		{:else}
			<ul class="ov-list">
				{#each attention as row (row.id)}
					<li class="ov-list-item">
						<a class="ov-row" href="/admin/enquiries?focus={row.id}">
							<span class="ov-row-main">
								<span class="ov-row-name">{show(row.name)}</span>
								<span class="ov-row-service">{show(row.service)}</span>
							</span>
							<span class="ov-row-meta">Received {formatWhen(row.created_at)}</span>
							<span class="adm-pill adm-pill--new">new</span>
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</section>

	<section class="adm-panel">
		<div class="adm-panel-head">
			<h2 class="adm-panel-title">Recent enquiries</h2>
			<a class="adm-btn adm-btn--ghost adm-btn--sm" href="/admin/enquiries">View all</a>
		</div>
		{#if recent.length === 0}
			<div class="adm-empty">
				<p class="adm-empty-title">No enquiries yet</p>
				<p class="adm-sub ov-empty-note">New enquiries will appear here.</p>
			</div>
		{:else}
			<div class="adm-table-wrap">
				<table class="adm-table">
					<thead>
						<tr>
							<th scope="col">Name</th>
							<th scope="col">Service</th>
							<th scope="col">Received</th>
							<th scope="col">Status</th>
						</tr>
					</thead>
					<tbody>
						{#each recent as row (row.id)}
							<tr class="ov-tr">
								<td>
									<a class="ov-row-link" href="/admin/enquiries?focus={row.id}">{show(row.name)}</a>
								</td>
								<td>{show(row.service)}</td>
								<td>{formatWhen(row.created_at)}</td>
								<td>
									<span class="adm-pill adm-pill--{row.status}">{row.status}</span>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</section>
{/if}

<section class="adm-panel">
	<div class="adm-panel-head">
		<h2 class="adm-panel-title">Quick links</h2>
	</div>
	<div class="ov-quick">
		<a class="adm-chip" href="/admin/analytics">Analytics</a>
		<a class="adm-chip" href="/admin/settings">Settings</a>
	</div>
</section>

<style>
	/* Page-only layout chrome — every visual token comes from admin.css. */

	.ov-head {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: 16px 24px;
		margin-bottom: 22px;
	}

	.ov-head-text {
		min-width: 0;
	}

	.ov-head-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.ov-kpis {
		margin-bottom: 20px;
	}

	/* `.adm-loading` carries margin:0 — restore breathing room before the
	   quick-links panel, which only gets `.adm-panel + .adm-panel` spacing
	   when a real panel precedes it. */
	.ov-loading {
		margin: 0 0 18px;
	}

	.ov-panel-meta {
		margin: 0;
	}

	/* ---- needs-attention compact rows ------------------------------------ */

	.ov-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.ov-list-item + .ov-list-item {
		border-top: 1px solid var(--adm-line);
	}

	.ov-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 6px 16px;
		padding: 13px 4px;
		color: inherit;
		text-decoration: none;
		transition: background 0.15s ease;
	}

	.ov-row:hover {
		background: var(--adm-wash);
	}

	.ov-row:focus-visible {
		outline: 2px solid var(--adm-cyan);
		outline-offset: -2px;
	}

	.ov-row-main {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 4px 14px;
		min-width: 0;
	}

	.ov-row-name {
		font-weight: 600;
		color: var(--adm-ink);
		overflow-wrap: anywhere;
	}

	.ov-row-service {
		font-size: 14px;
		color: var(--adm-muted);
	}

	.ov-row-meta {
		font-family: var(--adm-quant);
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--adm-muted);
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}

	/* ---- recent table: whole row is one link target ---------------------- */

	.ov-tr {
		position: relative;
	}

	.ov-row-link {
		color: var(--adm-ink);
		font-weight: 600;
		text-decoration: none;
	}

	.ov-row-link::after {
		content: '';
		position: absolute;
		inset: 0;
	}

	.ov-row-link:focus-visible {
		outline: none;
	}

	.ov-tr:focus-within {
		outline: 2px solid var(--adm-cyan);
		outline-offset: -2px;
	}

	/* ---- misc ------------------------------------------------------------- */

	.ov-empty-note {
		margin-top: 4px;
		max-width: 46ch;
	}

	.ov-quick {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}
</style>
