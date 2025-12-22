
<script>
    import { browser } from "$app/environment";
    import { urlFor } from "$lib/utils/image";
    let { frames, interval = 500, minHeight = undefined } = $props()
	let activeFrame = $state(0)
	$effect(() => {
		if (browser) {
			setInterval(() => {
				if (activeFrame < frames?.length-1) {
					activeFrame++
				} else {
					activeFrame = 0
				}
			}, interval);
		}
	})
</script>

{#each frames as frame, i}
		<div class="wrapper" style="z-index: {i == activeFrame ? 2 : 0};">
			<figure>
				<img
					style="min-height: {minHeight}px"
					alt="To be done"
					loading="lazy"
					decoding="async"
					width={frame.asset.metadata.dimensions.width}
					height={frame.asset.metadata.dimensions.height}
					src={urlFor(frame).width(800)}
					srcset={`
						${urlFor(frame).width(320)} 320w,
						${urlFor(frame).width(480)} 480w,
						${urlFor(frame).width(768)} 768w,
						${urlFor(frame).width(1024)} 1024w,
						${urlFor(frame).width(1600)} 1600w
					`}
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
				/>
			</figure>
		</div>
{/each}

<style>
	.wrapper {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}
</style>