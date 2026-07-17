<script>
	import { typewriterLoop } from '$lib/utils/typewriter.js';
	import FooterCircle from '$lib/components/FooterCircle.svelte';
	let { info, policies } = $props()

	let wordsIndex = $state(0)
	let string = $derived(info.footerLoop[wordsIndex])

	$effect(() => {
		setInterval(() => {
			if (wordsIndex < info.footerLoop.length - 1) {
				wordsIndex++
			} else {
				wordsIndex = 0
			}
		}, 3000);
	})
</script>

<footer>
	<section id="contacts">
		<div class="contacts">
			{#if info.adressLabel || info.legalAdressLabel}
				<div>
					{#if info.adressLabel}
						{#if info.adressHref}
							<p><a class="hover-gray-dark" href={info.adressHref} target="_blank" rel="noopener noreferrer">{info.adressLabel}</a></p>
						{:else}
							<p>{info.adressLabel}</p>
						{/if}
					{/if}
					{#if info.legalAdressLabel}
						<div class="legal-adress">
							{#if info.legalAdressHref}
								<p><a class="hover-gray-dark" href={info.legalAdressHref} target="_blank" rel="noopener noreferrer">{info.legalAdressLabel}</a></p>
							{:else}
								<p>{info.legalAdressLabel}</p>
							{/if}
							{#if info.legalAdressCountry}
								<p>{info.legalAdressCountry}</p>
							{/if}
						</div>
					{/if}
				</div>
			{/if}
			{#if info.email || info.vat}
				<div>
					{#if info.email}<p><a class="hover-gray-dark" href="mailto:{info.email}">{info.email}</a></p>{/if}
					{#if info.vat}<p>VAT {info.vat}</p>{/if}
				</div>
			{/if}
			{#if info.socials}
				<div>
					{#each info.socials as social, i}
						<p><a class="hover-gray-dark" href={social.socialHref} target="_blank" rel="noopener noreferrer">{social.socialLabel}</a></p>
					{/each}
				</div>
			{/if}
		</div>
		<div class="circle">
			<FooterCircle/>
		</div>
		<div class="policies">
			<p>©{new Date().getFullYear()}</p>
			{#if policies}
				{#each policies as policy}
					<p><a class="hover-black" href="/{policy.slug.current}">{policy.title}</a></p>
				{/each}
			{/if}
		</div>
	</section>
	<section id="title">
		<p>studio</p>
		<div class="typewriter">
			<p use:typewriterLoop={{ 
				words: info.footerLoop, 
				speed: 100 , 
				pause: 2000
			}}></p>
		</div>
	</section>
</footer>

<style lang="scss">
footer {
	background-color: var(--gray-light);
	padding: var(--sp-m);
	
	#contacts {
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		column-gap: var(--gutter);

		.contacts {
			grid-column: 1 / span 9;
			display: grid;
			grid-template-columns: repeat(9, 1fr);
			column-gap: var(--gutter);

			div {
				grid-column: span 2;
			}

			.legal-adress {
				margin-top: var(--sp-s);
			}
		}

		.circle {
			grid-column: 10 / span 1;
			margin-top: var(--sp-xs);
		}
		
		.policies {
			grid-column: 11 / span 2;
			color: var(--gray-dark);
			width: fit-content;
            margin-left: auto;
		}
	}

	#title {
		font-size: clamp(60px, 15vw, 400px);
		font-weight: 500;
		line-height: 1;
		letter-spacing: -.01em;
		display: flex;
		justify-content: space-between;
		margin-top: clamp(60px, 12vw, 400px);

		.typewriter {
			display: inline-flex;

			p {
				height: 1em;
			}
		}
	}

	@media screen and (max-width: 768px) {
		padding: var(--sp-s) var(--margin-mb);

		#contacts {
			display: flex;
			flex-direction: column;
			row-gap: var(--sp-m);
			position: relative;

			.contacts {
				grid-template-columns: repeat(6, 1fr);
				column-gap: var(--gutter);
				grid-auto-flow: dense;
				row-gap: var(--sp-m);

				div:nth-child(1),
				div:nth-child(2) {
					grid-column: 1 / span 4;

					@media screen and (max-width: 300px) {
						grid-column: 1 / span 6;
					}
				}
				div:nth-child(3) {
					grid-column: 5 / span 2;

					@media screen and (max-width: 300px) {
						grid-column: 1 / span 6;
					}
				}
			}

			.circle {
				position: absolute;
				right: 23%;
				top: 48%;
			}
			
			.policies {
				grid-column: 1 / span 4;
				margin-left: unset;
			}
		}

		#title {
			flex-direction: column;

			.typewriter {
				display: inline-flex;
			}
		}
	}
}
</style>