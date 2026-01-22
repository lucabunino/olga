<script>
    import Media from '$lib/components/media/Media.svelte';
    import Related from '$lib/components/Related.svelte';
    import PortableTextStyleProject from '$lib/components/portableTextStyles/portableTextStyleProject.svelte';
	import {PortableText} from '@portabletext/svelte'
    import HeadSingle from '$lib/components/HeadSingle.svelte';
	let { data } = $props()
	const project = data.project[0]
	$inspect(data)

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

	let seoSingle = $derived(project.seo)
</script>

{#if seoSingle}
	<HeadSingle seo={data.seo[0]} {seoSingle} hidden={project.hidden} />
{/if}

<main>
	<section id="opening">
		<Media media={project.opening} />
	</section>
	<section id="info">
		<div class="md-36 md-26-mb">
			<h1>{project.title}</h1>
			{#if project.subtitle}<h2>{project.subtitle}</h2>{/if}
		</div>
		<div class="md-24 md-16-mb">
			<p><label>Year</label><span>{new Date(project.date).getFullYear()}</span></p>
			{#if project.client}<p><label>Client</label><span>{project.client.title}</span></p>{/if}
			{#if project.categories}<p><label>Category</label><span>{project.categories[0].title}</span></p>{/if}
		</div>
	</section>
	<section id="media" class="md-24 md-16-mb">
		{#each project.media as block, i}
			{#if block._type == "mediaText"}
				<div class="mediaText portableText {block.marginTop ? 'mt-' + block.marginTop : 'mt-zero'} {block.alignment ? block.alignment : 'left'}">
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
				<div class="mediaGrid {block.marginTop ? 'mt-' + block.marginTop : 'mt-zero'} {block.gutter ? 'sp-' + block.gutter : 'sp-zero'} {block.items.length == 1 && block.alignment ? block.alignment : undefined}"
				style="--cols: {block.items.length};">
					{#each block.items as item, i}
						<Media media={item} />
					{/each}
				</div>
			{:else if block._type == "mediaCentered"}
				<div class="mediaCentered {block.marginTop ? 'mt-' + block.marginTop : 'mt-zero'} {block.gutter ? 'sp-' + block.gutter : 'sp-zero'}"
				style="--cols: {block.items.length};">
					{#each block.items as item, i}
						<Media media={item} customWidthActive={true}/>
					{/each}
				</div>
			{:else if block._type == "mediaFull"}
				<div class="mediaFull {block.marginTop ? 'mt-' + block.marginTop : 'mt-zero'} {block.gutter ? 'sp-' + block.gutter : 'sp-zero'}"
				style="--cols: {block.items.length};">
					{#each block.items as item, i}
						<Media media={item} />
					{/each}
				</div>
			{:else}
				<span style="grid-column: 1 / span 12">Missing block type</span>
			{/if}
		{/each}
	</section>
	{#if project.related}
		<Related related={project.related} title={"Progetti correlati"}/>
	{/if}
</main>

<style>
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

					label {
						grid-column: 1 / span 2;
					}
					span {
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

				@media screen and (max-width: 768px) {
					grid-template-columns: 1fr;
					row-gap: var(--sp-s);
				}

				&.sp-zero {
					column-gap: 0;
					@media screen and (max-width: 768px) {
						row-gap: var(--margin-mb);
					}
				}
				&.sp-xs {
					column-gap: var(--sp-xs);
					@media screen and (max-width: 768px) {
						row-gap: var(--margin-mb);
					}
				}
				&.sp-s { 
					column-gap: var(--gutter);
					@media screen and (max-width: 768px) {
						row-gap: var(--margin-mb);
					}
				}
				&.sp-m { 
					column-gap: var(--sp-s);
					@media screen and (max-width: 768px) {
						row-gap: var(--margin-mb);
					}
				}
				&.sp-l { 
					column-gap: var(--sp-m);
					@media screen and (max-width: 768px) {
						row-gap: var(--margin-mb);
					}
				}
				&.sp-xl { 
					column-gap: var(--sp-l);
					@media screen and (max-width: 768px) {
						row-gap: var(--margin-mb);
					}
				}
				&.sp-xxl { 
					column-gap: var(--sp-xl);
					@media screen and (max-width: 768px) {
						row-gap: var(--margin-mb);
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
				display: grid;
				grid-template-columns: repeat(var(--cols), 1fr);
				margin: 0 calc(var(--sp-m)*-1);
				@media screen and (max-width: 768px) {
					margin: unset;
				}
			}

			.mediaFull {
				grid-column: 1 / span 12;
				display: grid;
				grid-template-columns: repeat(var(--cols), 1fr);
				margin: 0 calc(var(--sp-m)*-1);
				@media screen and (max-width: 768px) {
					margin: unset;
				}
			}

			*.mt-zero {
				margin-top: 0;
				@media screen and (max-width: 768px) {
					margin-top: var(--margin-mb);
				}
			}
			*.mt-xs {
				margin-top: var(--sp-xs);
				@media screen and (max-width: 768px) {
					margin-top: var(--margin-mb);
				}
			}
			*.mt-s {
				margin-top: var(--sp-s);
				@media screen and (max-width: 768px) {
					margin-top: var(--margin-mb);
				}
			}
			*.mt-m {
				margin-top: var(--sp-m);
				@media screen and (max-width: 768px) {
					margin-top: var(--margin-mb);
				}
			}
			*.mt-l {
				margin-top: var(--sp-l);
				@media screen and (max-width: 768px) {
					margin-top: var(--margin-mb);
				}
			}
			*.mt-xl {
				margin-top: var(--sp-xl);
				@media screen and (max-width: 768px) {
					margin-top: var(--margin-mb);
				}
			}
			*.mt-xxl {
				margin-top: var(--sp-xxl);
				@media screen and (max-width: 768px) {
					margin-top: var(--margin-mb);
				}
			}

			@media screen and (max-width: 768px) {
				padding: 0 var(--margin-mb) var(--sp-m);
			}
		}
	}
</style>