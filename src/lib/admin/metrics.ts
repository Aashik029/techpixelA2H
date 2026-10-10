/**
 * Pure enquiry analytics. No runes, no Supabase, no DOM — every function is
 * safe on empty arrays and malformed dates (dates go through `stamp`, so a
 * bad `created_at` becomes 0 and simply falls outside any recent window).
 */

import { stamp, type Enquiry } from './enquiry';

export interface Counts {
	total: number;
	new: number;
	read: number;
	replied: number;
}

const MONTHS = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec'
];

/** Defensive copy of the row list: never throws on a bad caller. */
function safe(rows: Enquiry[]): Enquiry[] {
	return Array.isArray(rows) ? rows : [];
}

/** Local midnight, `offsetDays` before today (negative = future). */
function startOfLocalDay(offsetDays: number): Date {
	const now = new Date();
	return new Date(now.getFullYear(), now.getMonth(), now.getDate() - offsetDays);
}

/** Local `YYYY-MM-DD` key (never uses toISOString, so no UTC day-shift). */
function dayKey(d: Date): string {
	const month = `${d.getMonth() + 1}`.padStart(2, '0');
	const day = `${d.getDate()}`.padStart(2, '0');
	return `${d.getFullYear()}-${month}-${day}`;
}

/** Total rows plus a per-status tally (mirrors the legacy inbox chips). */
export function statusCounts(rows: Enquiry[]): Counts {
	const list = safe(rows);
	let fresh = 0;
	let seen = 0;
	let done = 0;
	for (const row of list) {
		if (row.status === 'new') fresh += 1;
		else if (row.status === 'read') seen += 1;
		else if (row.status === 'replied') done += 1;
	}
	return { total: list.length, new: fresh, read: seen, replied: done };
}

/** Per-service totals, descending by count; equal counts keep first-seen order. */
export function serviceBreakdown(rows: Enquiry[]): { service: string; count: number }[] {
	const order: string[] = [];
	const counts = new Map<string, number>();
	for (const row of safe(rows)) {
		const service = String(row.service ?? '').trim();
		if (!counts.has(service)) order.push(service);
		counts.set(service, (counts.get(service) ?? 0) + 1);
	}
	const out = order.map((service) => ({ service, count: counts.get(service) ?? 0 }));
	// Array.prototype.sort is stable, so ties hold their first-seen position.
	out.sort((a, b) => b.count - a.count);
	return out;
}

/** Sorted unique non-empty service names (for filter/select options). */
export function distinctServices(rows: Enquiry[]): string[] {
	const seen = new Set<string>();
	for (const row of safe(rows)) {
		const service = String(row.service ?? '').trim();
		if (service !== '') seen.add(service);
	}
	return [...seen].sort();
}

/**
 * One bucket per local day for the last `days` days, oldest → newest.
 * Zero-count days are included; `date` is local `YYYY-MM-DD`; `label` is a
 * deterministic short date (`Oct 6`) safe to render on a chart axis.
 */
export function dailyBreakdown(
	rows: Enquiry[],
	days: number
): { date: string; label: string; count: number }[] {
	const out: { date: string; label: string; count: number }[] = [];
	if (!Number.isFinite(days) || days < 1) return out;
	const span = Math.floor(days);

	const counts = new Map<string, number>();
	for (const row of safe(rows)) {
		const at = stamp(row);
		if (at === 0) continue; // malformed date — never pollutes a bucket
		const key = dayKey(new Date(at));
		counts.set(key, (counts.get(key) ?? 0) + 1);
	}

	const today = startOfLocalDay(0);
	for (let offset = span - 1; offset >= 0; offset -= 1) {
		const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset);
		const date = dayKey(d);
		out.push({
			date,
			label: `${MONTHS[d.getMonth()]} ${d.getDate()}`,
			count: counts.get(date) ?? 0
		});
	}
	return out;
}

/**
 * Rows from the last `days` local calendar days (today included).
 * `'all'` returns every row; a non-positive/NaN window returns none.
 */
export function withinDays(rows: Enquiry[], days: number | 'all'): Enquiry[] {
	const list = safe(rows);
	if (days === 'all') return list.slice();
	if (!Number.isFinite(days) || days < 1) return [];
	const from = startOfLocalDay(Math.floor(days) - 1).getTime();
	return list.filter((row) => stamp(row) >= from);
}

/** Unactioned enquiries (`status === 'new'`), oldest first. */
export function needsAttention(rows: Enquiry[]): Enquiry[] {
	return safe(rows)
		.filter((row) => row.status === 'new')
		.sort((a, b) => stamp(a) - stamp(b));
}

/** The `n` newest rows, newest first. Non-positive `n` yields []. */
export function recentRows(rows: Enquiry[], n: number): Enquiry[] {
	if (!Number.isFinite(n) || n < 1) return [];
	return safe(rows)
		.slice()
		.sort((a, b) => stamp(b) - stamp(a))
		.slice(0, Math.floor(n));
}

/**
 * Last 7 local days minus the 7 days before that (days 7–13 ago).
 * Empty input → 0; malformed dates never count.
 */
export function weekDelta(rows: Enquiry[]): number {
	const recent = withinDays(rows, 7).length;
	const previous = withinDays(rows, 14).length - recent;
	return recent - previous;
}
