<script>
    import { urlFor } from "$lib/utils/image";
    let { video, videoCover, videoMobile, videoCoverMobile, minHeight } = $props();
</script>

<figure class="video-container">
    {#if videoMobile}
        <video class="mobile-video" muted autoplay loop playsinline preload="metadata"
            poster={urlFor(videoCoverMobile || videoCover).height(1280).url()}
        >
            <source src={videoMobile?.asset?.url} type="video/mp4" />
        </video>
    {/if}

    <video class="desktop-video" class:has-mobile={!!videoMobile} muted autoplay loop playsinline preload="metadata"
        poster={videoCover ? urlFor(videoCover).height(1920).url() : undefined}
    >
        <source src={video?.asset?.url} type="video/mp4" />
    </video>
</figure>

<style>
    .video-container { 
        width: 100%; 
        height: 100%;
        overflow: hidden;
    }

    video { 
        width: 100%; 
        height: 100%; 
        display: block;
        object-fit: cover;
        object-position: center;
    }
    
    .mobile-video { display: none; }

    @media (max-width: 768px) {
        .mobile-video { display: block; }
        .desktop-video.has-mobile { display: none; }
    }
</style>