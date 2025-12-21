
<script>
    import { urlFor } from "$lib/utils/image";
    let { video, videoCover, title = undefined } = $props()
</script>

<figure>
	<video muted autoplay loop playsinline preload="metadata"
		poster={videoCover ? urlFor(videoCover).height(1920).url() : undefined}
		aria-label={title ? title : undefined}
	>
		<source
			src={video?.asset?.url}
			type="video/mp4"
		/>
		<p>
			Your browser does not support the video tag.
		</p>
	</video>
</figure>