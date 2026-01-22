<script>
    let { 
        portableText,
        children 
    } = $props();

    // Access properties directly to maintain clean reactivity in Svelte 5
    const value = $derived(portableText.value);
    const style = $derived(value?.style);
    const listItem = $derived(value?.listItem);
</script>

{#if listItem === 'bullet'}
    <li>{@render children()}</li>
{:else if value._type === 'link'}
    <a href={value?.url} target={value?.blank ? '_blank' : undefined}>
        {@render children()}
    </a>
{:else if style === 'normal'}
    <p>{@render children()}</p>
{:else}
    {@render children()}
{/if}

<style>
    :global(.portableText p + p) {
        margin-top: 1.1em;
    }
	:global(.portableText ul) {
        margin: 1.1em 0 1.1em 2em;
		list-style: disc;
    }
</style>