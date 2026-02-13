<script>
    let { view = $bindable(), filtersOpen = $bindable() } = $props()

    import { getPortfolio } from '$lib/stores/portfolio.svelte.js';
    let portfolio = getPortfolio()
</script>

<div id="views">
    <button class="list" onclick={() => {portfolio.setView('list')}} aria-pressed={portfolio.view == 'list'}>
        <span class="line"></span>
    </button>
    
    <button class="box" onclick={() => portfolio.setView('grid')} aria-pressed={portfolio.view == 'grid'}>
        <span class="side top"></span>
        <span class="side right"></span>
        <span class="side bottom"></span>
        <span class="side left"></span>
    </button>
</div>

<style>
    #views {
        display: flex;
        align-items: center;
        column-gap: .3em;
        width: calc((100% - var(--gutter)*2)/12);
        min-width: fit-content;

        button {
            background: none;
            border: none;
            padding: 0;
            cursor: pointer;
            color: var(--black);
            transition: color 0.2s ease;

            &:hover,
            &[aria-pressed="true"] {
                color: var(--gray-dark);
            }
        }

        .list {
            width: 1.6em;
            height: 1.2em;
            position: relative;

            .line {
                position: absolute;
                left: 0;
                width: 70%;
                height: 1.5px;
                border-radius: .75px;
                background: currentColor;
                top: 50%;
                transform: translateY(-50%);
            }
        }

        .box {
            width: 1.2em;
            height: .6em;
            position: relative;

            .side {
                position: absolute;
                background: currentColor;
            }

            .top, .bottom {
                width: 100%;
                height: 1.5px;
                left: 0;
            }
            .left, .right {
                width: 1.5px;
                height: 100%;
                top: 0;
            }

            .top { top: 0; }
            .bottom { bottom: 0; }
            .left { left: 0; }
            .right { right: 0; }
        }
    }
</style>