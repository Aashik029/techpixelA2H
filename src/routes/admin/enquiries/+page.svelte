<script lang="ts">
	import { page } from '$app/state';
	import { onMount, tick } from 'svelte';
	import EnquiryActions from '$lib/admin/EnquiryActions.svelte';
	import EnquiryDrawer from '$lib/admin/EnquiryDrawer.svelte';
	import {
		downloadCsv,
		formatWhen,
		haystack,
		show,
		stamp,
		type Enquiry,
		type EnquiryStatus
	} from '$lib/admin/enquiry';
	import { distinctServices, statusCounts, withinDays, type Counts } from '$lib/admin/metrics';
	import { enquiriesStore, loadEnquiries } from '$lib/admin/store.svelte';

	type StatusFilter = 'all' | EnquiryStatus;
	type SortKey = 'newest' | 'oldest' | 'name';

	const STATUS_FILTERS: StatusFilter[] = ['all', 'new', 'read', 'replied'];
	const STATUS_LABELS: Record<StatusFilter, string> = {
		all: 'All',
		new: 'New',
		read: 'Read',
		replied: 'Replied'
	};

	/** Stat chips double as status shortcuts: Total ⇒ all, New ⇒ new, … */
	const STAT_CHIPS: {
		key: string;
		label: string;
		filter: StatusFilter;
		value: (counts: Counts) => number;
	}[] = [
		{ key: 'total', label: 'Total', filter: 'all', value: (c) => c.total },
		{ key: 'new', label: 'New', filter: 'new', value: (c) => c.new },
		{ key: 'read', label: 'Read', filter: 'read', value: (c) => c.read },
		{ key: 'replied', label: 'Replied', filter: 'replied', value: (c) => c.replied }
	];

	const SORTS: { value: SortKey; label: string }[] = [
		{ value: 'newest', label: 'Newest' },
		{ value: 'oldest', label: 'Oldest' },
		{ value: 'name', label: 'Name' }
	];

	const DATE_OPTIONS: { value: string; label: string }[] = [
		{ value: 'all', label: 'All time' },
		{ value: 'today', label: 'Today' },
		{ value: '7', label: 'Last 7 days' },
		{ value: '30', label: 'Last 30 days' }
	];

	/* ---- filter / view state ---- */
	let statusFilter = $state<StatusFilter>('all');
	let serviceFilter = $state<string>('');
	let dateFilter = $state<string>('all');
	let query = $state<string>('');
	let sort = $state<string>('newest');

	/* ---- drawer state ---- */
	let selectedId = $state<string | null>(null);
	/** Non-reactive: only the close path needs the element that opened it. */
	let lastTrigger: HTMLElement | null = null;

	/* ---- ?focus=<id> deep link (read once at mount) ---- */
	const focusParam = page.url.searchParams.get('focus');
	let focusApplied = false;

	const rows = $derived(enquiriesStore.rows);
	const counts = $derived(statusCounts(rows));
	const services = $derived(distinctServices(rows));

	const dateWindow = $derived.by((): number | 'all' => {
		if (dateFilter === 'today') return 1;
		if (dateFilter === '7') return 7;
		if (dateFilter === '30') return 30;
		return 'all';
	});

	const visible = $derived.by((): Enquiry[] => {
		let out = statusFilter === 'all' ? rows : rows.filter((row) => row.status === statusFilter);
		if (serviceFilter !== '') {
			out = out.filter((row) => String(row.service ?? '').trim() === serviceFilter);
		}
		const needle = query.trim().toLowerCase();
		if (needle !== '') out = out.filter((row) => haystack(row).includes(needle));
		out = withinDays(out, dateWindow);
		const sorted = [...out];
		if (sort === 'oldest') sorted.sort((a, b) => stamp(a) - stamp(b));
		else if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
		else sorted.sort((a, b) => stamp(b) - stamp(a));
		return sorted;
	});

	const hasFilters = $derived(
		statusFilter !== 'all' || serviceFilter !== '' || dateFilter !== 'all' || query.trim() !== ''
	);
	/* Exactly one admin-clear-filters is ever visible: the empty state owns
	   it once the filters cut the list to zero; the toolbar owns it otherwise. */
	const showToolbarClear = $derived(hasFilters && (visible.length > 0 || rows.length === 0));

	const selectedRow = $derived(
		selectedId === null ? null : (rows.find((row) => row.id === selectedId) ?? null)
	);

	/* Close the drawer if the chosen enquiry disappears from `rows`. */
	$effect(() => {
		if (selectedId !== null && selectedRow === null) selectedId = null;
	});

	/* Apply ?focus=<id> as soon as the rows it needs have loaded. */
	$effect(() => {
		if (focusApplied || !enquiriesStore.loaded) return;
		focusApplied = true;
		if (focusParam !== null && rows.some((row) => row.id === focusParam)) {
			selectedId = focusParam;
		}
	});

	onMount(() => {
		if (!enquiriesStore.loaded && !enquiriesStore.loading) void loadEnquiries();
	});

	function openDrawer(row: Enquiry, event: Event): void {
		const target = event.currentTarget;
		lastTrigger = target instanceof HTMLElement ? target : null;
		selectedId = row.id;
	}

	async function closeDrawer(): Promise<void> {
		selectedId = null;
		await tick();
		const trigger = lastTrigger;
		lastTrigger = null;
		if (trigger !== null && document.contains(trigger)) trigger.focus();
	}

	function clearFilters(): void {
		statusFilter = 'all';
		serviceFilter = '';
		dateFilter = 'all';
		query = '';
	}
