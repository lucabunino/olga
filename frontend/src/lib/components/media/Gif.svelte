<script>
    import { browser } from "$app/environment";
    import { urlFor } from "$lib/utils/image";
    import { innerWidth } from "svelte/reactivity/window";

    let { frames, framesMobile = [], interval = 500, size = 'm' } = $props();
    let activeFrame = $state(0);
    let isLoaded = $state(false); 
    
    // Resolution Tier Management
    const widths = [768, 1080, 1920, 2560];
    const sizesMap = {
        xl: '100vw',
        l: '75vw',
        m: '(max-width: 1024px) 100vw, 50vw', 
        s: '(max-width: 768px) 50vw, 25vw',
        xsmall: '768px'
    };

    const currentFrames = $derived(innerWidth.current <= 768 && framesMobile?.length > 0 ? framesMobile : frames);
    const { width, height, lqip } = $derived(currentFrames[0]?.asset?.metadata || {});

    // Per-frame srcset generation
    const getSrcSet = (frame) => widths
        .map(w => `${urlFor(frame).width(w).auto('format').url()} ${w}w`)
        .join(', ');

    function reveal(node) {
        const imgs = node.querySelectorAll('img');
        if (imgs.length === 0) return;

        const observer = new IntersectionObserver(async ([entry]) => {
            if (entry.isIntersecting) {
                const firstImg = imgs[0];
                
                await Promise.all([
                    new Promise(r => setTimeout(r, 200)),
                    firstImg.complete ? firstImg.decode() : new Promise(r => firstImg.onload = () => firstImg.decode().then(r))
                ]);

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
                loading={i === 0 ? "eager" : "lazy"} 
                decoding="async"
                srcset={getSrcSet(frame)}
                sizes={sizesMap[size]}
                src={urlFor(frame).width(1080).url()}
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

		&::before {
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

		&.loaded {
			&::before {
				opacity: 0;
			}
		}

		.frame-wrapper {
			position: absolute;
			inset: 0;
		}
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