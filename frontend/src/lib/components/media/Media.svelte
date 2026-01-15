<script>
    import Image from "./Image.svelte";
    import Gif from "./Gif.svelte";
    import Video from "./Video.svelte";

    let { media, customWidthActive = false, minHeight = undefined } = $props();
    let customWidth = media?.customWidth ?? 65;
</script>

<div class="media-container" style="{customWidthActive ? `width: ${customWidth}%` : undefined}">
    {#if media && media.type == 'image'}
        <Image 
            image={media.image} 
            imageMobile={media.imageMobile} 
            {minHeight}
        />
    {:else if media && media.type == 'video'}
        <div class="video-wrapper">
            <div class="desktop-only">
                <Video video={media.video} videoCover={media.videoCover} {minHeight}/>
            </div>
            {#if media.videoMobile}
                <div class="mobile-only">
                    <Video video={media.videoMobile} videoCover={media.videoCoverMobile || media.videoCover} {minHeight}/>
                </div>
            {/if}
        </div>
    {:else if media && media.type == 'gif'}
         <div class="gif-wrapper">
            <div class="desktop-only">
                <Gif frames={media.gifFrames} interval={media.gifInterval} {minHeight}/>
            </div>
            {#if media.gifFramesMobile?.length > 0}
                <div class="mobile-only">
                    <Gif frames={media.gifFramesMobile} interval={media.gifInterval} {minHeight}/>
                </div>
            {/if}
         </div>
    {:else}
        <div class="placeholder">Missing media content</div>
    {/if}
</div>

<style>
    .media-container {
        justify-self: center;
        align-content: center;
        text-align: center;
        width: 100%;
        height: 100%;
        position: relative;
    }

	.gif-wrapper,
	.video-wrapper {
		width: 100%;
		height: 100%;
		
		div {
			width: 100%;
			height: 100%;
		}
	}

    .mobile-only { display: none; }
    .desktop-only { display: block; }

	.placeholder {
		width: 100%;
		height: 100%;
		background-color: var(--gray-light);
		display: flex;
		align-items: center;
		justify-content: center;
	}

    @media (max-width: 768px) {
        /* Only switch if the mobile version actually exists */
        .media-container:has(.mobile-only) .desktop-only { display: none; }
        .media-container:has(.mobile-only) .mobile-only { display: block; }
    }
</style>