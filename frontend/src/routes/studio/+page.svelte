<script>
    import Media from '$lib/components/media/Media.svelte';
    import Related from '$lib/components/Related.svelte';
    import PortableTextStyleProject from '$lib/components/portableTextStyles/portableTextStyleProject.svelte';
    import ProjectCover from '$lib/components/ProjectCover.svelte';
    import { PortableText } from '@portabletext/svelte';
    import { innerWidth } from 'svelte/reactivity/window';
	import { typewriterKeep } from '$lib/utils/typewriter.js';
    import HeadSingle from '$lib/components/HeadSingle.svelte';
    import { fade } from 'svelte/transition';
	let { data } = $props()
	let studio = data.studio
	let isLoaded = $state(false)
	let isPast = $state(false)
	let D = 250
	let lineOffset =$state(4)
	$effect(() => {
		isLoaded = true
		setTimeout(() => {
			isPast = true
		}, D);
	})

	const getBlankOffset = (index) => {
        return studio.poem.slice(0, index).filter(line => line.isBlank).length;
    };
</script>

<HeadSingle seo={data.seo[0]} seoSingle={{seoTitle: 'Studio'}}/>

<main>
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

	{#if studio.poem}
		<section id="poem" class="md-36 md-26-mb">
			{#if isLoaded}
				{#each studio.poem as line, i}
					{@const activeIndex = i - getBlankOffset(i)}
					<p class="line">
						{#each line.units as span, j}
							{#if span._type === 'o'}
								{#if !isPast}
									<svg class="dot" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60.004 52.003"
									in:fade|global={{ duration: 1, delay: activeIndex*D*2.5}}
									out:fade|global={{ duration: 1, delay: activeIndex*D*2.5}}
									>
										<path d="M0 26.002C0 11.102 12.8 0 30.002 0c17.101 0 30.002 11.101 30.002 26.002 0 14.8-12.901 26.001-30.002 26.001C12.8 52.003 0 40.803 0 26.002Z"/>
									</svg>
								{/if}
							{/if}
							<span class="animated {span._type}" use:typewriterKeep={{ speed: 40, delay: 
								span._type === 'o' ? activeIndex*D*2.5 + D :
								span._type === 'l' ? activeIndex*D*2.5 + D*1.5 :
								span._type === 'g' ? activeIndex*D*2.5 + D*2 :
								span._type === 'a' ? activeIndex*D*2.5 + D*2.5 :
								span._type === 'custom' ? (activeIndex+lineOffset)*D*2.5 + j*D/2 : '0'
							}}>{@html span.text}</span>
						{/each}
						<br>
					</p>
				{/each}
				{#if studio.poemAuthor}
					{@const totalActiveLines = studio.poem.length - getBlankOffset(studio.poem.length)}
					<p use:typewriterKeep={{ speed: 40, delay: totalActiveLines*D*2.5 }} class="author md-24 md-16-mb">{@html studio.poemAuthor}</p>
				{/if}
			{/if}
		</section>
	{/if}

	{#if studio.image}
		<section id="image">
			<Media media={studio.image} minHeight={300} size='xl'/>
		</section>
	{/if}
	{#if studio.related}
		<Related related={studio.related} title={"Explore our world"}/>
	{/if}
</main>

<style lang="scss">
	main {
		margin-top: var(--headerHeight);

		#bio {
			display: grid;
			grid-template-columns: repeat(12, 1fr);
			column-gap: var(--gutter);
			padding: var(--sp-s) var(--sp-m);

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
		
		#poem {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: flex-start;
			justify-self: center;
			width: max-content;
			padding: var(--sp-xxxl) var(--sp-m);

			.line {
				flex-basis: 100%;
				display: inline-table;
				position: relative;
				white-space-collapse: break-spaces;

				.dot {
					position: absolute;
					top: .38em;
					left: .03em;
					height: .54em;
					fill: var(--yellow);
					margin: 0;
					padding: 0;
				}

				.animated {
					visibility: hidden;
				}
			}

			.author {
				margin-top: var(--sp-l);
			}

			@media screen and (max-width: 768px) {
				padding: var(--sp-xxl) var(--margin-mb);
				width: auto;
			}
		}
	}
</style>