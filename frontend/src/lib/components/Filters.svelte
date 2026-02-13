<script>
    import { typewriterKeep, typewriterTransition } from "$lib/utils/typewriter";
    import { fade, slide } from "svelte/transition";
	import { getPortfolio } from '$lib/stores/portfolio.svelte.js';
    import { tick } from "svelte";
	let { categories } = $props()
	
	const SPEED = 5
	let portfolio = getPortfolio()
	let searchInput = $state(undefined)
	let filtersHeight = $state(0)

	function openSearch() {
        if (portfolio.search === 'search') {
            portfolio.setSearch('');
            searchInput.textContent = '';
        }
    }

	function handleBlur() {
        if (portfolio.search.trim() === '') {
            portfolio.setSearch('search');
            searchInput.textContent = 'search';
        }
    }

	function handleInput(e) {
		const text = e.target.innerText.replace(/\n/g, '');
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

	let categoriesTimeline = $derived.by(() => {
        let currentTotalChars = 0;
        const SEP_STR = " / ";
        
        return categories.map((cat, i) => {
            const buttonDelay = currentTotalChars * SPEED;
            currentTotalChars += cat.title.length;

            const isLast = i === categories.length - 1;
            const separatorDelay = currentTotalChars * SPEED;
            
            if (!isLast) currentTotalChars += SEP_STR.length;

            return { ...cat, buttonDelay, separatorDelay, isLast };
        });
    });

    let subcategoriesTimeline = $derived.by(() => {
        const activeCat = categories.find(c => c.slug.current === portfolio.category);
        if (!activeCat || !activeCat.subcategories) return [];

        let currentTotalChars = 0; 
        const SEP_STR = " / ";
        const BASE_OFFSET = 200;

        return activeCat.subcategories.filter(Boolean).map((sub, i) => {
            // Naming unified to buttonDelay
            const buttonDelay = BASE_OFFSET + (currentTotalChars * SPEED);
            currentTotalChars += sub.title.length;

            const isLast = i === activeCat.subcategories.filter(Boolean).length - 1;
            const separatorDelay = BASE_OFFSET + (currentTotalChars * SPEED);
            
            if (!isLast) currentTotalChars += SEP_STR.length;

            return { ...sub, buttonDelay, separatorDelay, isLast };
        });
    });
</script>

<div id="filters" style="height: {portfolio.filters ? `${filtersHeight}px` : '1.1em'}">
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
				<span in:typewriterTransition|global={{ speed: 20, delay: 300 }} out:typewriterTransition|global={{ speed: 20 }}>filters</span>
			{/if}
		</button>
			<div id="filters-panel" class="categories" bind:clientHeight={filtersHeight}>
			{#if portfolio.filters}
				{#each categoriesTimeline as category, i}
					{#if portfolio.category == undefined || portfolio.category == category.slug.current}
						<button 
							class="category" 
							use:typewriterKeep={{ speed: SPEED, delay: category.buttonDelay }}
							out:typewriterKeep|global={{ speed: SPEED }}
							aria-pressed={portfolio.category === category.slug.current}
							onclick={() =>
								portfolio.category === category.slug.current
								? (portfolio.setCategory(undefined))
								: (portfolio.setCategory(category.slug.current))
							}
						>
							{category.title}
						</button>{#if !category.isLast && portfolio.category == undefined}<span class="separator" use:typewriterKeep={{ speed: SPEED, delay: category.separatorDelay }} >{@html " / "}</span>{/if}
					{/if}
					{#if portfolio.category == category.slug.current}
						<div class="subcategories">
							{#each subcategoriesTimeline as subcategory}
								<button 
									class="subcategory" 
									use:typewriterKeep={{ speed: SPEED, delay: subcategory.buttonDelay }}
									aria-pressed={portfolio.subcategories.includes(subcategory.slug.current)}
									onclick={() => portfolio.toggleSubcategory(subcategory.slug.current)}
								>
									{subcategory.title}
								</button>
								{#if !subcategory.isLast}
									<span class="separator" use:typewriterKeep={{ speed: SPEED, delay: subcategory.separatorDelay }}>{@html " / "}</span>
								{/if}
							{/each}
						</div>
					{/if}
				{/each}
			{/if}
</div>
	{:else if portfolio.view == "list"}
		<div id="search">
				<span
				class="search" in:typewriterTransition|global={{ speed: 20, delay: 300 }} out:typewriterTransition|global={{ speed: 20 }}
				contenteditable="true"
				role="textbox"
				aria-label="Search"
				aria-multiline="false"
				tabindex="0"
				bind:this={searchInput}
				onkeydown={handleKeydown}
				oninput={handleInput}
				onclick={() => {openSearch()}}
				onblur={handleBlur}
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
		align-items: flex-start;
		width: calc((100% - var(--gutter)*2)/12 * 11);
		transition: var(--transition-s);
		position: relative;

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
			display: inline;
			width: stretch;

			.category {
				&:hover {
					color: var(--gray-dark);
				}
			}

			.separator {
				color: var(--black);
			}
		}

		.subcategories {
			display: inline;
			width: 70%;
			position: absolute;
			right: 0;

			.subcategory {
				&:hover,
				&[aria-pressed="true"] {
					color: var(--gray-dark);
				}
			}

			.separator {
				color: var(--black);
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

			&.is-placeholder {
                color: var(--gray-dark);
                font-style: italic;
            }

            &:focus {
                color: var(--black);
                font-style: normal;
                outline: none;
            }

			@media screen and (max-width: 768px) {
				width: unset;
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