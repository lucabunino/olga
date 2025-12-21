
<script>
    import Image from "./Image.svelte";
    import Gif from "./Gif.svelte";
    import Video from "./Video.svelte";
    let { media, customWidthActive = false } = $props()
	let customWidth = media?.customWidth ?? 65;
</script>

<div class="media" style="{customWidthActive ? `width: ${customWidth}%` : undefined}">
	{#if media && media.type == 'image'}
		<Image image={media.image} />
	{:else if media && media.type == 'video'}
		<Video video={media.video} videoCover={media.videoCover} />
	{:else if media && media.type == 'gif'}
		<Gif frames={media.gifFrames} interval={media.gifInterval} />
	{:else}
		Missing image
	{/if}
</div>

<style>
	.media {
		justify-self: center;
		align-content: center;
		text-align: center;
		width: 100%;
		height: 100%;
		position: relative;
	}
</style>