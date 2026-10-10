<script lang="ts">
	import {
		dailyBreakdown,
		distinctServices,
		serviceBreakdown,
		statusCounts,
		weekDelta
	} from '$lib/admin/metrics';
	import { enquiriesStore, loadEnquiries } from '$lib/admin/store.svelte';

	/** Trend window in days; the header chips switch it client-side (no refetch). */
	const RANGES: number[] = [7, 14, 30];

	let range = $state(14);

	// Read the store through its getters — never destructure — so every $derived
	// below stays reactive to the module-level $state.
	const rows = $derived(enquiriesStore.rows);
	const loading = $derived(enquiriesStore.loading);
	const loaded = $derived(enquiriesStore.loaded);
	const error = $derived(enquiriesStore.error);

	const counts = $derived(statusCounts(rows));
	const services = $derived(serviceBreakdown(rows));
	const serviceNames = $derived(distinctServices(rows));
	const delta = $derived(weekDelta(rows));
	const daily = $derived(dailyBreakdown(rows, range));
	// Range-scoped sums are built from the same daily buckets the trend chart
	// renders, so the KPI row and the chart can never disagree.
	const last7Total = $derived(dailyBreakdown(rows, 7).reduce((sum, day) => sum + day.count, 0));

	/** Chart model for the selected window: exact % heights, ~6 axis ticks,
	 *  and the busiest day flagged for the peak highlight. */
	const chart = $derived.by(() => {
		const days = daily;
		const total = days.reduce((sum, day) => sum + day.count, 0);
		const max = days.reduce((peak, day) => Math.max(peak, day.count), 0);
		const step = Math.max(1, Math.ceil(days.length / 6));
		return {
			total,
			max,
			peak: max > 0 ? (days.find((day) => day.count === max) ?? null) : null,
			bars: days.map((day, index) => ({
				...day,
				height: max > 0 && day.count > 0 ? (day.count / max) * 100 : 0,
				isPeak: max > 0 && day.count === max,
				showLabel: index % step === 0,
				align: index === 0 ? 'left' : index + step >= days.length ? 'right' : 'center'
			}))
		};
	});

	const avgPerDay = $derived(chart.total / Math.max(range, 1));
	const maxService = $derived(services.length > 0 ? services[0].count : 0);

	const deltaClass = $derived(
		delta > 0 ? 'adm-kpi-delta--up' : delta < 0 ? 'adm-kpi-delta--down' : ''
	);
	const deltaText = $derived(`${delta > 0 ? '+' : ''}${delta} vs previous 7 days`);

	const trendMeta = $derived(
		`Last ${range} days · ${chart.total} total${chart.peak ? ` · Peak ${chart.peak.label}` : ''}`
	);

	const chartSummary = $derived(
		chart.peak
			? `Enquiries per day over the last ${range} days: ${chart.total} total, peaking at ${chart.peak.count} on ${chart.peak.label}.`
			: `Enquiries per day over the last ${range} days: no enquiries recorded in this window.`
	);

	const statusSummary = $derived(
		`Status split of ${counts.total} enquiries: ${counts.new} new (${fmtPct(counts.new, counts.total)}), ${counts.read} read (${fmtPct(counts.read, counts.total)}), ${counts.replied} replied (${fmtPct(counts.replied, counts.total)}).`
	);

	/** Percent with one decimal only when needed — never a misleading round-up. */
	function fmtPct(value: number, total: number): string {
		if (total <= 0) return '0%';
		return `${Math.round((value / total) * 1000) / 10}%`;
	}

	/** Bar/segment width as a share of `total` (0-safe). */
	function share(value: number, total: number): number {
		return total > 0 ? (value / total) * 100 : 0;
	}

	function plural(count: number): string {
		return count === 1 ? 'enquiry' : 'enquiries';
	}
</script>

<svelte:head>
	<title>Analytics — Tech Pixel A2H Admin</title>
</svelte:head>

