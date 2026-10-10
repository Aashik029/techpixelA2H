/**
 * Enquiry domain helpers + CSV export.
 *
 * Pure module (no runes, no Supabase, no DOM at import time) relocated
 * verbatim from EnquiriesInbox.svelte so the admin pages and the legacy
 * inbox share byte-identical formatting/search/WhatsApp/CSV semantics.
 */

export type EnquiryStatus = 'new' | 'read' | 'replied';

export interface Enquiry {
	id: string;
	created_at: string;
	name: string;
	email: string;
	phone: string;
	service: string;
	answers: unknown;
	budget: string;
	timeline: string;
	subject: string;
	message: string;
	status: EnquiryStatus;
	/** Signed-in account behind the enquiry; absent/null on legacy + anon rows. */
	user_id?: string | null;
}

const CSV_HEADER = [
	'created_at',
	'name',
	'email',
	'phone',
	'service',
	'budget',
	'timeline',
	'subject',
	'message',
	'status'
];

/* ---------- client-side view helpers (no server round-trips) ---------- */

/** NaN-safe parse of `created_at`; malformed rows sort as epoch (0). */
export function stamp(row: Enquiry): number {
	const at = Date.parse(row.created_at);
	return Number.isNaN(at) ? 0 : at;
}

/** Lowercased search blob over the free-text columns. */
export function haystack(row: Enquiry): string {
	return [row.name, row.phone, row.service, row.subject, row.message]
		.map((value) => (value == null ? '' : String(value)))
		.join(' ')
		.toLowerCase();
}

/** Localised timestamp, `—` when the ISO value is unparseable. */
export function formatWhen(iso: string): string {
	const at = new Date(iso ?? '');
	return Number.isNaN(at.getTime()) ? '—' : at.toLocaleString();
}

/** Display value with an em-dash fallback for null/undefined/blank. */
export function show(value: unknown): string {
	if (value === null || value === undefined) return '—';
	const text = String(value).trim();
	return text === '' ? '—' : text;
}

/** Answers JSON as entries: arrays become `Item 1..n`, objects keep keys. */
export function answerEntries(answers: unknown): Array<[string, unknown]> {
	if (Array.isArray(answers)) {
		return answers.map((value, index) => [`Item ${index + 1}`, value] as [string, unknown]);
	}
	if (answers !== null && typeof answers === 'object') {
		return Object.entries(answers as Record<string, unknown>);
	}
	return [];
}

/** Single-line rendering of one answer value, `—` for empty/unserialisable. */
export function answerText(value: unknown): string {
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

/** wa.me deep link: 10-digit numbers get the `91` India prefix + greeting. */
export function waHref(row: Enquiry): string {
	const digits = (row.phone ?? '').replace(/\D/g, '');
	const target = digits.length === 10 ? `91${digits}` : digits;
	const text = `Hi ${row.name}, thanks for your enquiry about ${row.service}.`;
	return `https://wa.me/${target}?text=${encodeURIComponent(text)}`;
}

/** RFC-style CSV cell: quote when the value holds `"`, `,`, CR or LF. */
export function csvCell(value: unknown): string {
	const text = value === null || value === undefined ? '' : String(value);
	return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/* ---------- CSV export ---------- */

/** Full CSV body: header line + one line per row, joined with `\r\n`. */
export function enquiriesToCsv(rows: Enquiry[]): string {
	const lines = [CSV_HEADER.join(',')];
	for (const row of rows) {
		lines.push(
			[
				row.created_at,
				row.name,
				row.email,
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
	return lines.join('\r\n');
}

/** Blob + temp-anchor download (`enquiries-YYYY-MM-DD.csv`). SSR-safe. */
export function downloadCsv(rows: Enquiry[]): void {
	if (typeof document === 'undefined') return;
	const blob = new Blob([enquiriesToCsv(rows)], { type: 'text/csv;charset=utf-8' });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement('a');
	anchor.href = url;
	anchor.download = `enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
	document.body.appendChild(anchor);
	anchor.click();
	anchor.remove();
	URL.revokeObjectURL(url);
}
