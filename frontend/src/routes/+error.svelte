<script>
	import { page } from '$app/state'
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'
	import { fade } from 'svelte/transition'

	const isNotFound = page.status === 404
	let countdown = $state(3)

	onMount(() => {
		if (!isNotFound) return
		const interval = setInterval(() => {
			countdown -= 1
			if (countdown <= 0) {
				clearInterval(interval)
				goto('/')
			}
		}, 1000)
		return () => clearInterval(interval)
	})
</script>

<main id="error">
	{#if isNotFound}
		<p class="md-36">404: Not found</p>
		<p class="md-24">Redirecting to homepage in {countdown}</p>
	{:else}
		<p class="md-36">{page.status}</p>
		<p class="md-24">{page.error?.message}</p>
	{/if}
</main>

<style lang="scss">
	#error {
		margin-top: var(--sp-l);
		padding: var(--sp-xl) var(--sp-m) var(--sp-l);

		.md-24 {
			margin-top: var(--sp-xs);
		}


		@media screen and (max-width: 768px) {
			padding: var(--sp-xl) var(--margin-mb) var(--sp-l);
		}
	}
</style>
