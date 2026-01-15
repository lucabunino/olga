<script>
    let { seo } = $props()
    import { browser } from "$app/environment";
    import { page } from "$app/state";
</script>

<svelte:head>
    {#if browser}
    {/if}

    <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
    <link rel="shortcut icon" href="/favicon/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
    <link rel="manifest" href="/favicon/site.webmanifest" />

    {#if seo?.seoTitle}
        <title>{seo.seoTitle}</title>
        <meta name="title" content={seo.seoTitle} />
        <meta name="apple-mobile-web-app-title" content={seo.seoTitle} />
        <meta property="og:title" content={seo.seoTitle} />
        <meta property="og:site_name" content={seo.seoTitle} />
        <meta name="twitter:title" content={seo.seoTitle} />
    {/if}

    {#if seo?.seoDescription}
        <meta name="description" content={seo.seoDescription} />
        <meta property="og:description" content={seo.seoDescription} />
        <meta name="twitter:description" content={seo.seoDescription} />
    {/if}

    {#if seo?.seoImage}
        <meta property="og:image" content={seo.seoImage} />
        <meta name="twitter:image" content={seo.seoImage} />
    {/if}

    <meta property="og:type" content="website" />
    <meta property="og:url" content={page.url} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content={page.url} />

    <link rel="canonical" href={page.url} />
    <meta name="robots" content="index,follow" />
    <meta name="googlebot" content="index,follow" />
</svelte:head>