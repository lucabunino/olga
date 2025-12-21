<script>
    import Media from "./media/Media.svelte";
    let {project} = $props()
</script>

<a href="portfolio/{project.slug.current}">
	<div class="media-wrapper">
		<Media media={project.cover} customWidthActive={false} />
	</div>
	<h2 class="md-12">{project.title}</h2>
</a>

<style>
	.media-wrapper {
		aspect-ratio: 3/4;
		width: 100%;
		position: relative;
		overflow: hidden;
		background-color: var(--gray-light);
	}
	h2 {
		margin-top: .4em;
	}
</style>