<script>
    import Media from '$lib/components/media/Media.svelte';
    import Related from '$lib/components/Related.svelte';
    import PortableTextStyleProject from '$lib/components/portableTextStyles/portableTextStyleProject.svelte';
	import {PortableText} from '@portabletext/svelte'
    import HeadSingle from '$lib/components/HeadSingle.svelte';
	let { data } = $props()
	
	function getGutter(size) {
		if (size == 'xs') {
			return '.416rem'
		}
		if (size == 's') {
			return '.833rem'
		}
		if (size == 'm') {
			return '1.25rem'
		}
		if (size == 'l') {
			return '2.5rem'
		}
		if (size == 'xl') {
			return '5rem'
		}
	}

	let seoSingle = $derived(data.project[0].seo)
</script>

{#if seoSingle}
	<HeadSingle seo={data.seo[0]} {seoSingle} hidden={data.project[0].hidden} />
{/if}

<main>
	<section id="opening">
		<Media media={data.project[0].opening} size='xl'/>
	</section>
	<section id="info">
		<div class="md-36 md-26-mb">
			<h1>{data.project[0].title}</h1>
			{#if data.project[0].subtitle}<h2>{data.project[0].subtitle}</h2>{/if}
		</div>
		<div class="md-24 md-16-mb">
			<p><span class="key">Year</span><span>{new Date(data.project[0].date).getFullYear()}</span></p>
			{#if data.project[0].client}<p><span class="key">Client</span><span>{data.project[0].client.title}</span></p>{/if}
			{#if data.project[0].categories}<p><span class="key">Category</span><span>{data.project[0].categories[0].title}</span></p>{/if}
		</div>
	</section>
	<section id="media" class="md-24 md-16-mb">
		{#each data.project[0].media as block, i}
			{#if block._type == "mediaText"}
				<div class="mediaText portableText {block.marginTop ? 'mt-' + block.marginTop : 'mt-zero'} {block.alignment ? block.alignment : 'left'}"
				style="--row: {i + 1};">
					<PortableText value={block.text}
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
			{:else if block._type == "mediaGrid"}
				<div class="mediaGrid x{block.items.length} {block.marginTop ? 'mt-' + block.marginTop : 'mt-zero'} {block.gutter ? 'sp-' + block.gutter : 'sp-zero'} {block.items.length == 1 && block.alignment ? block.alignment : undefined}"
				style="--cols: {block.items.length}; --row: {i + 1};">
					{#each block.items as item, i}
						<Media media={item} size='l'/>
					{/each}
				</div>
			{:else if block._type == "mediaCentered"}
				<div class="mediaCentered {block.marginTop ? 'mt-' + block.marginTop : 'mt-zero'} {block.gutter ? 'sp-' + block.gutter : 'sp-zero'}"
				style="--cols: {block.items.length}; --row: {i + 1};">
					{#each block.items as item, i}
						<Media media={item} customWidthActive={true} size='l'/>
					{/each}
				</div>
			{:else if block._type == "mediaFull"}
				<div class="mediaFull {block.marginTop ? 'mt-' + block.marginTop : 'mt-zero'} {block.gutter ? 'sp-' + block.gutter : 'sp-zero'}"
				style="--cols: {block.items.length}; --row: {i + 1};">
					{#each block.items as item, i}
						<Media media={item} size='xl'/>
					{/each}
				</div>
			{:else}
				<span style="grid-column: 1 / span 12">Missing block type</span>
			{/if}
		{/each}
	</section>
	{#if data.project[0].related}
		<Related related={data.project[0].related} title={"Related projects"}/>
	{/if}
</main>

<style lang="scss">
	main {		
		#opening {
			width: 100%;
			height: 100vh;

			@media screen and (max-width: 768px) {
				height: 80vh;
			}
		}
		#info {
			display: grid;
			grid-template-columns: repeat(12, 1fr);
			column-gap: var(--gutter);
			row-gap: var(--sp-m);
			padding: var(--sp-m) var(--sp-m) 0;

			div:nth-child(1) {
				grid-column: 1 / span 6;

				@media screen and (max-width: 768px) {
					grid-column: 1 / span 12;
				}
			}
			div:nth-child(2) {
				grid-column: 7 / span 6;

				p {
					display: grid;
					grid-template-columns: repeat(6, 1fr);
					column-gap: var(--gutter);

					.key {
						grid-column: 1 / span 2;
					}
					span:not(.key) {
						grid-column: 3 / span 4;
					}
				}

				@media screen and (max-width: 768px) {
					grid-column: 1 / span 12;
				}
			}

			@media screen and (max-width: 768px) {
				padding: var(--sp-m) var(--margin-mb) 0;
			}
		}
		#media {
			display: grid;
			grid-template-columns: repeat(12, 1fr);
			column-gap: var(--gutter);
			padding: 0 var(--sp-m) var(--sp-m);
			
			.mediaText {
				grid-row: var(--row);
				&.left {
					grid-column: 1 / span 6;

					@media screen and (max-width: 768px) {
						grid-column: 1 / span 12;
					}
				}
				&.right {
					grid-column: 7 / span 6;

					@media screen and (max-width: 768px) {
						grid-column: 1 / span 12;
					}
				}
			}

			.mediaGrid {
				grid-column: 1 / span 12;
				display: grid;
				grid-template-columns: repeat(var(--cols), 1fr);
				grid-row: var(--row);

				@media screen and (max-width: 768px) {
					grid-template-columns: 1fr;
					row-gap: var(--sp-s);
				}

				&.sp-zero {
					column-gap: 0;
					@media screen and (max-width: 768px) {
						row-gap: var(--sp-s);
					}
				}
				&.sp-xs {
					column-gap: var(--sp-xs);
					@media screen and (max-width: 768px) {
						row-gap: var(--sp-s);
					}
				}
				&.sp-s { 
					column-gap: var(--gutter);
					@media screen and (max-width: 768px) {
						row-gap: var(--sp-s);
					}
				}
				&.sp-m { 
					column-gap: var(--sp-s);
					@media screen and (max-width: 768px) {
						row-gap: var(--sp-s);
					}
				}
				&.sp-l { 
					column-gap: var(--sp-m);
					@media screen and (max-width: 768px) {
						row-gap: var(--sp-s);
					}
				}
				&.sp-xl { 
					column-gap: var(--sp-l);
					@media screen and (max-width: 768px) {
						row-gap: var(--sp-s);
					}
				}
				&.sp-xxl { 
					column-gap: var(--sp-xl);
					@media screen and (max-width: 768px) {
						row-gap: var(--sp-s);
					}
				}

				&.left {
					grid-column: 1 / span 6;
					@media screen and (max-width: 768px) {
						grid-column: 1 / span 12;
					}
				}
				&.right {
					grid-column: 7 / span 6;
					@media screen and (max-width: 768px) {
						grid-column: 1 / span 12;
					}
				}
				&.center {
					grid-column: 4 / span 6;
					@media screen and (max-width: 768px) {
						grid-column: 1 / span 12;
					}
					
				}
			}

			.mediaCentered {
				grid-column: 1 / span 12;
				grid-row: var(--row);
				display: grid;
				grid-template-columns: repeat(var(--cols), 1fr);
				margin: 0 calc(var(--sp-m)*-1);

				@media screen and (max-width: 768px) {
					margin: unset;
					grid-template-columns: repeat(1, 1fr);
					padding: calc(var(--margin-mb)*2);
					row-gap: var(--sp-s);
				}
			}

			.mediaFull {
				grid-column: 1 / span 12;
				grid-row: var(--row);
				display: grid;
				grid-template-columns: repeat(var(--cols), 1fr);
				margin: 0 calc(var(--sp-m)*-1);
				
				@media screen and (max-width: 768px) {
					margin: 0 calc(var(--margin-mb)*-1);
				}
			}

			*.mt-zero {
				margin-top: 0;
				@media screen and (max-width: 768px) {
					margin-top: var(--sp-l);
				}
			}
			*.mt-xs {
				margin-top: var(--sp-xs);
				@media screen and (max-width: 768px) {
					margin-top: var(--sp-l);
				}
			}
			*.mt-s {
				margin-top: var(--sp-s);
				margin-top: var(--gutter);
				@media screen and (max-width: 768px) {
					margin-top: var(--sp-l);
				}
			}
			*.mt-m {
				margin-top: var(--sp-m);
				@media screen and (max-width: 768px) {
					margin-top: var(--sp-l);
				}
			}
			*.mt-l {
				margin-top: var(--sp-l);
				@media screen and (max-width: 768px) {
					margin-top: var(--sp-l);
				}
			}
			*.mt-xl {
				margin-top: var(--sp-xl);
				@media screen and (max-width: 768px) {
					margin-top: var(--sp-l);
				}
			}
			*.mt-xxl {
				margin-top: var(--sp-xxl);
				@media screen and (max-width: 768px) {
					margin-top: var(--sp-l);
				}
			}

			@media screen and (max-width: 768px) {
				padding: 0 var(--margin-mb) var(--sp-m);
			}
		}
	}
</style>