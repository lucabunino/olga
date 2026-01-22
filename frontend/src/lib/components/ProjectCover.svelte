<script>
    import Media from "./media/Media.svelte";
    let {project} = $props()
</script>

<a href="/portfolio/{project.slug.current}">
	<div class="media-wrapper">
		<div>
			<Media media={project.cover} customWidthActive={false} />
		</div>
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

		div {
			transition: var(--transition-s);
			width: 100%;
			height: 100%;
		}

		&:hover {
			div {
				transform: scale(1.05);
			}
		}
	}
	h2 {
		margin-top: .4em;
	}
</style>