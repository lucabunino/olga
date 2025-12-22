<script>
    import { urlFor } from '$lib/utils/image.js';
	import { Canvas } from '@threlte/core'
  	import Grid from '$lib/components/Grid.svelte'
    import { innerHeight, innerWidth } from 'svelte/reactivity/window';
	// import Marquee from 'svelte-fast-marquee';

	let { data } = $props()
	$inspect(data)

	let cursor =  $state()
</script>

<main>
	<!-- {#if data.homepage.marquee}
		<Marquee speed=100>
			<p id="marquee" class="md-12">
				{#if data.homepage.marqueeHref}
					<a href={data.homepage.marqueeHref} target={data.homepage.marqueeExternal ? '_blank' : undefined}>{data.homepage.marquee}</a>
				{:else}
					{data.homepage.marqueeHref}
				{/if}
			</p>
		</Marquee>
	{/if} -->
	<section id="images" style="--cursor: {cursor ? cursor : 'grab'}">
		<Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
			<Grid images={data.homepage.images} bind:cursor={cursor}/>
		</Canvas>
	</section>
</main>

<style>
#marquee {
	background-color: var(--yellow);
}
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