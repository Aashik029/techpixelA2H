<script lang="ts">
	import { onMount } from 'svelte';
	import { waHref, type Enquiry } from './enquiry';
	import { setEnquiryStatus } from './store.svelte';

	/**
	 * Per-enquiry action set (WhatsApp / Call / Copy phone / Mark read /
	 * Mark replied). Rendered inside table rows AND inside the detail drawer
	 * so both surfaces expose the same testids; the page hides the row copies
	 * while the drawer is open, keeping each testid single-instance visible.
	 */
	let { row }: { row: Enquiry } = $props();

	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	onMount(() => () => {
		if (timer !== undefined) clearTimeout(timer);
	});

	async function copyPhone(): Promise<void> {
		try {
			await navigator.clipboard.writeText(row.phone);
		} catch {
			// Contexts without the async clipboard API fall back to execCommand.
			try {
				const field = document.createElement('textarea');
				field.value = row.phone;
				field.setAttribute('readonly', '');
				field.style.position = 'fixed';
				field.style.top = '-1000px';
				field.style.opacity = '0';
				document.body.appendChild(field);
				field.select();
				const ok = document.execCommand('copy');
				field.remove();
				if (!ok) return;
			} catch {
				return;
			}
		}
		copied = true;
		if (timer !== undefined) clearTimeout(timer);
		timer = setTimeout(() => {
			copied = false;
			timer = undefined;
		}, 1600);
	}
</script>

<div class="adm-actions enq-acts">
	<a
		class="adm-btn adm-btn--primary adm-btn--sm"
		data-testid="admin-whatsapp"
		href={waHref(row)}
		target="_blank"
		rel="noreferrer"
		aria-label="WhatsApp {row.name}">WhatsApp</a
	>
	<a class="adm-btn adm-btn--sm" data-testid="admin-call" href="tel:{row.phone}" aria-label="Call {row.name}"
		>Call</a
	>
	<button
		type="button"
		class="adm-btn adm-btn--ghost adm-btn--sm"
		data-testid="admin-copy-phone"
		onclick={copyPhone}
		aria-label="Copy phone number of {row.name}">{copied ? 'Copied' : 'Copy phone'}</button
	>
	<button
		type="button"
		class="adm-btn adm-btn--ghost adm-btn--sm"
		data-testid="admin-mark-read"
		onclick={() => setEnquiryStatus(row.id, 'read')}
		aria-label="Mark enquiry from {row.name} as read">Mark read</button
	>
	<button
		type="button"
		class="adm-btn adm-btn--ghost adm-btn--sm"
		data-testid="admin-mark-replied"
		onclick={() => setEnquiryStatus(row.id, 'replied')}
		aria-label="Mark enquiry from {row.name} as replied">Mark replied</button
	>
</div>

<style>
	/* Density pass: five controls share one table cell, so the buttons drop
	   below .adm-btn--sm sizing while staying >= 30px targets (WCAG 2.2 AA
	   needs 24px). Unlayered, so it wins over @layer components. */
	.enq-acts {
		gap: 6px;
	}

	.enq-acts :global(.adm-btn) {
		min-height: 30px;
		padding: 6px 8px;
		font-size: 10px;
		letter-spacing: 0.06em;
	}
</style>
