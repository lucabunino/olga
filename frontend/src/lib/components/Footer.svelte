<script>
    import typewriter from "$lib/utils/typewriter";
	
	let { info, policies } = $props()

	const words = ["olga", "lago"];
	let wordsIndex = $state(0)
	let string = $derived(words[wordsIndex])

	$effect(() => {
		setInterval(() => {
			if (wordsIndex < words.length - 1) {
				wordsIndex++
			} else {
				wordsIndex = 0
			}
		}, 2000);
	})
</script>

<footer>
	<section id="contacts">
		<div>
			{#if info.adressLabel}
				<div>
					{#if info.adressHref}
						<p><a href={info.adressHref} target="_blank" rel="noopener noreferrer">{info.adressLabel}</a></p>
					{:else}
						<p>{info.adressLabel}</p>
					{/if}
				</div>
			{/if}
			{#if info.email || info.vat}
				<div>
					{#if info.email}<p>{info.email}</p>{/if}
					{#if info.vat}<p>P.IVA {info.vat}</p>{/if}
				</div>
			{/if}
			{#if info.socials}
				<div>
					{#each info.socials as social, i}
						<p><a href={social.socialHref} target="_blank" rel="noopener noreferrer">{social.socialLabel}</a></p>
					{/each}
				</div>
			{/if}
		</div>
		<div>
			<p>©{new Date().getFullYear()}</p>
			{#if policies}
				{#each policies as policy}
					<p><a href="/{policy.slug.current}">{policy.title}</a></p>
				{/each}
			{/if}
		</div>
	</section>
	<section id="title">
		<p>studio</p>
		<div class="typewriter">
			{#key string}
				<p in:typewriter={{ speed: 100, delay: 200 }} out:typewriter={{ speed: 100 }}>{string}</p>
			{/key}
		</div>
	</section>
</footer>

<style>
footer {
	background-color: var(--gray-light);
	padding: var(--sp-m);
	
	#contacts {
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		column-gap: var(--gutter);

		>div:nth-child(1) {
			grid-column: 1 / span 9;
			display: grid;
			grid-template-columns: repeat(9, 1fr);
			column-gap: var(--gutter);

			div {
				grid-column: span 2;
			}
		}
		
		>div:nth-child(2) {
			grid-column: 10 / span 3;
			color: var(--gray-dark);
			width: fit-content;
            margin-left: auto;
		}
	}

	#title {
		font-size: 15vw;
		font-weight: 500;
		letter-spacing: -.01em;
		display: flex;
		justify-content: space-between;
		margin-top: 12vw;

		.typewriter {
			display: inline-flex;
		}
	}
}
</style>