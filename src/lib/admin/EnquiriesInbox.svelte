<script lang="ts">
	import { onMount } from 'svelte';
	import { getSupabase } from '$lib/supabase';

	let { onSignedOut }: { onSignedOut: () => void } = $props();

	type Enquiry = {
		id: string;
		created_at: string;
		name: string;
		phone: string;
		service: string;
		answers: unknown;
		budget: string;
		timeline: string;
		subject: string;
		message: string;
		status: 'new' | 'read' | 'replied';
	};

	type StatusFilter = 'all' | Enquiry['status'];
	type SortKey = 'newest' | 'oldest' | 'name';

	const FILTERS: StatusFilter[] = ['all', 'new', 'read', 'replied'];
	const FILTER_LABELS: Record<StatusFilter, string> = {
		all: 'All',
		new: 'New',
		read: 'Read',
		replied: 'Replied'
	};
	const SORTS: { value: SortKey; label: string }[] = [
		{ value: 'newest', label: 'Newest first' },
		{ value: 'oldest', label: 'Oldest first' },
		{ value: 'name', label: 'Name (A-Z)' }
	];
	const CSV_HEADER = [
		'created_at',
		'name',
		'phone',
		'service',
		'budget',
		'timeline',
		'subject',
		'message',
		'status'
	];

	let rows = $state<Enquiry[]>([]);
	let open = $state<string | null>(null);
	let error = $state('');
	let refreshing = $state(false);
	let statusFilter = $state<StatusFilter>('all');
	let query = $state('');
	let sort = $state<SortKey>('newest');
	let copied = $state<string | null>(null);

	const counts = $derived.by(() => {
		let fresh = 0;
		let seen = 0;
		let done = 0;
		for (const row of rows) {
			if (row.status === 'new') fresh += 1;
			else if (row.status === 'read') seen += 1;
			else if (row.status === 'replied') done += 1;
		}
		return { total: rows.length, new: fresh, read: seen, replied: done };
	});

	const chips = $derived([
		{ key: 'total', label: 'Total', value: counts.total, mod: 'chip--total' },
		{ key: 'new', label: 'New', value: counts.new, mod: 'chip--new' },
		{ key: 'read', label: 'Read', value: counts.read, mod: 'chip--read' },
		{ key: 'replied', label: 'Replied', value: counts.replied, mod: 'chip--replied' }
	]);

	const visible = $derived.by(() => {
		const needle = query.trim().toLowerCase();
		let out = rows.filter((row) => statusFilter === 'all' || row.status === statusFilter);
		if (needle) out = out.filter((row) => haystack(row).includes(needle));
		const sorted = [...out];
		if (sort === 'oldest') sorted.sort((a, b) => stamp(a) - stamp(b));
		else if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
		else sorted.sort((a, b) => stamp(b) - stamp(a));
		return sorted;
	});

	async function load() {
		error = '';
		refreshing = true;
		try {
			const supabase = getSupabase();
			const { data, error: queryError } = await supabase
				.from('enquiries')
				.select('*')
				.order('created_at', { ascending: false })
				.limit(100);
			if (queryError) {
				error = queryError.message;
			} else {
				rows = (data ?? []) as Enquiry[];
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load enquiries';
		} finally {
			refreshing = false;
		}
	}

	async function setStatus(id: string, status: 'read' | 'replied') {
		try {
			const supabase = getSupabase();
			const { error: updateError } = await supabase
				.from('enquiries')
				.update({ status })
				.eq('id', id);
			if (updateError) {
				error = updateError.message;
				return;
			}
			rows = rows.map((r) => (r.id === id ? { ...r, status } : r));
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to update status';
		}
	}

	async function signOut() {
		try {
			await getSupabase().auth.signOut();
		} finally {
			onSignedOut();
		}
	}

	/* ---------- client-side view helpers (no server round-trips) ---------- */

	function stamp(row: Enquiry): number {
		const at = Date.parse(row.created_at);
		return Number.isNaN(at) ? 0 : at;
	}

	function haystack(row: Enquiry): string {
		return [row.name, row.phone, row.service, row.subject, row.message]
			.map((value) => (value == null ? '' : String(value)))
			.join(' ')
			.toLowerCase();
	}

	function formatWhen(iso: string): string {
		const at = new Date(iso ?? '');
		return Number.isNaN(at.getTime()) ? '—' : at.toLocaleString();
	}

	function show(value: unknown): string {
		if (value === null || value === undefined) return '—';
		const text = String(value).trim();
		return text === '' ? '—' : text;
	}

	function answerEntries(answers: unknown): Array<[string, unknown]> {
		if (Array.isArray(answers)) {
			return answers.map((value, index) => [`Item ${index + 1}`, value] as [string, unknown]);
		}
		if (answers !== null && typeof answers === 'object') {
			return Object.entries(answers as Record<string, unknown>);
		}
		return [];
	}

	function answerText(value: unknown): string {
		if (value === null || value === undefined || value === '') return '—';
		if (typeof value === 'object') {
			try {
				return JSON.stringify(value);
			} catch {
				return '—';
			}
		}
		const text = String(value).trim();
		return text === '' ? '—' : text;
	}

	function waHref(row: Enquiry): string {
		const digits = (row.phone ?? '').replace(/\D/g, '');
		const target = digits.length === 10 ? `91${digits}` : digits;
		const text = `Hi ${row.name}, thanks for your enquiry about ${row.service}.`;
		return `https://wa.me/${target}?text=${encodeURIComponent(text)}`;
	}

	function csvCell(value: unknown): string {
		const text = value === null || value === undefined ? '' : String(value);
		return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
	}

	function exportCsv() {
		if (visible.length === 0) return;
		const lines = [CSV_HEADER.join(',')];
		for (const row of visible) {
			lines.push(
				[
					row.created_at,
					row.name,
					row.phone,
					row.service,
					row.budget,
					row.timeline,
					row.subject,
					row.message,
					row.status
				]
					.map(csvCell)
					.join(',')
			);
		}
		const blob = new Blob([lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement('a');
		anchor.href = url;
		anchor.download = `enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
		document.body.appendChild(anchor);
		anchor.click();
		anchor.remove();
		URL.revokeObjectURL(url);
	}

	async function copyPhone(row: Enquiry) {
		try {
			await navigator.clipboard.writeText(row.phone);
			copied = row.id;
			window.setTimeout(() => {
				if (copied === row.id) copied = null;
			}, 1600);
		} catch {
			copied = null;
			error = 'Could not copy the phone number to the clipboard.';
		}
	}

	function applySort(event: Event) {
		const el = event.currentTarget;
		if (!(el instanceof HTMLSelectElement)) return;
		if (el.value === 'newest' || el.value === 'oldest' || el.value === 'name') sort = el.value;
	}

	function clearFilters() {
		statusFilter = 'all';
		query = '';
		sort = 'newest';
	}

	function toggle(id: string) {
		open = open === id ? null : id;
	}

	onMount(load);
</script>

<div class="targo-band-white inbox" data-testid="admin-inbox">
	<header class="inbox-head">
		<div>
			<h2 class="targo-quant inbox-title">Enquiries inbox</h2>
			<p class="targo-quant inbox-sub">Latest 100 submissions · client-side filtering</p>
		</div>
		<div class="inbox-actions">
			<button
				class="targo-btn"
				data-testid="admin-refresh"
				disabled={refreshing}
				onclick={load}
			>
				{refreshing ? 'Refreshing…' : 'Refresh'}
			</button>
			<button
				class="targo-btn targo-btn-cyan"
				data-testid="admin-export"
				disabled={visible.length === 0}
				onclick={exportCsv}
			>
				Export CSV
			</button>
			<button class="targo-btn" data-testid="admin-signout" onclick={signOut}>Sign out</button>
		</div>
	</header>

	{#if error}
		<p class="alert" role="alert" data-testid="admin-inbox-error">{error}</p>
	{/if}

	<ul class="chips" aria-label="Enquiry counts">
		{#each chips as chip (chip.key)}
			<li class="targo-quant chip {chip.mod}">
				<span class="chip-label">{chip.label}</span>
				<span class="chip-value">{chip.value}</span>
			</li>
		{/each}
	</ul>

	<section class="toolbar" aria-label="Inbox controls">
		<div class="filters" role="group" aria-label="Filter by status">
			{#each FILTERS as filter (filter)}
				<button
					class="targo-quant filter-btn"
					data-testid="admin-filter-{filter}"
					aria-pressed={statusFilter === filter}
					onclick={() => (statusFilter = filter)}
				>
					{FILTER_LABELS[filter]}
				</button>
			{/each}
		</div>

		<div class="field-block">
			<label class="targo-field-label" for="admin-inbox-search">Search</label>
			<input
				id="admin-inbox-search"
				class="targo-field"
				data-testid="admin-search"
				type="search"
				placeholder="Name, phone, service, subject…"
				bind:value={query}
			/>
		</div>

		<div class="sort-block">
			<label class="targo-field-label" for="admin-inbox-sort">Sort</label>
			<select
				id="admin-inbox-sort"
				class="targo-field"
				data-testid="admin-sort"
				value={sort}
				onchange={applySort}
			>
				{#each SORTS as option (option.value)}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</div>
	</section>

	{#if rows.length === 0 && !error}
		<div class="empty">
			<p class="targo-quant">No enquiries yet.</p>
		</div>
	{:else if visible.length === 0}
		<div class="empty">
			<p class="targo-quant">
				{rows.length === 0 ? 'No enquiries yet.' : 'No enquiries match your filters.'}
			</p>
			{#if rows.length > 0}
				<button class="targo-quant act" data-testid="admin-clear-filters" onclick={clearFilters}>
					Clear filters
				</button>
			{/if}
		</div>
	{:else}
		<p class="targo-quant list-meta">
			Showing {visible.length} of {rows.length}
		</p>
		<div class="list">
			{#each visible as row (row.id)}
				<article class="targo-card row" data-testid="admin-row">
					<div class="row-head">
						<button
							class="row-toggle"
							aria-expanded={open === row.id}
							onclick={() => toggle(row.id)}
						>
							<span class="targo-quant row-title">{row.name}</span>
							<span class="row-dash" aria-hidden="true">—</span>
							<span class="targo-quant row-svc">{row.service}</span>
							<svg
								class="chev {open === row.id ? 'chev-open' : ''}"
								viewBox="0 0 24 24"
								width="16"
								height="16"
								aria-hidden="true"
								focusable="false"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="m6 9 6 6 6-6" />
							</svg>
						</button>
						<span class="targo-quant pill pill--{row.status}" data-testid="admin-status">
							{row.status}
						</span>
					</div>

					<p class="row-meta">
						<span>Received {formatWhen(row.created_at)}</span>
						<span class="dot" aria-hidden="true">·</span>
						<a class="svc-link" href="/services/{row.service}">View service</a>
					</p>

					<div class="acts">
						<a
							class="targo-quant act act-primary"
							data-testid="admin-whatsapp"
							href={waHref(row)}
							target="_blank"
							rel="noreferrer"
						>
							WhatsApp
						</a>
						<a class="targo-quant act" data-testid="admin-call" href="tel:{row.phone}">Call</a>
						<button class="targo-quant act" data-testid="admin-copy-phone" onclick={() => copyPhone(row)}>
							{copied === row.id ? 'Copied' : 'Copy phone'}
						</button>
						<button
							class="targo-quant act"
							data-testid="admin-mark-read"
							onclick={() => setStatus(row.id, 'read')}
						>
							Mark read
						</button>
						<button
							class="targo-quant act"
							data-testid="admin-mark-replied"
							onclick={() => setStatus(row.id, 'replied')}
						>
							Mark replied
						</button>
					</div>

					{#if open === row.id}
						<div class="detail-wrap">
							<h3 class="targo-quant detail-title">Enquiry detail</h3>
							<dl class="detail">
								<div class="detail-item">
									<dt class="targo-quant">Phone</dt>
									<dd>{show(row.phone)}</dd>
								</div>
								<div class="detail-item">
									<dt class="targo-quant">Service</dt>
									<dd>{show(row.service)}</dd>
								</div>
								<div class="detail-item">
									<dt class="targo-quant">Budget</dt>
									<dd>{show(row.budget)}</dd>
								</div>
								<div class="detail-item">
									<dt class="targo-quant">Timeline</dt>
									<dd>{show(row.timeline)}</dd>
								</div>
								<div class="detail-item detail-wide">
									<dt class="targo-quant">Subject</dt>
									<dd>{show(row.subject)}</dd>
								</div>
								<div class="detail-item detail-wide">
									<dt class="targo-quant">Message</dt>
									<dd>{show(row.message)}</dd>
								</div>
								<div class="detail-item detail-wide">
									<dt class="targo-quant">Answers</dt>
									<dd>
										{#if answerEntries(row.answers).length > 0}
											<dl class="answers">
												{#each answerEntries(row.answers) as entry (entry[0])}
													<div>
														<dt class="targo-quant">{entry[0]}</dt>
														<dd>{answerText(entry[1])}</dd>
													</div>
												{/each}
											</dl>
										{:else}
											<span class="muted">—</span>
										{/if}
									</dd>
								</div>
								<div class="detail-item detail-wide">
									<dt class="targo-quant">Received</dt>
									<dd>{formatWhen(row.created_at)}</dd>
								</div>
							</dl>
						</div>
					{/if}
				</article>
			{/each}
		</div>
	{/if}
</div>

<style>
	/* Root band: the shared class only paints the background, so the inbox
	   owns its own inset. The 22px card chamfer eats top-left / bottom-right
	   corners, hence the generous card padding below. */
	.inbox {
		padding: clamp(18px, 4vw, 30px);
		color: #3d4653;
	}

	.inbox-head {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 18px;
	}

	.inbox-title {
		margin: 0;
		font-size: clamp(24px, 5vw, 34px);
		font-weight: 700;
		letter-spacing: 0.02em;
		text-transform: uppercase;
		color: #12212e;
	}

	.inbox-sub {
		margin: 6px 0 0;
		font-size: 12px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #3d4653;
	}

	.inbox-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	/* Toolbar buttons stay chamfered but drop to panel density. */
	.inbox-actions .targo-btn {
		padding: 12px 20px;
		min-height: 46px;
		font-size: 13px;
	}

	.alert {
		margin: 0 0 16px;
		padding: 12px 16px;
		border: 1px solid rgba(138, 43, 31, 0.3);
		border-left-width: 3px;
		background: rgba(138, 43, 31, 0.06);
		color: #8a2b1f;
		font-size: 14px;
	}

	/* ---- stat chips ---- */
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin: 0 0 18px;
		padding: 0;
		list-style: none;
	}

	.chip {
		display: flex;
		flex-direction: column;
		gap: 6px;
		min-width: 104px;
		padding: 12px 16px;
		border: 1px solid rgba(18, 33, 46, 0.1);
		background: #fff;
		clip-path: polygon(
			10px 0,
			100% 0,
			100% calc(100% - 10px),
			calc(100% - 10px) 100%,
			0 100%,
			0 10px
		);
	}

	.chip-label {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: #3d4653;
	}

	.chip-value {
		font-size: 26px;
		font-weight: 700;
		line-height: 1;
		color: #12212e;
	}

	.chip--new .chip-value {
		color: #0a6f8c;
	}

	.chip--read .chip-value {
		color: #3d4653;
	}

	.chip--replied .chip-value {
		color: #16794a;
	}

	/* ---- toolbar ---- */
	.toolbar {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		gap: 14px;
		margin-bottom: 18px;
		padding: 16px;
		border: 1px solid rgba(18, 33, 46, 0.1);
		background: rgba(18, 33, 46, 0.02);
	}

	.filters {
		display: flex;
		flex: 1 1 100%;
		flex-wrap: wrap;
		gap: 8px;
	}

	.filter-btn {
		min-height: 40px;
		padding: 10px 16px;
		border: 1px solid rgba(18, 33, 46, 0.18);
		background: #fff;
		color: #3d4653;
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		cursor: pointer;
		clip-path: polygon(
			8px 0,
			100% 0,
			100% calc(100% - 8px),
			calc(100% - 8px) 100%,
			0 100%,
			0 8px
		);
		transition:
			background 0.18s ease,
			color 0.18s ease,
			border-color 0.18s ease;
	}

	.filter-btn:hover {
		border-color: #15bcdf;
		color: #12212e;
	}

	.filter-btn[aria-pressed='true'] {
		border-color: #12212e;
		background: #12212e;
		color: #fff;
	}

	.field-block {
		flex: 1 1 240px;
		min-width: 0;
	}

	.sort-block {
		flex: 0 1 210px;
		min-width: 0;
	}

	/* ---- list + cards ---- */
	.list-meta {
		margin: 0 0 12px;
		font-size: 12px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #3d4653;
	}

	.list {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.row {
		padding: 24px 24px 26px;
	}

	.row-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 14px;
	}

	.row-toggle {
		display: flex;
		flex: 1 1 auto;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
		min-width: 0;
		min-height: 24px;
		margin: 0;
		padding: 0;
		border: 0;
		background: none;
		color: inherit;
		text-align: left;
		cursor: pointer;
	}

	.row-title {
		font-size: 17px;
		font-weight: 700;
		letter-spacing: 0.02em;
		text-transform: uppercase;
		color: #12212e;
	}

	.row-dash {
		color: rgba(18, 33, 46, 0.35);
	}

	.row-svc {
		font-size: 13px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: #0a6f8c;
	}

	.chev {
		flex: none;
		color: #3d4653;
		transition: transform 0.2s ease;
	}

	.chev-open {
		transform: rotate(180deg);
	}

	.pill {
		flex: none;
		padding: 6px 12px;
		border: 1px solid;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}

	.pill--new {
		border-color: rgba(21, 188, 223, 0.45);
		background: rgba(21, 188, 223, 0.12);
		color: #0a6f8c;
	}

	.pill--read {
		border-color: rgba(18, 33, 46, 0.18);
		background: rgba(18, 33, 46, 0.05);
		color: #3d4653;
	}

	.pill--replied {
		border-color: rgba(22, 121, 74, 0.32);
		background: rgba(22, 121, 74, 0.1);
		color: #16794a;
	}

	.row-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
		margin: 10px 0 0;
		font-size: 13px;
		color: #3d4653;
	}

	.dot {
		color: rgba(18, 33, 46, 0.35);
	}

	.svc-link {
		color: #0a6f8c;
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.svc-link:hover {
		color: #15bcdf;
	}

	/* ---- per-enquiry actions ---- */
	.acts {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 16px;
	}

	.act {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 40px;
		padding: 10px 14px;
		border: 1px solid rgba(18, 33, 46, 0.18);
		background: #fff;
		color: #12212e;
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-decoration: none;
		text-transform: uppercase;
		cursor: pointer;
		clip-path: polygon(
			8px 0,
			100% 0,
			100% calc(100% - 8px),
			calc(100% - 8px) 100%,
			0 100%,
			0 8px
		);
		transition:
			background 0.18s ease,
			color 0.18s ease,
			border-color 0.18s ease;
	}

	.act:hover {
		border-color: #12212e;
		background: #12212e;
		color: #fff;
	}

	.act-primary {
		border-color: #15bcdf;
		background: #15bcdf;
		color: #12212e;
	}

	.act-primary:hover {
		border-color: #12212e;
		background: #12212e;
		color: #fff;
	}

	/* ---- expanded detail ---- */
	.detail-wrap {
		margin-top: 18px;
		padding-top: 16px;
		border-top: 1px solid rgba(18, 33, 46, 0.1);
	}

	.detail-title {
		margin: 0 0 14px;
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: #12212e;
	}

	.detail {
		display: grid;
		grid-template-columns: 1fr;
		gap: 12px;
		margin: 0;
	}

	.detail-item {
		margin: 0;
		padding: 12px 14px;
		border: 1px solid rgba(18, 33, 46, 0.07);
		background: rgba(18, 33, 46, 0.03);
	}

	.detail-item dt {
		margin-bottom: 6px;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #3d4653;
	}

	.detail-item dd {
		margin: 0;
		font-size: 15px;
		color: #12212e;
		overflow-wrap: anywhere;
		white-space: pre-wrap;
	}

	.answers {
		display: grid;
		gap: 6px;
		margin: 0;
	}

	.answers > div {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.detail-item .answers dt {
		margin-bottom: 0;
		font-size: 12px;
		color: #0a6f8c;
	}

	.detail-item .answers dd {
		margin: 0;
		font-size: 14px;
		color: #12212e;
	}

	.muted {
		color: #3d4653;
	}

	/* ---- empty states ---- */
	.empty {
		padding: 30px 6px;
		text-align: center;
	}

	.empty p {
		margin: 0 0 14px;
		font-size: 15px;
		color: #3d4653;
	}

	/* ---- responsive detail grid ---- */
	@media (min-width: 640px) {
		.detail {
			grid-template-columns: 1fr 1fr;
		}

		.detail-wide {
			grid-column: 1 / -1;
		}
	}

	/* ---- focus + motion ---- */
	.filter-btn:focus-visible,
	.row-toggle:focus-visible,
	.act:focus-visible,
	.svc-link:focus-visible {
		outline: 2px solid #15bcdf;
		outline-offset: 3px;
	}

	@media (prefers-reduced-motion: reduce) {
		.chev,
		.act,
		.filter-btn {
			transition: none;
		}
	}
</style>
