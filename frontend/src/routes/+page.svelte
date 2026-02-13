<script>
    import { urlFor } from '$lib/utils/image.js';
    import { Canvas } from '@threlte/core'
    import { Suspense } from '@threlte/extras'
    import Grid from '$lib/components/Grid.svelte'
    import { innerHeight, innerWidth } from 'svelte/reactivity/window';
    import Marquee from 'svelte-fast-marquee';
	import { getMenu } from '$lib/stores/menu.svelte.js';
    import { pageIn, pageOut, mock } from '$lib/utils/transitions.js';
    import { fade, slide, fly } from 'svelte/transition';
	import { onNavigate } from '$app/navigation';

	let { data } = $props()
    let cursor = $state()
    let domLoaded = $state(false)
    let menuer = getMenu();
    const repeatedText = $derived(Array.from({ length: 10 }, () => data.homepage.marquee));
	let isExiting = $state(false);
    const DURATION = 800;

	$effect(() => {
		domLoaded = true

		return () => {
			domLoaded = false
		}
	})

    onNavigate(() => {
        // 1. Attiviamo lo stato di uscita per far partire eventuali animazioni/fade
        isExiting = true;

        // 2. Restituiamo una Promise: SvelteKit aspetterà che si risolva
        // prima di distruggere questa pagina e montare la prossima.
        // return new Promise((resolve) => {
        //     setTimeout(() => {
        //         resolve();
        //     }, DURATION);
        // });
    });
</script>

<main>
    {#if data.homepage.marquee && !isExiting}
        <div id="marquee" class="md-12 {menuer.hidden ? 'up' : 'down'}"
		in:pageIn={{ duration: DURATION, delay: 0, pageHeight: innerHeight.current, pageWidth: innerWidth.current}}
		out:fly={{ duration: 300, y: -20 }}
		>
            <Marquee speed={70} pauseOnHover={true}>
                <div class="marquee-content">
                    {#each repeatedText as text}
                        <p>
                            {#if data.homepage.marqueeHref}
                                <a 
                                    href={data.homepage.marqueeHref} 
                                    target={data.homepage.marqueeExternal ? '_blank' : undefined}
                                    rel={data.homepage.marqueeExternal ? 'noopener noreferrer' : undefined}
                                >
                                    {text}
                                </a>
                            {:else}
                                {text}
                            {/if}
                        </p>
                    {/each}
                </div>
            </Marquee>
        </div>
    {/if}
	{#if !isExiting}
		<!-- <section id="images" style="--cursor: {cursor ? cursor : 'grab'}"
		out:pageOut={{ duration: DURATION, delay: 0, scrollY: scrollY, pageHeight: innerHeight.current, pageWidth: innerWidth.current}}> -->
		<section id="images" style="--cursor: {cursor ? cursor : 'grab'}"
		out:mock={{ duration: DURATION}}>
			<Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
				<Grid images={data.homepage?.images} bind:cursor={cursor} {isExiting}/>
				<!-- <Suspense>
					{#snippet fallback()}
						<T.Mesh>
							<T.BoxGeometry args={[1, 1, 1]} />
							<T.MeshBasicMaterial color="black" />
						</T.Mesh>
					{/snippet}

					<Grid images={data.homepage?.images} bind:cursor={cursor}/>
				</Suspense> -->
			</Canvas>
		</section>
	{/if}
</main>

<style>
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