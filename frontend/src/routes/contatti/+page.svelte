<script>
    import HeadSingle from '$lib/components/HeadSingle.svelte';
    import { typewriterKeep } from '$lib/utils/typewriter.js';

	const SPEED = 10
	const START = 500;
	const STEP = 50;

	let { data } = $props()
	const contact = data.contact

	let currentDelay = START;
    function nextDelay() {
        const d = currentDelay;
        currentDelay += STEP;
        return d;
    }
</script>

<HeadSingle seo={data.seo[0]} seoSingle={{seoTitle: 'Contatti'}}/>

<main class="md-24">
	<section id="contacts">
		<h1 class="md-36 md-26-mb" use:typewriterKeep={{ speed: SPEED, delay: nextDelay()}}>contattaci</h1>
		<div class="contacts md-20-mb">
			{#if data.info.email}
				{#if data.info.email}<p use:typewriterKeep={{ speed: SPEED, delay: nextDelay()}} class="email"><a href="mailto:{data.info.email}">{data.info.email}</a></p>{/if}
			{/if}
			{#if data.info.adressLabel}
				<div class="adress">
					{#if data.info.adressHref}
						<p use:typewriterKeep={{ speed: SPEED, delay: nextDelay()}}><a href={data.info.adressHref} target="_blank" rel="noopener noreferrer">{data.info.adressLabel}</a></p>
					{:else}
						<p use:typewriterKeep={{ speed: SPEED, delay: nextDelay()}}>{data.info.adressLabel}</p>
					{/if}
					{#if data.info.adressCountry}
						<p use:typewriterKeep={{ speed: SPEED, delay: nextDelay()}}>{data.info.adressCountry}</p>
					{/if}
				</div>
			{/if}
			{#if data.info.socials}
				<div class="socials">
					<p use:typewriterKeep={{ speed: SPEED, delay: nextDelay()}}>seguici su</p>
					{#each data.info.socials as social, i}
						<p use:typewriterKeep={{ speed: SPEED, delay: nextDelay()}}><a href={social.socialHref} target="_blank" rel="noopener noreferrer">{social.socialLabel}</a></p>
					{/each}
				</div>
			{/if}
		</div>
	</section>
	<section id="services">
		<h2 class="md-36 md-26-mb" use:typewriterKeep={{ speed: SPEED, delay: nextDelay()}}>servizi</h2>
		{#if contact.services}
			<p class="services md-20-mb" use:typewriterKeep={{ speed: SPEED, delay: nextDelay()}}>
				{#each contact.services as service, i}{service.title}{#if i+2 < contact.services.length}{@html ', '}{:else if i+2 == contact.services.length}{@html ' e '}{/if}{/each}
			</p>
		{/if}
	</section>
	<section id="clients">
		<h2 class="md-36 md-26-mb" use:typewriterKeep={{ speed: SPEED, delay: nextDelay()}}>clienti</h2>
		{#if contact.clients}
			<p class="clients md-20-mb" use:typewriterKeep={{ speed: SPEED, delay: nextDelay()}}>
				{#each contact.clients as client, i}{client.title}{#if i+2 < contact.clients.length}{@html ', '}{:else if i+2 == contact.clients.length}{@html ' e '}{/if}{/each}
			</p>
		{/if}
	</section>
</main>

<style>
	main {
		margin-top: var(--headerHeight);
		padding: var(--sp-s) var(--sp-m) var(--sp-l);

		#contacts {
			display: grid;
			grid-template-columns: repeat(12, 1fr);
			column-gap: var(--gutter);
			row-gap: var(--sp-s);

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
					text-decoration: underline;
					text-decoration-thickness: 2px;
					text-underline-offset: 7px;

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

		#services,
		#clients {
			margin-top: var(--sp-l);
			display: grid;
			grid-template-columns: repeat(12, 1fr);
			column-gap: var(--gutter);
			row-gap: var(--sp-s);

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

		@media screen and (max-width: 768px) {
			padding: var(--sp-s) var(--margin-mb) var(--sp-l);
		}
	}
</style>