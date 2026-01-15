<script>
    import { browser } from "$app/environment";
    import { urlFor } from "$lib/utils/image";
    import { innerWidth } from "svelte/reactivity/window";

    let { frames, framesMobile = [], interval = 500 } = $props();
    let activeFrame = $state(0);
    let isLoaded = $state(false); 
    
    const currentFrames = $derived(innerWidth.current <= 768 && framesMobile?.length > 0 ? framesMobile : frames);
    const { width, height, lqip } = $derived(currentFrames[0]?.asset?.metadata || {});

    function reveal(node) {
        const imgs = node.querySelectorAll('img');
        if (imgs.length === 0) return;

        const observer = new IntersectionObserver(async ([entry]) => {
            if (entry.isIntersecting) {
                // Pre-decode only the first frame to bridge the gap from blur to image
                const firstImg = imgs[0];
                try {
                    if (firstImg.complete) {
                        await firstImg.decode();
                    } else {
                        await new Promise((r, reject) => {
                            firstImg.onload = r;
                            firstImg.onerror = reject;
                        });
                        await firstImg.decode();
                    }
                } catch (e) {
                    console.error("First frame failed to load", e);
                }

                isLoaded = true;
                observer.disconnect();
            }
        }, { threshold: 0.1 });

        observer.observe(node);
        return { destroy: () => observer.disconnect() };
    }

    $effect(() => {
        if (browser && currentFrames?.length > 1 && isLoaded) {
            const timer = setInterval(() => {
                activeFrame = (activeFrame + 1) % currentFrames.length;
            }, interval);
            return () => clearInterval(timer);
        }
    });
</script>

<div 
    use:reveal
    class="gif-container" 
    class:loaded={isLoaded}
    style:aspect-ratio={width ? width / height : 'auto'}
    style:background-image={lqip ? `url(${lqip})` : 'none'}
>
    {#each currentFrames as frame, i}
        <div 
            class="frame-wrapper" 
            class:active={i === activeFrame}
            style:z-index={i === activeFrame ? 3 : 2} 
        >
            <img
                alt="Frame {i}"
                loading="eager" 
                decoding="async"
                src={urlFor(frame).width(1200).url()}
            />
        </div>
    {/each}
</div>

<style>
    .gif-container {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background-size: cover;
        background-position: center;
    }

    /* Loading Blur Overlay */
    .gif-container::before {
        content: '';
        position: absolute;
        inset: 0;
        background: inherit;
        filter: blur(20px);
        transform: scale(1.1);
        z-index: 4;
        transition: opacity var(--transition-s);
        pointer-events: none;
    }

    .gif-container.loaded::before {
        opacity: 0;
    }

    .frame-wrapper {
        position: absolute;
        inset: 0;
        /* Transition removed to ensure instant frame swaps */
    }

    .frame-wrapper.active {
        opacity: 1;
    }

    .gif-container:not(.loaded) .frame-wrapper {
        display: none;
    }

    img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
        object-position: center;
        -webkit-transform: translateZ(0);
        backface-visibility: hidden;
    }
</style>