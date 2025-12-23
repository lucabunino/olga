<script>
    import { browser } from "$app/environment";
    import { urlFor } from "$lib/utils/image";
    import { innerWidth } from "svelte/reactivity/window";

    let { frames, framesMobile = [], interval = 500 } = $props();
    let activeFrame = $state(0);
    
    const currentFrames = $derived(innerWidth.current <= 768 && framesMobile?.length > 0 ? framesMobile : frames);

    $effect(() => {
        if (browser && currentFrames?.length > 0) {
            const timer = setInterval(() => {
                activeFrame = (activeFrame + 1) % currentFrames.length;
            }, interval);
            return () => clearInterval(timer);
        }
    });
</script>

<div class="gif-container">
    {#each currentFrames as frame, i}
        <div 
            class="frame-wrapper" 
            class:active={i === activeFrame}
        >
            <img
                alt="Frame {i}"
                loading="eager" 
                decoding="sync"
                src={urlFor(frame).width(1200).url()}
            />
        </div>
    {/each}
</div>

<style>
    .gif-container {
        position: relative;
        width: 100%;
        height: 100%; /* Important: parent must have a height */
        overflow: hidden;
        background: transparent;
    }

    .frame-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        visibility: hidden;
    }

    .frame-wrapper.active {
        opacity: 1;
        visibility: visible;
    }

    img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
        object-position: center;
        backface-visibility: hidden;
    }
</style>