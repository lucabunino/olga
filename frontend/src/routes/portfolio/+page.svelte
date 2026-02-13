<script>
    import Media from '$lib/components/media/Media.svelte';
    import ProjectCover from '$lib/components/ProjectCover.svelte';
    import Views from '$lib/components/Views.svelte';
    import Filters from '$lib/components/Filters.svelte';
    import { fade, fly, slide } from 'svelte/transition';
	import { getPortfolio } from '$lib/stores/portfolio.svelte.js';
    import HeadSingle from '$lib/components/HeadSingle.svelte';
    import { typewriterKeep } from '$lib/utils/typewriter.js';

	const SPEED = 10
	const FLY_Y = 400

	let { data } = $props()
    let portfolio = getPortfolio();
    let activeProject = $state(0);
    let sortKey = $state('year');
    let sortDirection = $state('desc');
	let domLoaded = $state(false)
	let activeSorting = $state('year')
	let previousYear = 3000
	let sortedPortfolio = $derived.by(() => {
		const currentSortKey = sortKey;
		const currentDirection = sortDirection;
		const rawData = [...data.portfolio];

		return rawData.sort((a, b) => {
			let aVal = getSortValue(a, currentSortKey);
			let bVal = getSortValue(b, currentSortKey);

			if (aVal < bVal) return currentDirection === 'asc' ? -1 : 1;
			if (aVal > bVal) return currentDirection === 'asc' ? 1 : -1;
			return 0;
		});
	});

	$effect(() => {
		domLoaded = true
	})
	
	function getSortValue(project, key) {
		switch (key) {
			case 'year': return project.date ? new Date(project.date).getTime() : 0;
			case 'client': return project.client?.title?.toLowerCase() || '';
			case 'title': return project.title?.toLowerCase() || '';
			case 'category': return project.categories && project.categories.length > 0 
				? project.categories[0].title?.toLowerCase() 
				: '';
			default: return '';
		}
	}
    function sortby(key) {
		if (sortKey === key) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortKey = key;
			sortDirection = key === 'year' ? 'desc' : 'asc';
		}
		activeProject = 0;
	}
	function matchesSearch(project) {
		if (!portfolio.search || portfolio.search === 'search') return true;
		const s = portfolio.search.toLowerCase();
		const allSearchableTerms = [
			project.title,
			project.client?.title,
			project.date ? new Date(project.date).getFullYear().toString() : '',
			...(project.categories?.map(cat => cat.title) || [])
		];

		return allSearchableTerms.some(field => field?.toLowerCase().includes(s));
	}
	function getDisplayCategory(project) {
		const s = portfolio.search?.toLowerCase();
		if (!s || s === 'search') return project.categories[0]?.title || '';
		const matchingCategory = project.categories?.find(cat => 
			cat.title?.toLowerCase().includes(s)
		);
		return matchingCategory ? matchingCategory.title : (project.categories[0]?.title || '');
	}
</script>

<HeadSingle seo={data.seo[0]} seoSingle={{seoTitle: 'Portfolio'}}/>

