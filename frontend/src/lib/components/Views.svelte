<script>
	let { view = $bindable(), filtersOpen = $bindable() } = $props()

	import { getPortfolio } from '$lib/stores/portfolio.svelte.js';
	let portfolio = getPortfolio()
</script>

<div id="views">
	<button class="list" onclick={() => {portfolio.setView('list')}} aria-pressed={portfolio.view == 'list'}>
			<span class="line"></span>
			<span class="line"></span>
			<span class="line"></span>
	</button>
	<button class="grid" onclick={() => portfolio.setView('grid')} aria-pressed={portfolio.view == 'grid'}>
			<span class="box"></span>
			<span class="box"></span>
			<span class="box"></span>
			<span class="box"></span>
	</button>
</div>

<style>
	#views {
		display: flex;
		align-items: center;
		column-gap: .6em;
		width: calc((100% - var(--gutter)*2)/12);

		.list {
			width: 1.2em;
			height: .4em;
			position: relative;
			left: 0;
			top: 0;

			&:hover,
			&[aria-pressed="true"] {
				color: var(--gray-dark);
			}

			.line {
				position: absolute;
				left: 0;
				width: 100%;
				height: 2px;
				border-radius: 1px;
				background: currentColor;
				transform-origin: center;
				transform: translateY(-50%);

				&:nth-child(1) {
					top: 0%;
				}
				&:nth-child(2) {
					top: 50%;
					width: 70%;
				}
				&:nth-child(3) {
					top: 100%;
				}
			}
		}

		.grid {
			width: 1.2em;
			height: .6em;
			position: relative;
			left: 0;
			top: 0;
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 1px;

			&:hover,
			&[aria-pressed="true"] {
				color: var(--gray-dark);
			}

			.box {
				width: 100%;
				height: 100%;
				background: currentColor;
			}
		}
	}
</style>