<header class="a-head">
	<div>
		<h1 class="adm-h1">Analytics</h1>
		<p class="adm-sub">Volume, service mix and response progress across all enquiries.</p>
	</div>
	<div class="a-controls">
		<div class="adm-actions" role="group" aria-label="Date range">
			{#each RANGES as option (option)}
				<button
					type="button"
					class="adm-chip"
					aria-pressed={range === option}
					aria-label="Last {option} days"
					onclick={() => (range = option)}
				>
					{option} days
				</button>
			{/each}
		</div>
		<button
			type="button"
			class="adm-btn"
			data-testid="admin-analytics-refresh"
			onclick={loadEnquiries}
			disabled={loading}
		>
			Refresh
		</button>
	</div>
</header>

{#if error}
	<div class="adm-alert" role="alert">Could not load analytics data: {error}</div>
{/if}

{#if loaded}
	{#if rows.length === 0}
		<section class="adm-panel">
			<div class="adm-empty" role="status">
				<p class="adm-empty-title">No data yet — analytics will appear once enquiries arrive.</p>
			</div>
		</section>
	{:else}
		<section class="a-kpis" aria-label="Key metrics">
			<div class="adm-kpi-grid">
				<div class="adm-kpi">
					<span class="adm-kpi-label">Total enquiries</span>
					<span class="adm-kpi-value">{counts.total}</span>
					<span class="adm-kpi-delta">
						{serviceNames.length}
						{serviceNames.length === 1 ? 'service' : 'services'} tracked
					</span>
				</div>

				<div class="adm-kpi adm-kpi--new">
					<span class="adm-kpi-label">Needs attention</span>
					<span class="adm-kpi-value">{counts.new}</span>
					<span class="adm-kpi-delta">New — awaiting reply</span>
				</div>

				<div class="adm-kpi adm-kpi--replied">
					<span class="adm-kpi-label">Replied</span>
					<span class="adm-kpi-value">{counts.replied}</span>
					<span class="adm-kpi-delta">{fmtPct(counts.replied, counts.total)} of all</span>
				</div>

				<div class="adm-kpi">
					<span class="adm-kpi-label">Last 7 days</span>
					<span class="adm-kpi-value">{last7Total}</span>
					<span class="adm-kpi-delta {deltaClass}">{deltaText}</span>
				</div>

				<div class="adm-kpi">
					<span class="adm-kpi-label">Avg / day</span>
					<span class="adm-kpi-value">{avgPerDay.toFixed(1)}</span>
					<span class="adm-kpi-delta">Over last {range} days</span>
				</div>
			</div>
		</section>

		<!-- ---- trend ---------------------------------------------------- -->
		<section class="adm-panel" aria-labelledby="trend-title">
			<div class="adm-panel-head">
				<div>
					<p class="adm-eyebrow">Trend</p>
					<h2 class="adm-panel-title" id="trend-title">Enquiries over time</h2>
				</div>
				<p class="adm-meta a-flush">{trendMeta}</p>
			</div>

			<div class="chart" role="group" aria-label={chartSummary}>
				<div class="chart-y" aria-hidden="true">
					<span class="adm-meta a-flush">{chart.max}</span>
					<span class="adm-meta a-flush">0</span>
				</div>
				<div class="chart-body">
					<div class="chart-plot" style="min-width: {daily.length * 24}px">
						<div class="grid-line" style="top: 0"></div>
						<div class="grid-line" style="top: calc((100% - var(--x-lab-h)) / 2)"></div>
						<div class="grid-line grid-line--base"></div>
						<div class="bars" style="--cols: {daily.length}">
							{#each chart.bars as bar (bar.date)}
								<div class="bar-col">
									<button
										type="button"
										class="bar-hit"
										title={`${bar.label} · ${bar.count} ${plural(bar.count)}${bar.isPeak ? ' (peak)' : ''}`}
										aria-label={`${bar.label}: ${bar.count} ${plural(bar.count)}${bar.isPeak ? ', peak day' : ''}`}
									>
										<span
											class="bar"
											class:peak={bar.isPeak}
											style="height: {bar.height}%"></span>
									</button>
									<span class="xlab adm-meta" style="text-align: {bar.align}"
										>{bar.showLabel ? bar.label : ''}</span
									>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>

			<!-- Screen-reader / no-visual fallback for the chart. -->
			<table class="adm-table vh">
				<caption>Enquiries per day — last {range} days</caption>
				<thead>
					<tr>
						<th scope="col">Date</th>
						<th scope="col">Enquiries</th>
					</tr>
				</thead>
				<tbody>
					{#each daily as day (day.date)}
						<tr>
							<th scope="row">{day.label}</th>
							<td>{day.count}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</section>

		<!-- ---- service + status ------------------------------------------ -->
		<div class="a-grid">
			<section class="adm-panel" aria-labelledby="service-title">
				<div class="adm-panel-head">
					<div>
						<p class="adm-eyebrow">Distribution</p>
						<h2 class="adm-panel-title" id="service-title">By service</h2>
					</div>
					<p class="adm-meta a-flush">{serviceNames.length} services</p>
				</div>

				<ul class="a-svc">
					{#each services as service (service.service)}
						<li class="a-svc-row">
							<span class="a-svc-name" title={service.service || 'Unspecified'}
								>{service.service || 'Unspecified'}</span
							>
							<span class="a-track" aria-hidden="true">
								<span class="a-fill" style="width: {share(service.count, maxService)}%"></span>
							</span>
							<span class="adm-badge">{service.count}</span>
						</li>
					{/each}
				</ul>
			</section>

			<section class="adm-panel" aria-labelledby="status-title">
				<div class="adm-panel-head">
					<div>
						<p class="adm-eyebrow">Triage</p>
						<h2 class="adm-panel-title" id="status-title">By status</h2>
					</div>
					<p class="adm-meta a-flush">{counts.total} total</p>
				</div>

				<div class="a-seg" role="img" aria-label={statusSummary}>
					<span
						class="a-seg-part a-seg-part--new"
						style="width: {share(counts.new, counts.total)}%"
						title="New: {counts.new} ({fmtPct(counts.new, counts.total)})"></span>
					<span
						class="a-seg-part a-seg-part--read"
						style="width: {share(counts.read, counts.total)}%"
						title="Read: {counts.read} ({fmtPct(counts.read, counts.total)})"></span>
					<span
						class="a-seg-part a-seg-part--replied"
						style="width: {share(counts.replied, counts.total)}%"
						title="Replied: {counts.replied} ({fmtPct(counts.replied, counts.total)})"></span>
				</div>

				<ul class="a-legend">
					<li class="a-legend-row">
						<span class="adm-pill adm-pill--new">New</span>
						<span class="a-legend-n">{counts.new}</span>
						<span class="a-legend-p adm-meta a-flush">{fmtPct(counts.new, counts.total)}</span>
					</li>
					<li class="a-legend-row">
						<span class="adm-pill adm-pill--read">Read</span>
						<span class="a-legend-n">{counts.read}</span>
						<span class="a-legend-p adm-meta a-flush">{fmtPct(counts.read, counts.total)}</span>
					</li>
					<li class="a-legend-row">
						<span class="adm-pill adm-pill--replied">Replied</span>
						<span class="a-legend-n">{counts.replied}</span>
						<span class="a-legend-p adm-meta a-flush">{fmtPct(counts.replied, counts.total)}</span>
					</li>
				</ul>
			</section>
		</div>

		<!-- ---- funnel ----------------------------------------------------- -->
		<section class="adm-panel" aria-labelledby="funnel-title">
			<div class="adm-panel-head">
				<div>
					<p class="adm-eyebrow">Progression</p>
					<h2 class="adm-panel-title" id="funnel-title">Response funnel</h2>
				</div>
				<p class="adm-meta a-flush">Share of all enquiries</p>
			</div>

			<ol class="a-funnel">
				<li class="a-funnel-step">
					<div class="a-funnel-top">
						<span class="adm-pill adm-pill--new">New</span>
						<span class="a-funnel-n">{counts.new}</span>
						<span class="a-funnel-pct adm-meta a-flush"
							>{fmtPct(counts.new, counts.total)}</span
						>
					</div>
					<div class="a-track" aria-hidden="true">
						<span class="a-fill a-fill--new" style="width: {share(counts.new, counts.total)}%"
						></span>
					</div>
				</li>
				<li class="a-funnel-step">
					<div class="a-funnel-top">
						<span class="adm-pill adm-pill--read">Read</span>
						<span class="a-funnel-n">{counts.read}</span>
						<span class="a-funnel-pct adm-meta a-flush"
							>{fmtPct(counts.read, counts.total)}</span
						>
					</div>
					<div class="a-track" aria-hidden="true">
						<span class="a-fill a-fill--read" style="width: {share(counts.read, counts.total)}%"
						></span>
					</div>
				</li>
				<li class="a-funnel-step">
					<div class="a-funnel-top">
						<span class="adm-pill adm-pill--replied">Replied</span>
						<span class="a-funnel-n">{counts.replied}</span>
						<span class="a-funnel-pct adm-meta a-flush"
							>{fmtPct(counts.replied, counts.total)}</span
						>
					</div>
					<div class="a-track" aria-hidden="true">
						<span
							class="a-fill a-fill--replied"
							style="width: {share(counts.replied, counts.total)}%"></span>
					</div>
				</li>
			</ol>
		</section>
	{/if}
{:else if !error}
	<section class="adm-panel">
		<p class="adm-loading" role="status">Loading analytics…</p>
	</section>
{/if}

<style>
	/* ---- page frame (the shell already applies .adm-page) ---------------- */
	.a-head {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: 16px 24px;
		margin-bottom: 20px;
	}

	.a-controls {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 10px;
	}

	.a-kpis {
		margin-bottom: 18px;
	}

	.a-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 18px;
		margin-bottom: 18px;
	}

	/* Two half-width panels: cancel admin.css's vertical stack rule inside. */
	.a-grid .adm-panel + .adm-panel {
		margin-top: 0;
	}

	/* Unlayered margin reset — beats .adm-meta's layered `margin: 0 0 12px`. */
	.a-flush {
		margin: 0;
	}

	/* ---- trend chart ------------------------------------------------------ */
	.chart {
		--x-lab-h: 24px;
		display: flex;
		align-items: stretch;
		gap: 10px;
	}

	.chart-y {
		flex: none;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-end;
		padding-bottom: var(--x-lab-h);
	}

	.chart-y span {
		display: block;
	}

	.chart-y span:first-child {
		transform: translateY(-50%);
	}

	.chart-y span:last-child {
		transform: translateY(50%);
	}

	.chart-body {
		flex: 1 1 auto;
		min-width: 0;
		overflow-x: auto;
	}

	.chart-plot {
		position: relative;
		height: 200px;
	}

	.grid-line {
		position: absolute;
		left: 0;
		right: 0;
		height: 1px;
		background: var(--adm-line);
	}

	.grid-line--base {
		bottom: var(--x-lab-h);
	}

	.bars {
		position: absolute;
		inset: 0;
		z-index: 1;
		display: grid;
		grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
		gap: 3px;
	}

	.bar-col {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.bar-hit {
		flex: 1 1 auto;
		min-height: 0;
		display: flex;
		align-items: flex-end;
		padding: 0;
		border: 0;
		background: transparent;
		cursor: pointer;
	}

	.bar {
		display: block;
		box-sizing: border-box;
		width: 100%;
		background: var(--adm-cyan-dark);
	}

	.bar.peak {
		background: var(--adm-ink);
		border-top: 3px solid var(--adm-cyan);
	}

	.bar-hit:hover .bar,
	.bar-hit:focus-visible .bar {
		background: var(--adm-cyan);
	}

	.bar-hit:focus-visible {
		outline: 2px solid var(--adm-cyan);
		outline-offset: 2px;
	}

	.xlab {
		display: block;
		height: calc(var(--x-lab-h) - 4px);
		margin: 4px 0 0;
		font-size: 10px;
		letter-spacing: 0.06em;
		white-space: nowrap;
	}

	/* ---- horizontal bars (services + funnel share the track/fill) ---------- */
	.a-svc {
		display: grid;
		gap: 14px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.a-svc-row {
		display: grid;
		grid-template-columns: minmax(88px, 1.2fr) minmax(0, 3fr) auto;
		align-items: center;
		gap: 12px;
	}

	.a-svc-name {
		overflow: hidden;
		font-family: var(--adm-body);
		font-size: 14px;
		color: var(--adm-ink);
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.a-track {
		display: block;
		box-sizing: border-box;
		height: 14px;
		border: 1px solid var(--adm-line);
		background: var(--adm-wash);
		overflow: hidden;
	}

	.a-fill {
		display: block;
		height: 100%;
		background: var(--adm-cyan-dark);
	}

	.a-fill--new {
		background: var(--adm-cyan-dark);
	}

	.a-fill--read {
		background: var(--adm-muted);
	}

	.a-fill--replied {
		background: var(--adm-green);
	}

	/* ---- status segmented bar + legend ------------------------------------- */
	.a-seg {
		display: flex;
		box-sizing: border-box;
		width: 100%;
		height: 30px;
		border: 1px solid var(--adm-line-strong);
		background: var(--adm-wash);
		overflow: hidden;
		clip-path: polygon(
			var(--adm-chamfer-sm) 0,
			100% 0,
			100% calc(100% - var(--adm-chamfer-sm)),
			calc(100% - var(--adm-chamfer-sm)) 100%,
			0 100%,
			0 var(--adm-chamfer-sm)
		);
	}

	.a-seg-part {
		display: block;
		height: 100%;
	}

	.a-seg-part--new {
		background: var(--adm-cyan-dark);
	}

	.a-seg-part--read {
		background: var(--adm-muted);
	}

	.a-seg-part--replied {
		background: var(--adm-green);
	}

	.a-legend {
		display: grid;
		gap: 10px;
		margin: 16px 0 0;
		padding: 0;
		list-style: none;
	}

	.a-legend-row {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.a-legend-n {
		font-family: var(--adm-quant);
		font-size: 14px;
		font-weight: 700;
		color: var(--adm-ink);
		font-variant-numeric: tabular-nums;
	}

	.a-legend-p {
		margin-left: auto;
	}

	/* ---- response funnel ---------------------------------------------------- */
	.a-funnel {
		display: grid;
		gap: 16px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.a-funnel-top {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px;
		margin-bottom: 8px;
	}

	.a-funnel-n {
		font-family: var(--adm-quant);
		font-size: 15px;
		font-weight: 700;
		color: var(--adm-ink);
		font-variant-numeric: tabular-nums;
	}

	.a-funnel-pct {
		margin-left: auto;
	}

	/* ---- visually-hidden data table (chart's accessible fallback) ------------ */
	.vh {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;
		border: 0;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	@media (max-width: 640px) {
		.chart-plot {
			height: 170px;
		}

		.a-svc-row {
			grid-template-columns: minmax(64px, 1fr) minmax(0, 2fr) auto;
			gap: 8px;
		}
	}
</style>
