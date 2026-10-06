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

	let rows = $state<Enquiry[]>([]);
	let open = $state<string | null>(null);
	let error = $state('');

	async function load() {
		error = '';
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

	onMount(load);
</script>

<div class="targo-band-white" data-testid="admin-inbox">
	<div>
		<h2 class="targo-quant">Enquiries inbox</h2>
		<button class="targo-btn" data-testid="admin-signout" onclick={signOut}>Sign out</button>
	</div>
	{#if error}
		<p role="alert">{error}</p>
	{/if}
	{#if rows.length === 0 && !error}
		<p>No enquiries yet.</p>
	{/if}
	{#each rows as row (row.id)}
		<article class="targo-card" data-testid="admin-row">
			<button onclick={() => (open = open === row.id ? null : row.id)}>
				{row.name} — {row.service}
			</button>
			<span>{row.status}</span>
			{#if open === row.id}
				<dl>
					<div><dt>Phone</dt><dd>{row.phone}</dd></div>
					<div><dt>Budget</dt><dd>{row.budget}</dd></div>
					<div><dt>Timeline</dt><dd>{row.timeline}</dd></div>
					<div><dt>Subject</dt><dd>{row.subject}</dd></div>
					<div><dt>Message</dt><dd>{row.message}</dd></div>
					<div><dt>Answers</dt><dd><pre>{JSON.stringify(row.answers, null, 2)}</pre></dd></div>
					<div><dt>Received</dt><dd>{row.created_at}</dd></div>
				</dl>
				<button data-testid="admin-mark-read" onclick={() => setStatus(row.id, 'read')}>
					Mark read
				</button>
				<button data-testid="admin-mark-replied" onclick={() => setStatus(row.id, 'replied')}>
					Mark replied
				</button>
			{/if}
		</article>
	{/each}
</div>
