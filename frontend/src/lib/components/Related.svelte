<script>
	import ProjectCover from "./ProjectCover.svelte";
	import { gsap } from "gsap";
	import { Draggable } from "gsap/Draggable";
	import { InertiaPlugin } from "gsap/InertiaPlugin";
	import { horizontalLoop } from "$lib/utils/gsap"
	gsap.registerPlugin(Draggable, InertiaPlugin);

	let { related, title } = $props();
	let track = $state(undefined)

	let isDynamic = $derived(related?.length >= 5 ? true : false)

	
	$effect(() => {
		if (track && isDynamic) {
			const projects = gsap.utils.toArray(".project");

			let activeElement;

			const loop = horizontalLoop(projects, {
				paused: false, 
				draggable: true,
				center: false,
				speed: .5,
				wheel: true,
  				wheelSpeed: 1.2,
				onChange: (element, index) => { // when the active element changes, this function gets called.
					activeElement && activeElement.classList.remove("active");
					element.classList.add("active");
					activeElement = element;
				}
			});

			projects.forEach((box, i) => box.addEventListener("click", () => loop.toIndex(i, {duration: 0.8, ease: "power1.inOut"})));
		}
	});
</script>

<section id="related">
	{#if title}
		<h3 class="md-36">{title}</h3>
	{/if}
	<div class="marquee">
		<div class="track {isDynamic ? 'dynamic' : 'static'}" bind:this={track}>
			{#each related as project}
				<div class="project">
					<ProjectCover {project} />
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	#related {
		h3 {
			padding: var(--sp-l) var(--sp-m) var(--sp-s);
		}
		.marquee {
			margin-bottom: var(--sp-l);
			overflow: hidden;
			cursor: grab;
			position: relative;
			height: clamp(calc((200px - var(--gutter))/3*4 + 6rem), calc((20vw - var(--gutter))/3*4 + 6rem), calc((400px - var(--gutter))/3*4 + 6rem));

			position: relative;
			display: flex;
			align-items: center;
			overflow: hidden;

			.track {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				display: flex;
				justify-content: flex-start;

				&.static {
					padding: 0 var(--sp-m);
				}

				.project {
					flex-shrink: 0;
					width: 18vw;
					min-width: 200px;
					max-width: 400px;
					padding-right: var(--gutter);
				}
				.project.active {
					outline: 2px solid var(--accent);
				}
			}
		}
	}
</style>