<script>
let { 
	portableText,
	children 
} = $props();
let { global, value } = $derived(portableText);
let { style, listItem, markDefs } = $derived(value);
</script>

{#if listItem == 'bullet'}
	<li>
		{@render children()}
	</li>
{:else if value._type === 'link'}
	<a href={value?.url} target={value?.blank ? '_blank' : undefined}>
		{@render children()}
	</a>
{:else if style === 'normal' && !listItem}
	<p>{@render children()}</p>
{:else if style === 'h1'}
	<h1>{@render children()}</h1>
{:else if style === 'h2'}
	<h2>{@render children()}</h2>
{:else if style === 'h3'}
	<h3>{@render children()}</h3>
{:else if style === 'h4'}
	<h4>{@render children()}</h4>
{:else if style === 'h5'}
	<h5>{@render children()}</h5>
{:else if style === 'h6'}
	<h6>{@render children()}</h6>
{/if}

<style>
:global(.portableText p + p) {
	margin-top: 1.1em;
}
</style>