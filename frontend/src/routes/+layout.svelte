<script>
	import "../scss/reset.scss"
	import "../scss/typography.scss"
	import "../scss/main.scss"
    import Footer from '$lib/components/Footer.svelte';
    import Head from '$lib/components/Head.svelte';
    import Header from '$lib/components/Header.svelte';
	let { data, children } = $props();
</script>

<Head seo={data.seo[0]}/>
<Header/>
{@render children()}
<Footer info={data.info} policies={data.policies}/>