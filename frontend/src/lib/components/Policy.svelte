<script>
    import { PortableText } from "@portabletext/svelte";
    import PortableTextStylePolicy from "./portableTextStyles/portableTextStylePolicy.svelte";

    let { policy } = $props()
</script>

<main class="md-18">
	{#if policy.title}
		<h1 class="md-36">{policy.title}</h1>
	{/if}
	{#if policy.body}
		<div class="policyText portableText">
			<PortableText value={policy.body}
			components={{
				block: {
					normal: PortableTextStylePolicy,
					h3: PortableTextStylePolicy,
					h4: PortableTextStylePolicy,
				},
				listItem: PortableTextStylePolicy,
				marks: {
					link: PortableTextStylePolicy,
				},
			}}/>
		</div>
	{/if}
</main>

<style>
	main {
		margin-top: var(--headerHeight);
		min-height: calc(100svh - var(--headerHeight));
		width: 100vw;
		padding: var(--sp-s) var(--sp-m) var(--sp-l);

		h1 {
			margin-bottom: var(--sp-m);
		}
		
		.policyText {
			max-width: 800px;
		}

		@media screen and (max-width: 768px) {
			min-height: calc(100svh - 8rem);
			padding: var(--sp-s) var(--margin-mb) var(--sp-l);
		}
	}
</style>