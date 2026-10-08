<script>
    import { urlFor } from '$lib/utils/image.js';
    import { Canvas } from '@threlte/core'
    import { Suspense } from '@threlte/extras'
    import Grid from '$lib/components/Grid.svelte'
    import { innerHeight, innerWidth } from 'svelte/reactivity/window';
    import Marquee from 'svelte-fast-marquee';
    import AdiDesignIndexLogo from '$lib/components/AdiDesignIndexLogo.svelte';
	import { getMenu } from '$lib/stores/menu.svelte.js';
    import { pageIn, pageOut, mock } from '$lib/utils/transitions.js';
    import { fade, slide, fly } from 'svelte/transition';
	import { onNavigate } from '$app/navigation';

	let { data } = $props()
    let cursor = $state()
    let domLoaded = $state(false)
    let menuer = getMenu();
    const marqueeItems = $derived(data.homepage.marquee?.filter((item) => item?.text) ?? []);
    const repeatedItems = $derived(Array.from({ length: 10 }, () => marqueeItems).flat());
	let isExiting = $state(false);
    const DURATION = 800;

	$effect(() => {
		domLoaded = true

		return () => {
			domLoaded = false
		}
	})

    onNavigate((navigation) => {
        if (navigation.to?.url.pathname === navigation.from?.url.pathname) return;
        isExiting = true;
    });
</script>

<main>
    {#if marqueeItems.length && !isExiting}
        <div id="marquee" class="md-12 {menuer.hidden ? 'up' : 'down'}"
		in:pageIn={{ duration: DURATION, delay: 0, pageHeight: innerHeight.current, pageWidth: innerWidth.current}}
		out:fly={{ duration: 300, y: -20 }}
		>
            <Marquee speed={70} pauseOnHover={true}>
                <div class="marquee-content">
                    {#each repeatedItems as item}
                        <p>
                            {#if item.href}
                                <a 
                                    href={item.href} 
                                    target={item.external ? '_blank' : undefined}
                                    rel={item.external ? 'noopener noreferrer' : undefined}
                                >
                                    {item.text}
                                </a>
                            {:else}
                                {item.text}
                            {/if}
                        </p>
                    {/each}
                </div>
            </Marquee>
        </div>
    {/if}
	{#if data.homepage.showLogo && !isExiting}
		<div id="logo"
		in:fade={{ duration: DURATION }}
		out:fly={{ duration: 300, y: 20 }}
		>
			<AdiDesignIndexLogo height="3.5rem" />
		</div>
	{/if}
	{#if !isExiting}
		<section id="images" style="--cursor: {cursor ? cursor : 'grab'}"
		out:mock={{ duration: DURATION}}>
			<Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
				<Grid images={data.homepage?.images} bind:cursor={cursor}/>
			</Canvas>
		</section>
	{/if}
</main>

<style lang="scss">
	main {
		#marquee {
			background-color: var(--yellow);
			width: 100%;
			position: fixed;
			top: var(--headerHeight);
			left: 0;
			z-index: 2;
			overflow: hidden;
			align-items: center;
			transition: var(--transition-s);

			&.up {
				top: 0;
			}

			.marquee-content {
				display: flex;
				align-items: center;

				p {
					line-height: 1.8rem;
				}
			}

			p {
				white-space: nowrap;
				padding-right: .3em;
				margin: 0;

				&::after {
					content: '–';
					margin-left: .3em;
				}
			}

			a {
				text-decoration: none;
				color: inherit;
				display: inline-block;
			}

			@media screen and (max-width: 768px) {
				top: unset;
				bottom: 0;

				&.up {
					top: unset;
				}
			}
		}

		#logo {
			position: fixed;
			left: var(--sp-m);
			bottom: calc(var(--sp-s) * 1.5);
			z-index: 2;
			pointer-events: none;

			@media screen and (max-width: 768px) {
				left: var(--margin-mb);
			}
		}

		#images {
			width: 100vw;
			height: 100vh;
			position: fixed;
			left: 0;
			top: 0;
			background-color: var(--white);
			cursor: var(--cursor);
			
			&:active {
				cursor: grabbing;
			}
		}
	}
</style>