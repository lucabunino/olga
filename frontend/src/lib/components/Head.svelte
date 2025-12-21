<script>
	let { seo } = $props()
    import { browser } from "$app/environment";
    import { page } from "$app/state";
</script>

<svelte:head>
	{#if browser}
		<script defer src="https://cloud.umami.is/script.js" data-website-id="3e32a832-2bf2-438c-bbc1-f295f745e1d3"></script>
	{/if}

	<link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
	<link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
	<link rel="shortcut icon" href="/favicon/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
	{#if seo?.SEOTitle}<meta name="apple-mobile-web-app-title" content={seo.SEOTitle} />{/if}
	<link rel="manifest" href="/favicon/site.webmanifest" />

	<!-- Primary Meta Tags -->
	{#if seo?.SEOTitle}<title>{seo.SEOTitle}</title>{/if}
	{#if seo?.SEOTitle}<meta name="title" content={seo.SEOTitle} />{/if}
	{#if seo?.SEODescription}<meta name="description" content={seo.SEODescription} />{/if}

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={page.url} />
	{#if seo?.SEOTitle}<meta property="og:title" content={seo.SEOTitle} />{/if}
	{#if seo?.SEODescription}<meta property="og:description" content={seo.SEODescription} />{/if}
	{#if seo?.SEOImage}<meta property="og:image" content={seo.SEOImage} />{/if}
	{#if seo?.SEOTitle}<meta property="og:site_name" content={seo.SEOTitle} />{/if}

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={page.url} />
	{#if seo?.SEOTitle}<meta name="twitter:title" content={seo.SEOTitle} />{/if}
	{#if seo?.SEODescription}<meta name="twitter:description" content={seo.SEODescription} />{/if}
	{#if seo?.SEOImage}<meta name="twitter:image" content={seo.SEOImage} />{/if}

	<!-- Misc -->
	<link rel="canonical" href={page.url} />
	<meta name="robots" content="index,follow" />
	<meta name="googlebot" content="index,follow" />
</svelte:head>