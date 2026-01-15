<script>
	import "../scss/reset.scss"
	import "../scss/typography.scss"
	import "../scss/main.scss"
    import Footer from '$lib/components/Footer.svelte';
    import Head from '$lib/components/Head.svelte';
    import Header from '$lib/components/Header.svelte';
    import { fade, fly, scale, slide } from "svelte/transition";
    import { page } from "$app/state";
    import { pageIn, pageOut } from "$lib/utils/transitions";
    import { innerHeight, innerWidth } from "svelte/reactivity/window";
	let { data, children } = $props();
	let scrollY = $state(0)
	let DURATION = 500
</script>

<svelte:window bind:scrollY></svelte:window>

<Head seo={data.seo[0]}/>
<Header/>
{#key page.url.pathname}
	<div class="page"
	in:pageIn={{ duration: DURATION, delay: 0, pageHeight: innerHeight.current, pageWidth: innerWidth.current}}
	out:pageOut={{ duration: DURATION, delay: 0, scrollY: scrollY, pageHeight: innerHeight.current, pageWidth: innerWidth.current}}
	>
	<!-- <div class="page"
	in:pageIn={{ duration: 500, pageHeight: innerHeight.current }}
	out:pageOut={{ duration: 500, scrollY: scrollY }}
	> -->
		{@render children()}
		{#if page.url.pathname !== '/'}
			<Footer info={data.info} policies={data.policies}/>
		{/if}
	</div>
{/key}

<style>
.page {
	background-color: var(--white);
}
</style>