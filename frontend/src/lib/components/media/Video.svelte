<script>
    import { urlFor } from "$lib/utils/image";

    let { video, videoCover, videoMobile, videoCoverMobile, minHeight } = $props();
    let isLoaded = $state(false);

    const { width, height, lqip } = $derived(videoCover.asset.metadata);

    function revealVideo(node) {
        const observer = new IntersectionObserver(async ([entry]) => {
            if (entry.isIntersecting) {
                const videos = node.querySelectorAll('video');
                
                const loadPromises = Array.from(videos).map(v => {
                    if (v.readyState >= 3) return Promise.resolve();
                    return new Promise(r => v.oncanplaythrough = r);
                });

                await Promise.all([
                    new Promise(r => setTimeout(r, 200)),
                    ...loadPromises
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
    use:revealVideo
    class="video-container"
    style:aspect-ratio={width / height}
    style:min-height={minHeight ? `${minHeight}px` : undefined}
    style:background-image={lqip ? `url(${lqip})` : 'none'}
>
    {#if videoMobile}
        <video 
            class="mobile-video" 
            class:loaded={isLoaded}
            muted autoplay loop playsinline preload="metadata"
            poster={urlFor(videoCoverMobile || videoCover).height(1280).url()}
        >
            <source src={videoMobile?.asset?.url} type="video/mp4" />
        </video>
    {/if}

    <video 
        class="desktop-video" 
        class:has-mobile={!!videoMobile} 
        class:loaded={isLoaded}
        muted autoplay loop playsinline preload="metadata"
        poster={videoCover ? urlFor(videoCover).height(1920).url() : undefined}
    >
        <source src={video?.asset?.url} type="video/mp4" />
    </video>
</figure>

<style lang="scss">
    .video-container { 
        position: relative;
        width: 100%; 
        overflow: hidden;
        background-size: cover;
        background-position: center;
    }

    .video-container::before {
        content: '';
        position: absolute;
        inset: 0;
        background: inherit;
        filter: blur(20px);
        transform: scale(1.1);
        z-index: 1;
        transition: opacity var(--transition-s);
    }

    .video-container:has(video.loaded)::before {
        opacity: 0;
    }

    video { 
        width: 100%; 
        height: 100%; 
        display: block;
        object-fit: cover;
        object-position: center;
        opacity: 0;
        transition: opacity var(--transition-s);
        z-index: 2;
        position: relative;
    }

    video.loaded {
        opacity: 1;
    }
    
    .mobile-video { display: none; }

    @media (max-width: 768px) {
        .mobile-video { display: block; }
        .desktop-video.has-mobile { display: none; }
    }
</style>