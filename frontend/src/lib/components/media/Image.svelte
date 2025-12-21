<script>
import { urlFor } from "$lib/utils/image";
let { image } = $props();
</script>

<figure>
	<img
		alt="To be done"
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
		sizes="
		(max-width: 768px) 100vw,
		(max-width: 1200px) 80vw,
		70vw
		"
	/>
</figure>