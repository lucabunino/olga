<script>
    import { urlFor } from '$lib/utils/image.js';
	import { Canvas } from '@threlte/core'
  	import Grid from '$lib/components/Grid.svelte'
    import { innerHeight, innerWidth } from 'svelte/reactivity/window';

	let { data } = $props()
	$inspect(data)

	let cursor =  $state()
</script>

<main>
	<section id="images" style="--cursor: {cursor ? cursor : 'grab'}">
		{#each data.homepage?.images as image, i}
			<!-- <a href="portfolio/{image.project.slug.current}">
				<figure>
					<img
						alt={image.project.title ?? ""}
						loading="lazy"
						decoding="async"
						width={image.cover.asset.metadata.dimensions.width}
						height={image.cover.asset.metadata.dimensions.height}
						src={urlFor(image.cover).width(800)}
						srcset={`
							${urlFor(image.cover).width(320)} 320w,
							${urlFor(image.cover).width(480)} 480w,
							${urlFor(image.cover).width(768)} 768w,
							${urlFor(image.cover).width(1024)} 1024w,
							${urlFor(image.cover).width(1600)} 1600w
						`}
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
				</figure>
			</a> -->
			<!-- {$inspect(urlFor(image.cover))} -->
		{/each}

		<Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
			<Grid images={data.homepage.images} bind:cursor={cursor}/>
		</Canvas>
	</section>
</main>

<style>
#images {
	width: 100vw;
	height: 100vh;
	position: fixed;
	left: 0;
	top: 0;
	background-color: var(--white);
	cursor: grab;
	cursor: var(--cursor);
	
	&:active {
		cursor: grabbing;
	}
}
</style>