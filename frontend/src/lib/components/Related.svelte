<script>
    import ProjectCover from "./ProjectCover.svelte";
	import { browser } from "$app/environment";
    import { gsap } from "gsap";
	import { Draggable } from "gsap/dist/Draggable";
    import { InertiaPlugin } from "gsap/dist/InertiaPlugin";
	if (browser) {
		gsap.registerPlugin(Draggable);
		gsap.registerPlugin(InertiaPlugin);
	}
    import { horizontalLoop } from "$lib/utils/gsap"
    import { innerWidth } from "svelte/reactivity/window";

    let { related, title } = $props();
    let track = $state(undefined);
    let isDynamic = $derived.by(() => {
        if (!related?.length) return false;
        if (innerWidth.current < 640) return related.length >= 3;
        if (innerWidth.current < 1024) return related.length >= 4;
        return related.length >= 5;
    });
    let displayProjects = $derived.by(() => {
        if (!related?.length) return [];
        if (!isDynamic) return related;
       
        const multiplier = related.length < 6 ? 3 : 2;
        return Array.from({ length: multiplier }, () => related).flat();
    });

    $effect(() => {
        if (track && isDynamic && displayProjects.length > 0) {
            const projects = gsap.utils.toArray(".project");
            if (projects.length === 0) return;

            let activeElement;

            const loop = horizontalLoop(projects, {
                paused: false, 
                draggable: true,
                center: false,
                speed: .5,
                wheel: true,
                wheelSpeed: 1.2,
                onChange: (element, index) => {
                    activeElement?.classList.remove("active");
                    element.classList.add("active");
                    activeElement = element;
                }
            });

            if (!loop) return;

            const clickHandlers = projects.map((box, i) => {
                const handler = () => {
                    if (loop && typeof loop.toIndex === 'function') {
                        loop.toIndex(i, {duration: 0.8, ease: "power1.inOut"});
                    }
                };
                box.addEventListener("click", handler);
                return { box, handler };
            });

            return () => {
                loop?.kill?.(); 
                clickHandlers.forEach(({ box, handler }) => box.removeEventListener("click", handler));
            };
        }
    });
</script>

<section id="related">
    {#if title}
        <h3 class="md-36 md-26-mb">{title}</h3>
    {/if}
    <div class="marquee">
        <div class="track {isDynamic ? 'dynamic' : 'static'}" bind:this={track}>
            {#each displayProjects as project, i}
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

			@media screen and (max-width: 768px) {
				padding: var(--sp-l) var(--margin-mb) var(--sp-s);
			}
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
				height: 100%;
				display: flex;
				justify-content: flex-start;
				will-change: transform;

				&.static {
					width: 100%;
					padding: 0 var(--sp-m);

					@media screen and (max-width: 768px) {
						padding: 0 var(--margin-mb);
					}
				}

				.project {
					flex-shrink: 0;
					width: 18vw;
					min-width: 150px;
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