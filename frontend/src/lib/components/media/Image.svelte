<script>
    import { urlFor } from "$lib/utils/image";

    let { image, imageMobile = undefined, minHeight = undefined, size = 'm' } = $props();
    let isLoaded = $state(false);

	// Image metadata
    const { width, height, lqip } = image.asset.metadata;

	// Image size management
	const widths = [768, 1080, 1920, 2560];
	const srcSet = widths
        .map(w => `${urlFor(image).width(w).auto('format').url()} ${w}w`)
        .join(', ');
	const sizesMap = {
        xl: '100vw',
        l: '75vw',
        m: '(max-width: 1024px) 100vw, 50vw', // 100vw on mobile, 50vw on desktop
        s: '(max-width: 768px) 50vw, 25vw'
    };

    function reveal(node) {
        const observer = new IntersectionObserver(async ([entry]) => {
            if (entry.isIntersecting) {
                const img = node.querySelector('img');
                
                await Promise.all([
                    new Promise(r => setTimeout(r, 200)),
                    img.complete ? img.decode() : new Promise(r => img.onload = () => img.decode().then(r))
                ]);
                
                isLoaded = true;
                observer.disconnect();
            }
        }, { threshold: 0.1 });

        observer.observe(node);
        return { destroy: () => observer.disconnect() };
    }
</script>

<figure 
    use:reveal
    class="image-container" 
    style:aspect-ratio={width / height}
    style:min-height={minHeight ? `${minHeight}px` : undefined}
    style:background-image={lqip ? `url(${lqip})` : 'none'}
>
    <picture>
        {#if imageMobile}
            <source media="(max-width: 768px)" srcset={urlFor(imageMobile).width(768).url()} />
        {/if}
        <img
            class:loaded={isLoaded}
            alt={image.asset?.altText || ""}
            loading="lazy"
            decoding="async"
            {width}
            {height}
            src={urlFor(image).width(1920).url()}
        />
    </picture>
</figure>

<style>
    .image-container {
        position: relative;
        overflow: hidden;
        background-size: cover;
        background-position: center;
    }

    .image-container::before {
        content: '';
        position: absolute;
        inset: 0;
        background: inherit;
        filter: blur(20px);
        transform: scale(1.1);
        z-index: 1;
        transition: opacity var(--transition-s);
    }

    .image-container:has(img.loaded)::before { opacity: 0; }

    img {
        display: block;
        opacity: 0;
        transition: opacity var(--transition-s);
        z-index: 2;
        position: relative;
    }

    img.loaded { opacity: 1; }
</style>