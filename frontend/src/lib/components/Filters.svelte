<script>
    import typewriter from "$lib/utils/typewriter";
    import { fade, slide } from "svelte/transition";
	import { getPortfolio } from '$lib/stores/portfolio.svelte.js';
    import { tick } from "svelte";
	let { categories } = $props()

	let portfolio = getPortfolio()
	let searchInput = $state(undefined)

	function openSearch() {
		searchInput.textContent = '';
	}

	function handleInput(e) {
		portfolio.setSearch(e.target.innerText.replace(/^\s+|\s+$/g, ''));
	}

	function handleKeydown(e) {
		if (e.key === 'Enter') {
			e.preventDefault();
		}
		if (e.key === 'Escape') {
			portfolio.setSearch('search');
			searchInput.textContent = 'search';
        	searchInput?.blur();
		}
	}
</script>

<div id="filters">
	{#if portfolio.view == "grid"}
		<button
			class="toggle"
			aria-label="Toggle filters"
			aria-expanded={portfolio.filters}
			aria-controls="filters-panel"
			onclick={() => {
				portfolio.setFilters(!portfolio.filters);
				portfolio.setCategory(undefined)
			}}
		>
			{#if portfolio.filters}
				<div class="cross" in:fade|global={{ duration: 1, axis: 'x', delay: 200 }} out:fade|global={{ duration: 1, axis: 'x' }}>
					<span class="line"></span>
					<span class="line"></span>
				</div>
			{:else}
				<span in:typewriter|global={{ speed: 20, delay: 200 }} out:typewriter|global={{ speed: 20 }}>filters</span>
			{/if}
		</button>
		<div id="filters-panel" class="categories">
			{#each categories as category, i}
				{#if portfolio.filters && portfolio.view == 'grid' && portfolio.category == undefined || portfolio.category == category.slug.current}
					<button class="category" in:typewriter|global={{ speed: 20, delay: 0 }} out:typewriter|global={{ speed: 20 }}
					aria-pressed={portfolio.category === category.slug.current}
					onclick={() =>
								portfolio.category === category.slug.current
								? (portfolio.setCategory(undefined))
								: (portfolio.setCategory(category.slug.current))
							}
						>
						{category.title}
					</button>
				{/if}
			{/each}
		</div>
	{:else if portfolio.view == "list"}
		<div id="search">
				<span
				class="search" in:typewriter|global={{ speed: 20, delay: 300 }} out:typewriter|global={{ speed: 20 }}
				contenteditable="true"
				role="textbox"
				aria-label="Search"
				aria-multiline="false"
				tabindex="0"
				bind:this={searchInput}
				onkeydown={handleKeydown}
				oninput={handleInput}
				onclick={() => {openSearch()}}
				>{@html portfolio.search || '&ZeroWidthSpace;'}</span>
			<span in:slide|global={{ duration: 200, delay: 300, axis: 'x' }} out:slide|global={{ duration: 200, axis: 'x' }} class="underline"></span>
		</div>
	{/if}
</div>

<style>
	@keyframes appear {
		from {
			max-width: 0;
		}
		to {
			max-width: 300px;
		}
	}

	#filters {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 1.1em;

		.toggle {
			position: relative;
			border: none;
			background: none;
			padding: 0;
			cursor: pointer;
			width: 8rem;
			display: flex;
			justify-content: space-between;
			align-items: center;

			&:hover {
				color: var(--gray-dark);
			}

			&:focus-visible {
				outline: 2px solid var(--accent);
				outline-offset: 3px;
			}

			.cross {
				width: 1.1em;
				height: 1.1em;
				position: relative;
				left: 0;
				top: 0;

				.line {
					position: absolute;
					top: 50%;
					left: 0;
					width: 100%;
					height: 2px;
					border-radius: 1px;
					background: currentColor;
					transform-origin: center;

					&:nth-child(1) {
						transform: translateY(-50%) rotate(45deg);
					}
					&:nth-child(2) {
						transform: translateY(-50%) rotate(-45deg);
					}
				}
			}
		}

		.categories {
			display: flex;
			column-gap: var(--gutter);

			.category {
				&:hover,
				&[aria-pressed="true"] {
					color: var(--gray-dark);
				}
			}
		}
	}

	#search {
		color: var(--gray-dark);
		position: relative;
		height: 1.1em;
		
		.search {
			width: 300px;
			display: block;
			overflow: hidden;
			white-space: nowrap;

			@media screen and (max-width: 768px) {
				width: unset;
			}

			&:focus {
				color: var(--black);
				outline: none;
			}
		}

		input {
			position: absolute;
			left: 0;
			border-bottom: solid 1px var(--black);
			border: none;
			padding: 0;
			width: 300px;

			@media screen and (max-width: 768px) {
				width: unset;
			}
		}

		.underline {
			position: absolute;
			left: 0;
			bottom: 0;
			width: 300px;
			height: 1px;
			background: var(--black);

			@media screen and (max-width: 768px) {
				width: calc(100vw - var(--margin-mb)*2);
			}
		}
	}
</style>