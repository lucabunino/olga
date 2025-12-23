<script>
    import { urlFor } from "$lib/utils/image";
    let { image, imageMobile = undefined, minHeight = undefined } = $props();
</script>

<figure>
    <picture>
        {#if imageMobile}
            <source
                media="(max-width: 768px)"
                srcset={`
                    ${urlFor(imageMobile).width(480)} 480w,
                    ${urlFor(imageMobile).width(768)} 768w,
                    ${urlFor(imageMobile).width(1024)} 1024w
                `}
                sizes="100vw"
            />
        {/if}
        <img
            style:min-height={minHeight ? `${minHeight}px` : undefined}
            alt={image.asset?.altText || "Project image"}
            loading="lazy"
            decoding="async"
            width={image.asset.metadata.dimensions.width}
            height={image.asset.metadata.dimensions.height}
            src={urlFor(image).width(2560)}
            srcset={`
                ${urlFor(image).width(768)} 768w,
                ${urlFor(image).width(1280)} 1280w,
                ${urlFor(image).width(1920)} 1920w,
                ${urlFor(image).width(2560)} 2560w
            `}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
        />
    </picture>
</figure>