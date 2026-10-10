<script lang="ts">
	import EnquiryActions from './EnquiryActions.svelte';
	import { answerEntries, answerText, formatWhen, show, type Enquiry } from './enquiry';

	/**
	 * Right-side detail slide-over for one enquiry. Handles its own focus
	 * management: focus lands in the dialog on open, Tab is trapped inside,
	 * Esc and the backdrop close it; the parent restores focus to the row
	 * trigger once `onclose` flips the drawer out of the DOM.
	 */
	let { row, onclose }: { row: Enquiry; onclose: () => void } = $props();

	const FOCUSABLE =
		'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

	let dialogEl = $state<HTMLDivElement | null>(null);

	const answers = $derived(answerEntries(row.answers));

	// Move focus into the drawer as soon as it is bound.
	$effect(() => {
		dialogEl?.focus();
	});

	// Esc closes; Tab/Shift+Tab cycle through the drawer's own controls only.
	$effect(() => {
		const root = dialogEl;
		const close = onclose;

		function onKeydown(event: KeyboardEvent): void {
			if (event.key === 'Escape') {
				event.preventDefault();
				close();
				return;
			}
			if (event.key !== 'Tab' || !root) return;
			const focusable = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
				(el) => el.offsetParent !== null
			);
			if (focusable.length === 0) return;
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			const active = document.activeElement;
			const inside = active !== null && root.contains(active);
			if (event.shiftKey) {
				if (!inside || active === first || active === root) {
					event.preventDefault();
					last.focus();
				}
			} else if (!inside || active === last || active === root) {
				event.preventDefault();
				first.focus();
			}
		}

		window.addEventListener('keydown', onKeydown);
		return () => window.removeEventListener('keydown', onKeydown);
	});
</script>

<button type="button" class="adm-drawer-backdrop" aria-label="Dismiss enquiry details" onclick={onclose}
></button>

<div
	class="adm-drawer"
	role="dialog"
	aria-modal="true"
	aria-labelledby="enquiry-drawer-title"
	tabindex="-1"
	bind:this={dialogEl}
>
	<div class="adm-drawer-head">
		<div class="drawer-ident">
			<h2 class="drawer-title" id="enquiry-drawer-title">{row.name}</h2>
			<span class="adm-pill adm-pill--{row.status}">{row.status}</span>
		</div>
		<button
			type="button"
			class="adm-drawer-close"
			aria-label="Close enquiry details"
			onclick={onclose}
		>
			<svg
				viewBox="0 0 24 24"
				width="16"
				height="16"
				aria-hidden="true"
				focusable="false"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
			>
				<path d="M18 6 6 18" />
				<path d="m6 6 12 12" />
			</svg>
		</button>
	</div>

	<div class="adm-drawer-body">
		<dl class="drawer-dl">
			<div>
				<dt>Phone</dt>
				<dd>{show(row.phone)}</dd>
			</div>
			<div>
				<dt>Email</dt>
				<dd data-testid="admin-enquiry-email">{show(row.email)}</dd>
			</div>
			{#if row.user_id}
				<div>
					<dt>Customer ID</dt>
					<dd class="cust-id">{row.user_id.slice(0, 8)}…</dd>
				</div>
			{/if}
			<div>
				<dt>Service</dt>
				<dd>{show(row.service)}</dd>
			</div>
			<div>
				<dt>Budget</dt>
				<dd>{show(row.budget)}</dd>
			</div>
			<div>
				<dt>Timeline</dt>
				<dd>{show(row.timeline)}</dd>
			</div>
			<div class="wide">
				<dt>Subject</dt>
				<dd>{show(row.subject)}</dd>
			</div>
			<div class="wide">
				<dt>Message</dt>
				<dd>{show(row.message)}</dd>
			</div>
			<div class="wide">
				<dt>Answers</dt>
				<dd>
					{#if answers.length > 0}
						<dl class="answers">
							{#each answers as [key, value] (key)}
								<div>
									<dt>{key}</dt>
									<dd>{answerText(value)}</dd>
								</div>
							{/each}
						</dl>
					{:else}
						<span class="dash">—</span>
					{/if}
				</dd>
			</div>
			<div class="wide">
				<dt>Received</dt>
				<dd>{formatWhen(row.created_at)}</dd>
			</div>
		</dl>

		<hr class="adm-divider" />

		<div class="drawer-actions">
			<h3 class="drawer-h">Actions</h3>
			<EnquiryActions {row} />
		</div>

		<p class="drawer-svc">
			<a href="/services/{row.service}">View service</a>
		</p>
	</div>
</div>

<style>
	/* The backdrop is a full-bleed close affordance, so the design system's
	   div resets do not apply — drop the UA button chrome here. */
	.adm-drawer-backdrop {
		padding: 0;
		border: 0;
		appearance: none;
		cursor: pointer;
	}

	.drawer-ident {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 10px;
		min-width: 0;
	}

	.drawer-title {
		margin: 0;
		font-family: var(--adm-quant);
		font-size: clamp(18px, 4vw, 22px);
		font-weight: 700;
		line-height: 1.15;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--adm-ink);
		overflow-wrap: anywhere;
	}

	.drawer-dl {
		display: grid;
		grid-template-columns: 1fr;
		gap: 10px;
		margin: 0;
	}

	.drawer-dl > div {
		display: grid;
		gap: 6px;
		margin: 0;
		padding: 12px 14px;
		border: 1px solid var(--adm-line);
		background: var(--adm-wash);
	}

	.drawer-dl > div > dt {
		font-family: var(--adm-quant);
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--adm-muted);
	}

	.drawer-dl > div > dd {
		margin: 0;
		font-size: 15px;
		line-height: 1.6;
		color: var(--adm-ink);
		overflow-wrap: anywhere;
		white-space: pre-wrap;
	}

	.answers {
		display: grid;
		gap: 6px;
		margin: 0;
	}

	.answers > div {
		display: grid;
		grid-template-columns: minmax(88px, auto) 1fr;
		gap: 8px;
		margin: 0;
		padding: 0;
		border: 0;
		background: none;
	}

	.answers > div > dt {
		font-family: var(--adm-quant);
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--adm-cyan-dark);
	}

	.answers > div > dd {
		margin: 0;
		font-size: 14px;
		color: var(--adm-ink);
		overflow-wrap: anywhere;
		white-space: pre-wrap;
	}

	.dash {
		color: var(--adm-muted);
	}

	.cust-id {
		font-family: var(--adm-quant);
		font-size: 13px;
		letter-spacing: 0.08em;
		word-break: break-all;
	}

	.drawer-h {
		margin: 0;
		font-family: var(--adm-quant);
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--adm-ink);
	}

	.drawer-actions {
		display: grid;
		gap: 10px;
	}

	.drawer-svc {
		margin: 18px 0 0;
		font-size: 14px;
	}

	.drawer-svc a {
		color: var(--adm-cyan-dark);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.drawer-svc a:hover {
		color: var(--adm-ink);
	}

	.drawer-svc a:focus-visible {
		outline: 2px solid var(--adm-cyan);
		outline-offset: 3px;
	}

	@media (min-width: 640px) {
		.drawer-dl {
			grid-template-columns: 1fr 1fr;
		}

		.drawer-dl > .wide {
			grid-column: 1 / -1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.adm-drawer-backdrop {
			transition: none;
		}
	}
</style>
