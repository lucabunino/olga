<script>
    import { urlFor } from '$lib/utils/image.js';
    import { Canvas } from '@threlte/core'
    import Grid from '$lib/components/Grid.svelte'
    import { innerHeight, innerWidth } from 'svelte/reactivity/window';
    import Marquee from 'svelte-fast-marquee';

    let { data } = $props()
    let cursor = $state()

	import { getMenu } from '$lib/stores/menu.svelte.js';
    import { pageIn, pageOut } from '$lib/utils/transitions.js';
    let menuer = getMenu();

    const repeatedText = $derived(Array.from({ length: 10 }, () => data.homepage.marquee));
</script>

<main>
    {#if data.homepage.marquee}
        <div id="marquee" class="md-12 {menuer.hidden ? 'up' : 'down'}"
		in:pageIn={{ duration: DURATION, delay: 0, pageHeight: innerHeight.current, pageWidth: innerWidth.current}}
		out:pageOut={{ duration: DURATION, delay: 0, pageHeight: innerHeight.current, pageWidth: innerWidth.current}}
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

    <section id="images" style="--cursor: {cursor ? cursor : 'grab'}">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
            <Grid images={data.homepage.images} bind:cursor={cursor}/>
        </Canvas>
    </section>
</main>

<style>
#marquee {
    background-color: var(--yellow);
    width: 100%;
    position: fixed;
    top: 7rem;
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
</style>