<main>
	<section id="options" class="md-24 md-20-mb" aria-expanded={portfolio.filters}>
		<Filters categories={data.categories} />
		<Views />
	</section>
	<section id="portfolio" class={portfolio.view}>
		{#if domLoaded}
			{#each sortedPortfolio as project, i (project.slug.current)}
				{@const currentYear = project.date ? new Date(project.date).getFullYear() : null}
				{@const previous = i > 0 ? (sortedPortfolio[i - 1].date ? new Date(sortedPortfolio[i - 1].date).getFullYear() : null) : null}
				{@const isFirst = sortKey === 'year' ? (currentYear !== previous) : true}
				{#if portfolio.view == 'grid'}
					{#if portfolio.category == undefined || (
						project.categories?.some(cat => cat.slug.current === portfolio.category) && 
						(portfolio.subcategories.length === 0 || 
						project.subcategories?.some(sub => portfolio.subcategories.includes(sub.slug.current)))
					)}
						<div class="cover-wrapper">
							<div in:fly|global={{ duration: 500, y: FLY_Y, delay: i*75 }}>
								<ProjectCover {project}/>
							</div>
						</div>
					{/if}
				{:else if portfolio.view == 'list'}
					<a class="project md-16-mb {matchesSearch(project) ? undefined : 'hidden'}" href="/portfolio/{project.slug.current}" onmouseenter={() => activeProject = i}>
						{#if domLoaded &&project.date}
							<label for="year" class="md-12-mb" >year</label>
							<time id="year" class="year {!isFirst && (!portfolio.search || portfolio.search == 'search') ? 'hidden' : ''}" datetime={project.date} use:typewriterKeep={{ speed: 40, delay: i*50}}>{new Date(project.date).getFullYear()}</time>
						{/if}
						{#if domLoaded &&project.client}
							<label for="client" class="md-12-mb" use:typewriterKeep={{ speed: SPEED, delay: i*50}}>client</label>
							<span id="client" class="client" use:typewriterKeep={{ speed: SPEED, delay: i*50}}>{project.client.title}</span>
						{/if}
						{#if domLoaded &&project.title}
							<label for="title" class="md-12-mb" use:typewriterKeep={{ speed: SPEED, delay: i*50}}>title</label>
							<span id="title" class="title" use:typewriterKeep={{ speed: SPEED, delay: i*50}}>{project.title}</span>
						{/if}
						{#if domLoaded &&project.categories}
							<label for="category" class="md-12-mb" use:typewriterKeep={{ speed: SPEED, delay: i*50}}>category</label>
							<span id="category" class="category" use:typewriterKeep={{ speed: SPEED, delay: i*50}}>{getDisplayCategory(project)}</span>
						{/if}
					</a>
					{(() => {previousYear = new Date(project.date).getFullYear()})()}
				{/if}
			{/each}

			{#snippet arrow()}
				<svg class="arrow {sortDirection}" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M9.14645 0.146447C9.34171 -0.0488153 9.65821 -0.0488153 9.85348 0.146447C10.0487 0.341709 10.0487 0.658216 9.85348 0.853478L5.35348 5.35348C5.15822 5.54874 4.84171 5.54874 4.64645 5.35348L0.146447 0.853478C-0.0488155 0.658216 -0.0488155 0.341709 0.146447 0.146447C0.341709 -0.0488155 0.658216 -0.0488155 0.853478 0.146447L4.99996 4.29293L9.14645 0.146447Z" fill="#939393"/>
				</svg>
			{/snippet}
			{#if portfolio.view == 'list'}
				<section class="labels">
					<button class="label year" onclick={() => sortby('year')}>
						<span>year</span>{#if sortKey === 'year'}{@render arrow()}{/if}
					</button>
					<button class="label client" onclick={() => sortby('client')}>
						<span>client</span>{#if sortKey === 'client'}{@render arrow()}{/if}
					</button>
					<button class="label title" onclick={() => sortby('title')}>
						<span>project</span>{#if sortKey === 'title'}{@render arrow()}{/if}
					</button>
					<button class="label category" onclick={() => sortby('category')}>
						<span>category</span>{#if sortKey === 'category'}{@render arrow()}{/if}
					</button>
				</section>
				{#key activeProject}
					<div class="cover-wrapper">
						<div class="cover" in:fly|global={{ duration: 500, y: FLY_Y }} out:fly|global={{ duration: 500, y: -FLY_Y }}>
							<Media media={sortedPortfolio[activeProject].cover} size='m'/>
						</div>
					</div>
				{/key}
			{/if}
		{/if}
	</section>
</main>

<style>
	main {
		margin-top: var(--headerHeight);
		min-height: calc(100svh - var(--headerHeight));
		width: 100vw;
		position: relative;

		#options {
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			padding: var(--sp-s) var(--sp-m) 0;
			transition: var(--transition-s);

			@media screen and (max-width: 768px) {
				padding: var(--sp-s) var(--margin-mb) 0;
			}
		}
		#portfolio {
			display: grid;
			column-gap: var(--gutter);

			&.grid {
				margin: var(--sp-l) var(--sp-m);
				grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
				row-gap: var(--sp-s);

				@media screen and (max-width: 768px) {
					margin: var(--sp-l) var(--margin-mb);
					grid-template-columns: repeat(2, 1fr);
				}

				@media screen and (max-width: 320px) {
					grid-template-columns: 1fr;
				}
			}
			&.list {
				margin: var(--sp-l) var(--sp-m);
				grid-template-columns: repeat(1, 1fr);
				position: relative;

				@media screen and (max-width: 768px) {
					margin: var(--sp-l) var(--margin-mb) var(--sp-l);
				}
				
				.project {
					display: grid;
					grid-template-columns: repeat(12, 1fr);
					column-gap: var(--gutter);

					&.hidden {
						display: none;
					}

					label {
						display: none;

						@media screen and (max-width: 768px) {
							color: var(--gray-dark);
							grid-column: 1 / span 12;
							display: block;
							margin-top: var(--sp-s);
							margin-bottom: var(--sp-xs);
						}
					}

					.year {
						grid-column: 1 / span 1;
						
						&.hidden {
							@media screen and (min-width: 769px) {
								display: none;
							}
						}

						@media screen and (max-width: 768px) {
							grid-column: 1 / span 12;
						}

					}
					.client {
						grid-column: 5 / span 2;

						@media screen and (max-width: 768px) {
							grid-column: 1 / span 12;
						}
					}
					.title {
						grid-column: 7 / span 5;

						@media screen and (max-width: 1512px) {
							grid-column: 7 / span 4;
						}
						@media screen and (max-width: 768px) {
							grid-column: 1 / span 12;
						}
					}
					.category {
						grid-column: 12 / span 1;
						
						@media screen and (max-width: 1512px) {
							grid-column: 11 / span 2;
						}
						@media screen and (max-width: 768px) {
							grid-column: 1 / span 12;
						}
					}

					&:hover {
						color: var(--gray-dark);
					}

					@media screen and (max-width: 768px) {
						padding-bottom: var(--sp-s);

						& {
							border-top: solid 1px var(--black);
						}

						&.hidden + .project:not(.hidden),
						&:first-child:not(.hidden) {
							border-top: none;
						}
					}
				}
			}
			.labels {
				position: absolute;
				top: -1.3rem;
				width: 100%;
				left: 0;
				display: grid;
				grid-template-columns: repeat(12, 1fr);
				gap: var(--gutter);
				color: var(--gray-dark);

				.label {
					display: flex;
					align-items: center;
					column-gap: .4em;

					svg {
						height: .5em;
						width: auto;
						margin-top: .2em;

						&.desc {
							transform: rotate(180deg);
						}
					}
				}
				.year {
					grid-column: 1 / span 4;
				}
				.client {
					grid-column: 5 / span 2;
				}
				.title {
					grid-column: 7 / span 5;
					@media screen and (max-width: 1512px) {
						grid-column: 7 / span 4;
					}
				}
				.category {
					grid-column: 12 / span 1;
					@media screen and (max-width: 1512px) {
						grid-column: 11 / span 2;
					}
				}

				@media screen and (max-width: 768px) {
					display: none;
				}
			}

			&.list {
				.cover-wrapper {
					position: absolute;
					left: calc((100% - var(--gutter) * 11) / 12 * 1 + var(--gutter));
					width: calc((100% - var(--gutter) * 11) / 12 * 3 + var(--gutter) * 2);
					top: 0;
					aspect-ratio: 3/4;
					z-index: -1;
					
				}
			}
			.cover-wrapper {
				overflow: hidden;

				&.active {
					z-index: 2;
				}

				.cover {
					width: 100%;
					height: 100%;
				}

				@media screen and (max-width: 768px) {
					display: none;
				}
			}
		}
	}
</style>