</script>

<svelte:head>
	<title>Enquiries — Tech Pixel A2H Admin</title>
</svelte:head>

<div data-testid="admin-inbox">
	<header class="adm-panel-head">
		<div>
			<h1 class="adm-h1">Enquiries</h1>
			<p class="adm-sub">Latest 100 submissions · client-side filtering</p>
		</div>
		<div class="adm-actions">
			<button
				type="button"
				class="adm-btn"
				data-testid="admin-refresh"
				disabled={enquiriesStore.loading}
				onclick={loadEnquiries}
			>
				{enquiriesStore.loading ? 'Refreshing…' : 'Refresh'}
			</button>
			<button
				type="button"
				class="adm-btn adm-btn--primary"
				data-testid="admin-export"
				disabled={visible.length === 0}
				onclick={() => downloadCsv(visible)}
			>
				Export CSV
			</button>
			<a class="adm-btn adm-btn--ghost" href="/admin/analytics">Analytics</a>
		</div>
	</header>

	{#if enquiriesStore.error}
		<p class="adm-alert" role="alert" data-testid="admin-inbox-error">{enquiriesStore.error}</p>
	{/if}

	<div class="adm-stats" role="group" aria-label="Enquiry counts">
		{#each STAT_CHIPS as chip (chip.key)}
			<button
				type="button"
				class="adm-chip"
				aria-pressed={statusFilter === chip.filter}
				onclick={() => (statusFilter = chip.filter)}
			>
				<span>{chip.label}</span>
				<span class="adm-badge">{chip.value(counts)}</span>
			</button>
		{/each}
	</div>

	<div class="adm-toolbar">
		<div class="ctl">
			<span class="adm-field-label">Status</span>
			<div class="chip-row" role="group" aria-label="Filter by status">
				{#each STATUS_FILTERS as filter (filter)}
					<button
						type="button"
						class="adm-chip"
						data-testid="admin-filter-{filter}"
						aria-pressed={statusFilter === filter}
						onclick={() => (statusFilter = filter)}
					>
						{STATUS_LABELS[filter]}
					</button>
				{/each}
			</div>
		</div>

		<div class="ctl ctl--select">
			<label class="adm-field-label" for="enq-service">Service</label>
			<select
				id="enq-service"
				class="adm-select"
				data-testid="admin-service-filter"
				bind:value={serviceFilter}
			>
				<option value="">All services</option>
				{#each services as service (service)}
					<option value={service}>{service}</option>
				{/each}
			</select>
		</div>

		<div class="ctl ctl--select">
			<label class="adm-field-label" for="enq-date">Date</label>
			<select id="enq-date" class="adm-select" data-testid="admin-date-filter" bind:value={dateFilter}>
				{#each DATE_OPTIONS as option (option.value)}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</div>

		<div class="ctl ctl--search">
			<label class="adm-field-label" for="enq-search">Search</label>
			<input
				id="enq-search"
				class="adm-field"
				data-testid="admin-search"
				type="search"
				placeholder="Name, phone, service…"
				bind:value={query}
			/>
		</div>

		<div class="ctl ctl--select">
			<label class="adm-field-label" for="enq-sort">Sort</label>
			<select id="enq-sort" class="adm-select" data-testid="admin-sort" bind:value={sort}>
				{#each SORTS as option (option.value)}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</div>

		<p class="adm-meta">Showing {visible.length} of {rows.length}</p>

		{#if showToolbarClear}
			<button
				type="button"
				class="adm-btn adm-btn--ghost adm-btn--sm"
				data-testid="admin-clear-filters"
				onclick={clearFilters}
			>
				Clear filters
			</button>
		{/if}
	</div>

	{#if !enquiriesStore.loaded && !enquiriesStore.error}
		<section class="adm-panel">
			<p class="adm-loading" role="status">Loading enquiries…</p>
		</section>
	{:else if rows.length === 0}
		{#if !enquiriesStore.error}
			<section class="adm-panel">
				<div class="adm-empty">
					<p class="adm-empty-title">No enquiries yet.</p>
				</div>
			</section>
		{/if}
	{:else if visible.length === 0}
		<section class="adm-panel">
			<div class="adm-empty">
				<p class="adm-empty-title">No enquiries match your filters.</p>
				<button
					type="button"
					class="adm-btn adm-btn--ghost adm-btn--sm"
					data-testid="admin-clear-filters"
					onclick={clearFilters}
				>
					Clear filters
				</button>
			</div>
		</section>
	{:else}
		<section class="adm-panel adm-panel--flush">
			<div class="adm-table-wrap">
				<table class="adm-table">
					<thead>
						<tr>
							<th scope="col">Name</th>
							<th scope="col">Service</th>
							<th scope="col">Phone</th>
							<th scope="col">Budget</th>
							<th scope="col">Received</th>
							<th scope="col">Status</th>
							<th scope="col">Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each visible as row (row.id)}
							<tr class="adm-row" data-testid="admin-row">
								<td class="cell-name">
									<button
										type="button"
										class="row-open"
										aria-haspopup="dialog"
										aria-expanded={selectedId === row.id}
										onclick={(event) => openDrawer(row, event)}
									>
										{row.name}
									</button>
									<div class="cell-meta">
										{#if row.user_id}
											<span class="cust-pill" data-testid="admin-customer-badge">Customer</span>
											{#if row.email}
												<span class="cust-mail" data-testid="admin-enquiry-email">{row.email}</span>
											{/if}
										{:else}
											<span class="cust-pill cust-pill--anon" data-testid="admin-customer-badge"
												>Anonymous</span
											>
										{/if}
									</div>
									{#if row.subject}
										<p class="cell-sub">{row.subject}</p>
									{/if}
								</td>
								<td>{show(row.service)}</td>
								<td>{show(row.phone)}</td>
								<td>{show(row.budget)}</td>
								<td class="cell-when">{formatWhen(row.created_at)}</td>
								<td>
									<span class="adm-pill adm-pill--{row.status}" data-testid="admin-status"
										>{row.status}</span
									>
								</td>
								<td class="cell-actions">
									{#if selectedId === null}
										<EnquiryActions {row} />
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>
	{/if}

	{#if selectedRow}
		<EnquiryDrawer row={selectedRow} onclose={closeDrawer} />
	{/if}
</div>

<style>
	/* ---- stat chips ---- */
	.adm-stats {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-bottom: 18px;
	}

	/* The active chip inverts to ink, so its count badge must invert too. */
	.adm-chip[aria-pressed='true'] .adm-badge {
		border-color: rgba(255, 255, 255, 0.4);
		background: rgba(255, 255, 255, 0.16);
		color: var(--adm-white);
	}

	/* ---- toolbar ---- */
	.chip-row {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.ctl {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.ctl--select {
		flex: 0 1 190px;
	}

	.ctl--search {
		flex: 1 1 240px;
	}

	.adm-toolbar .adm-meta {
		margin: 0;
	}

	/* ---- table cells ---- */
	.cell-name {
		min-width: 190px;
	}

	.cell-when {
		white-space: nowrap;
	}

	.cell-actions {
		min-width: 280px;
	}

	.row-open {
		display: inline;
		margin: 0;
		padding: 0;
		border: 0;
		background: none;
		color: var(--adm-ink);
		font-family: var(--adm-quant);
		font-size: 14px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-align: left;
		text-transform: uppercase;
		text-decoration: underline;
		text-decoration-color: transparent;
		text-underline-offset: 4px;
		cursor: pointer;
		transition: text-decoration-color 0.18s ease;
	}

	.row-open:hover {
		text-decoration-color: var(--adm-cyan);
	}

	.cell-sub {
		margin: 4px 0 0;
		font-size: 12px;
		line-height: 1.45;
		color: var(--adm-muted);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* ---- customer attribution (signed-in vs anonymous) ---- */
	.cell-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px 8px;
		margin-top: 5px;
		min-width: 0;
	}

	.cust-pill {
		display: inline-flex;
		align-items: center;
		padding: 1px 7px;
		border: 1px solid var(--adm-cyan);
		border-radius: 999px;
		background: var(--adm-wash);
		color: var(--adm-cyan-dark);
		font-family: var(--adm-quant);
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.12em;
		line-height: 1.6;
		text-transform: uppercase;
	}

	.cust-pill--anon {
		border-color: var(--adm-line-strong);
		background: none;
		color: var(--adm-muted);
	}

	.cust-mail {
		font-size: 11px;
		line-height: 1.4;
		color: var(--adm-muted);
		overflow-wrap: anywhere;
	}

	@media (prefers-reduced-motion: reduce) {
		.row-open {
			transition: none;
		}
	}
</style>
