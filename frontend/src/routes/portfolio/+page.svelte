<script>
    import Media from '$lib/components/media/Media.svelte';
    import ProjectCover from '$lib/components/ProjectCover.svelte';
    import Views from '$lib/components/Views.svelte';
    import Filters from '$lib/components/Filters.svelte';
    import typewriter from '$lib/utils/typewriter.js';
    import { fade, slide } from 'svelte/transition';
	let { data } = $props()
	import { getPortfolio } from '$lib/stores/portfolio.svelte.js';
    let portfolio = getPortfolio();

	 // Keep your other logic...
    let activeProject = $state(0);
    
    // 1. Track sorting state
    let sortKey = $state('year');
    let sortDirection = $state('desc'); // 'asc' or 'desc'

	let sortedPortfolio = $derived.by(() => {
        // Create a copy to avoid mutating the original prop
        return [...data.portfolio].sort((a, b) => {
            let aVal = getSortValue(a, sortKey);
            let bVal = getSortValue(b, sortKey);

            if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    });

	function getSortValue(project, key) {
        switch (key) {
            case 'year': return project.date ? new Date(project.date).getTime() : 0;
            case 'client': return project.client?.title?.toLowerCase() || '';
            case 'project': return project.title?.toLowerCase() || '';
            case 'category': return project.category?.title?.toLowerCase() || '';
            default: return '';
        }
    }

    function sortby(key) {
        if (sortKey === key) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortKey = key;
            sortDirection = 'asc';
        }
    }

	
	let activeSorting = $state('year')
	let previousYear = 3000

	function matchesSearch(project) {
		if (!portfolio.search || portfolio.search == 'search') return true;
		const s = portfolio.search.toLowerCase();
		return [
			project.title,
			project.client?.title,
			project.category?.title,
			project.date ? new Date(project.date).getFullYear().toString() : ''
		].some(field => field?.toLowerCase().includes(s));
	}
</script>
<main>
	<section id="options" class="md-24">
		<div>
			<Filters categories={data.categories} />
		</div>
		<Views />
	</section>
	{#if portfolio.view == 'list'}
		<section class="labels">
			<button class="year" onclick={() => sortby('year')}>
				year {sortKey === 'year' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
			</button>
			<button class="client" onclick={() => sortby('client')}>
				client {sortKey === 'client' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
			</button>
			<button class="project" onclick={() => sortby('project')}>
				project {sortKey === 'project' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
			</button>
			<button class="category" onclick={() => sortby('category')}>
				category {sortKey === 'category' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
			</button>
		</section>
	{/if}
	<section id="portfolio" class={portfolio.view}>
		{#each sortedPortfolio as project, i}
			{@const currentYear = project.date ? new Date(project.date).getFullYear() : null}
			{@const previous = i > 0 ? (sortedPortfolio[i - 1].date ? new Date(sortedPortfolio[i - 1].date).getFullYear() : null) : null}
			{@const isFirst = sortKey === 'year' ? (currentYear !== previous) : true}
			{#if portfolio.view == 'grid'}
				{#if portfolio.category == undefined || portfolio.category == project.category?.slug.current}
					<ProjectCover {project}/>
				{/if}
			{:else if portfolio.view == 'list'}
				<a class="project {matchesSearch(project) ? undefined : 'hidden'}" href={project.slug.current} onmouseenter={() => activeProject = i}>
					{#if project.date}<time class="year {!isFirst && (!portfolio.search || portfolio.search == 'search') ? 'hidden' : ''}" datetime={project.date}>{new Date(project.date).getFullYear()}</time>{/if}
					{#if project.client}<span class="client">{project.client.title}</span>{/if}
					<span class="title">{project.title}</span>
					<span class="category">{project.category.title}</span>
				</a>
				{(() => {previousYear = new Date(project.date).getFullYear()})()}
			{/if}
		{/each}
		{#if portfolio.view == 'list'}
			{#key activeProject}
				<div class="cover" in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
					<Media media={sortedPortfolio[activeProject].cover}/>
				</div>
			{/key}
		{/if}
	</section>
</main>

<style>
	main {
		margin-top: 7rem;
		min-height: calc(100vh - 7rem);

		#options {
			display: flex;
			justify-content: space-between;
			padding: var(--sp-s) var(--sp-m) 0;

			div:nth-child(1) {
				display: flex;
			}
		}
		.labels {
			display: grid;
			grid-template-columns: repeat(12, 1fr);
			margin: var(--sp-l) var(--sp-m) 0;
			gap: var(--gutter);
			color: var(--gray-dark);

			.year {
				grid-column: 1 / span 4;
			}
			.client {
				grid-column: 5 / span 2;
			}
			.project {
				grid-column: 7 / span 5;
			}
			.category {
				grid-column: 12 / span 1;
			}
		}
		#portfolio {
			display: grid;
			column-gap: var(--gutter);
			&.grid {
				margin: var(--sp-l) var(--sp-m);
				grid-template-columns: repeat(4, 1fr);
			}
			&.list {
				margin: 0 var(--sp-m) var(--sp-l);
				grid-template-columns: repeat(1, 1fr);
				position: relative;
				
				.project {
					display: grid;
					grid-template-columns: repeat(12, 1fr);
					column-gap: var(--gutter);

					&.hidden {
						display: none;
					}

					.year {
						grid-column: 1 / span 1;

						&.hidden {
							display: none;
						}
					}
					.client {
						grid-column: 5 / span 2;
					}
					.title {
						grid-column: 7 / span 5;
					}
					.category {
						grid-column: 12 / span 1;
					}

					&:hover {
						color: var(--gray-dark);
					}
				}
			}
			.cover {
				position: absolute;
				left: calc((100% - var(--gutter) * 11) / 12 * 1 + var(--gutter));
				width: calc((100% - var(--gutter) * 11) / 12 * 3 + var(--gutter) * 2);
				top: 0;
				aspect-ratio: 3/4;
				z-index: -1;

				&.active {
					z-index: 2;
				}
			}
		}
	}
</style>