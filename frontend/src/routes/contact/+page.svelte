<script>
    import HeadSingle from '$lib/components/HeadSingle.svelte';
    import { urlFor } from '$lib/utils/image.js';
    import { typewriterKeep } from '$lib/utils/typewriter.js';
    import Marquee from 'svelte-fast-marquee';
    import { fade } from 'svelte/transition';

	const SPEED = 7
	const START = 500;
	const STEP = 30;

	let { data } = $props()
	let loaded = $state(false)

	let currentDelay = START;
    function nextDelay() {
        const d = currentDelay;
        currentDelay += STEP;
        return d;
    }
	
	$effect(() => {
		loaded = true
	})
</script>

<HeadSingle seo={data.seo[0]} seoSingle={{seoTitle: 'Contact'}}/>

<main class="md-24">
	<section id="contacts">
		<h1 class="md-36 md-26-mb" use:typewriterKeep={{ speed: SPEED, delay: nextDelay()}}>contact us</h1>
		<div class="contacts md-20-mb">
			{#if data.info.email}
				{#if data.info.email}<p><a class="email underline hover-gray-dark" href="mailto:{data.info.email}"><span use:typewriterKeep={{ speed: SPEED, delay: nextDelay()}}>{data.info.email}</span></a></p>{/if}
			{/if}
			{#if data.info.adressLabel}
				<div class="adress">
					{#if data.info.adressHref}
						<p><a class="hover-gray-dark" href={data.info.adressHref} target="_blank" rel="noopener noreferrer"><span use:typewriterKeep={{ speed: SPEED, delay: nextDelay()}}>{data.info.adressLabel}</span></a></p>
					{:else}
						<p><span use:typewriterKeep={{ speed: SPEED, delay: nextDelay()}}>{data.info.adressLabel}</span></p>
					{/if}
					{#if data.info.adressCountry}
						<p use:typewriterKeep={{ speed: SPEED, delay: nextDelay()}}>{data.info.adressCountry}</p>
					{/if}
				</div>
			{/if}
			{#if data.info.socials}
				<div class="socials">
					<p use:typewriterKeep={{ speed: SPEED, delay: nextDelay()}}>follow us on</p>
					{#each data.info.socials as social, i}
						<p><a class="hover-gray-dark" href={social.socialHref} target="_blank" rel="noopener noreferrer"><span use:typewriterKeep={{ speed: SPEED, delay: nextDelay()}}>{social.socialLabel}</span></a></p>
					{/each}
				</div>
			{/if}
		</div>
	</section>
	<section id="services">
		<h2 class="md-36 md-26-mb" use:typewriterKeep={{ speed: SPEED, delay: nextDelay()}}>services</h2>
		{#if data.contact.services}
			<p class="services md-20-mb" use:typewriterKeep={{ speed: SPEED, delay: nextDelay()}}>
				{#each data.contact.services as service, i}{service.title}{#if i+2 < data.contact.services.length}{@html ', '}{:else if i+2 == data.contact.services.length}{@html ' and '}{/if}{/each}
			</p>
		{/if}
	</section>
	{#if data.contact.collaborations}
		<section id="collaborations">
			<h2 class="md-36 md-26-mb" use:typewriterKeep={{ speed: SPEED, delay: nextDelay()}}>collaborations</h2>
			<div class="collaborations md-20-mb">
				{#each data.contact.collaborations as block (block._key)}
					<p use:typewriterKeep={{ speed: SPEED/2, delay: nextDelay()}}>{block.children?.map(c => c.text).join('')}</p>
				{/each}
			</div>
		</section>
	{/if}
	<section id="clients">
		{#if data.contact.clientLines && loaded}
			{#each data.contact.clientLines as line, i}
				{@const lineDelay = nextDelay()}
				<Marquee speed={50} pauseOnHover={true} autoFill={true} direction={i%2 ? 'left' : 'right'} gap="var(--sp-l)">
					{#each line.clients.filter(c => c?.logo) as client, j}
						<img in:fade|global={{duration: 100, delay: lineDelay + j * STEP}} class="client" src={urlFor(client.logo)} alt="{client.title} logo">
					{/each}
				</Marquee>
			{/each}
		{/if}
	</section>
</main>

<style lang="scss">
	main {
		margin-top: var(--headerHeight);
		padding: var(--sp-xl) var(--sp-m) var(--sp-l);

		#contacts {
			display: grid;
			grid-template-columns: repeat(12, 1fr);
			column-gap: var(--gutter);
			row-gap: var(--sp-s);
			align-items: baseline;

			h1 {
				grid-column: 1 / span 6;

				@media screen and (max-width: 576px) {
					grid-column: 1 / span 12;
				}
			}
			
			.contacts {
				grid-column: 7 / span 6;
				display: grid;
				grid-template-columns: repeat(6, 1fr);
				column-gap: var(--gutter);
				row-gap: var(--sp-m);

				.email {
					grid-column: 1 / span 3;

					&:hover {
						text-decoration-color: var(--gray-dark);
					}

					@media screen and (max-width: 1280px) {
						grid-column: 1 / span 6;
					}

					@media screen and (max-width: 576px) {
						margin-bottom: var(--sp-l);
					}
				}
				.adress {
					grid-column: 4 / span 3;

					@media screen and (max-width: 1280px) {
						grid-column: 1 / span 6;
					}
				}
				.socials {
					grid-column: 1 / span 6;
				}

				@media screen and (max-width: 576px) {
					grid-column: 1 / span 12;
				}
			}
		}

		#services {
			margin-top: var(--sp-l);
			display: grid;
			grid-template-columns: repeat(12, 1fr);
			column-gap: var(--gutter);
			row-gap: var(--sp-s);
			align-items: baseline;

			h2 {
				grid-column: 1 / span 6;

				@media screen and (max-width: 576px) {
					grid-column: 1 / span 12;
				}
			}

			p {
				grid-column: 7 / span 6;

				@media screen and (max-width: 576px) {
					grid-column: 1 / span 12;
				}
			}
		}

		#collaborations {
			margin-top: var(--sp-l);
			display: grid;
			grid-template-columns: repeat(12, 1fr);
			column-gap: var(--gutter);
			row-gap: var(--sp-s);
			align-items: baseline;

			h2 {
				grid-column: 1 / span 6;

				@media screen and (max-width: 576px) {
					grid-column: 1 / span 12;
				}
			}

			.collaborations {
				grid-column: 7 / span 6;

				@media screen and (max-width: 576px) {
					grid-column: 1 / span 12;
				}
			}
		}

		#clients {
			margin: var(--sp-xl) calc(var(--sp-m)*-1) var(--sp-xl);
			display: grid;
			grid-template-columns: repeat(12, 1fr);
			column-gap: var(--gutter);
			align-items: baseline;

			@media screen and (max-width: 576px) {
				margin: var(--sp-m) calc(var(--margin-mb)*-1) var(--sp-xl);
			}

			:global(.marquee-container) {
				grid-column: 1 / span 12;
				margin: var(--sp-l) 0 var(--sp-l);
			}

			:global(.marquee .client) {
				height: 3rem;
				width: auto;
			}

			:global(.marquee-container + .marquee-container) {
				margin: 0 0 var(--sp-l);
			}
		}

		@media screen and (max-width: 768px) {
			padding: var(--sp-s) var(--margin-mb) var(--sp-l);
		}
	}
</style>