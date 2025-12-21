<script>
	let { data } = $props()
	$inspect(data)
	const contact = data.contact
</script>
<main class="md-24">
	<section id="contacts">
		<h1 class="md-36">contattaci</h1>
		<div class="contacts">
			{#if data.info.email}
				{#if data.info.email}<p class="email"><a href="mailto:{data.info.email}">{data.info.email}</a></p>{/if}
			{/if}
			{#if data.info.adressLabel}
				<div class="adress">
					{#if data.info.adressHref}
						<p><a href={data.info.adressHref} target="_blank" rel="noopener noreferrer">{data.info.adressLabel}</a></p>
					{:else}
						<p>{data.info.adressLabel}</p>
					{/if}
					{#if data.info.adressCountry}
						<p>{data.info.adressCountry}</p>
					{/if}
				</div>
			{/if}
			{#if data.info.socials}
				<div class="socials">
					<p>seguici su</p>
					{#each data.info.socials as social, i}
						<p><a href={social.socialHref} target="_blank" rel="noopener noreferrer">{social.socialLabel}</a></p>
					{/each}
				</div>
			{/if}
		</div>
	</section>
	<section id="services">
		<h2 class="md-36">servizi</h2>
		{#if contact.services}
			<p class="services">
				{#each contact.services as service, i}{service.title}{#if i+2 < contact.services.length}{@html ', '}{:else if i+2 == contact.services.length}{@html ' e '}{/if}{/each}
			</p>
		{/if}
	</section>
	<section id="clients">
		<h2 class="md-36">clienti</h2>
		{#if contact.clients}
			<p class="clients">
				{#each contact.clients as client, i}{client.title}{#if i+2 < contact.clients.length}{@html ', '}{:else if i+2 == contact.clients.length}{@html ' e '}{/if}{/each}
			</p>
		{/if}
	</section>
</main>

<style>
	main {
		margin-top: 7rem;
		padding: var(--sp-s) var(--sp-m) var(--sp-l);

		#contacts {
			display: grid;
			grid-template-columns: repeat(12, 1fr);
			column-gap: var(--gutter);

			h1 {
				grid-column: 1 / span 6;
			}
			
			.contacts {
				grid-column: 7 / span 6;
				display: grid;
				grid-template-columns: repeat(6, 1fr);
				column-gap: var(--gutter);

				.email {
					grid-column: 1 / span 3;
				}
				.adress {
					grid-column: 4 / span 3;
				}
				.socials {
					grid-column: 1 / span 6;
				}
			}
		}

		#services,
		#clients {
			margin-top: var(--sp-l);
			display: grid;
			grid-template-columns: repeat(12, 1fr);
			column-gap: var(--gutter);

			h2 {
				grid-column: 1 / span 6;
			}

			p {
				grid-column: 7 / span 6;		
			}
		}

		#poem {
			display: flex;
			justify-content: center;
			align-items: center;
			min-height: 100vh;
			padding: 0 var(--sp-m);

			.poem {
				.line {
					display: block;
					height: 1.1em;
				}
			}
		}

		#bio {
			display: grid;
			grid-template-columns: repeat(12, 1fr);
			column-gap: var(--gutter);
			padding: 0 var(--sp-m) var(--sp-m);

			.location {
				grid-column: 1 / span 6;
			}

			.bio {
				grid-column: 7 / span 6;
			}
		}
	}
</style>