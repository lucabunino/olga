<script>
    import Media from '$lib/components/media/Media.svelte';
    import Related from '$lib/components/Related.svelte';
    import PortableTextStyleProject from '$lib/components/portableTextStyles/portableTextStyleProject.svelte';
    import ProjectCover from '$lib/components/ProjectCover.svelte';
    import { PortableText } from '@portabletext/svelte';
    import { innerWidth } from 'svelte/reactivity/window';
	import { typewriter } from '$lib/utils/typewriter.js';
    import HeadSingle from '$lib/components/HeadSingle.svelte';
	let { data } = $props()
	const studio = data.studio
	let isLoaded = $state(false)
	$effect(() => {
		isLoaded = true
	})
</script>

<HeadSingle seo={data.seo[0]} seoSingle={{seoTitle: 'Studio'}}/>

<main>
	{#if studio.poem}
		<section id="poem" class="md-36 md-26-mb">
			{#if isLoaded}
				<p class="poem">
					{#each studio.poem as line, i}
						<span class="line-keeper" aria-hidden="true">{line.children[0].text}</span>
						<span class="line" use:typewriter={{ text: line.children[0].text, speed: 20, delay: i*500 }}></span>
					{/each}
				</p>
			{/if}
		</section>
	{/if}
	{#if studio.location && studio.bio}
		<section id="bio">
			<p class="location md-36 md-26-mb">{studio.location}</p>
			<div class="bio portableText md-24 md-16-mb">
				<PortableText value={studio.bio}
				components={{
					block: {
						normal: PortableTextStyleProject,
					},
					listItem: PortableTextStyleProject,
					marks: {
						link: PortableTextStyleProject,
					},
				}}/>
			</div>
		</section>
	{/if}
	{#if studio.image}
		<section id="image">
			<Media media={studio.image} minHeight={300}/>
		</section>
	{/if}
	{#if studio.related}
		<Related related={studio.related} title={"Esplora il nostro mondo"}/>
	{/if}
</main>

<style>
	main {
		#poem {
			display: flex;
			justify-content: center;
			align-items: center;
			min-height: 100vh;
			padding: 0 var(--sp-m);

			.poem {
				.line-keeper {
					display: block;
					visibility: hidden;
					height: 0;
					pointer-events: none;
				}
				.line {
					display: block;
					min-height: 1.1em;
				}
			}

			@media screen and (max-width: 768px) {
				padding: 0 var(--margin-mb);
			}
		}

		#bio {
			display: grid;
			grid-template-columns: repeat(12, 1fr);
			column-gap: var(--gutter);
			padding: 0 var(--sp-m) var(--sp-m);

			.location {
				grid-column: 1 / span 6;
			}

			.bio {
				grid-column: 7 / span 6;
			}

			@media screen and (max-width: 768px) {
				padding: 0 var(--margin-mb) var(--sp-m);
				row-gap: var(--sp-m);

				.location {
					grid-column: 1 / span 12;
				}

				.bio {
					grid-column: 1 / span 12;
				}
			}
		}
	}
</style>