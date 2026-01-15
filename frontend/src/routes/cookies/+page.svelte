<script>
    import Policy from '$lib/components/Policy.svelte';

	let { data } = $props()
	let policy = $derived(data.policies?.find(p => p.slug?.current === 'cookies'));
</script>

{#if policy}
	<Policy {policy} />
{/if}