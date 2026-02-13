<script>
    import ProjectCover from "./ProjectCover.svelte";
    import { browser } from "$app/environment";
    import { gsap } from "gsap";
    import { Draggable } from "gsap/dist/Draggable";
    import { InertiaPlugin } from "gsap/dist/InertiaPlugin";
    import { horizontalLoop } from "$lib/utils/gsap";
    import { innerWidth } from "svelte/reactivity/window";

    if (browser) {
        gsap.registerPlugin(Draggable, InertiaPlugin);
    }

    let { related, title } = $props();
    let track = $state(undefined);

    // Determines if we have enough items to warrant a marquee effect
    let isDynamic = $derived.by(() => {
        if (!related?.length || !innerWidth.current) return false;
        if (innerWidth.current < 640) return related.length >= 3;
        if (innerWidth.current < 1024) return related.length >= 4;
        return related.length >= 5;
    });

    // We only duplicate items if the marquee is active
    let displayProjects = $derived.by(() => {
        if (!related?.length) return [];
        if (!isDynamic) return related;
       
        const multiplier = related.length < 6 ? 3 : 2;
        return Array.from({ length: multiplier }, () => related).flat();
    });

    $effect(() => {
        // If we are in static mode, ensure GSAP doesn't hold onto transforms
        if (!isDynamic || !track) {
            if (track) gsap.set(".project", { clearProps: "all" });
            return;
        }

        const projects = gsap.utils.toArray(".project");
        if (projects.length === 0) return;

        let activeElement;

        // Initialize the loop
        const loop = horizontalLoop(projects, {
            paused: false, 
            draggable: true,
            center: false,
            speed: 0.5,
            wheel: true,
            wheelSpeed: 1.2,
            onChange: (element, index) => {
                activeElement?.classList.remove("active");
                element.classList.add("active");
                activeElement = element;
            }
        });

        // Handle clicks for centered navigation
        const clickHandlers = projects.map((box, i) => {
            const handler = () => {
                if (loop?.toIndex) {
                    loop.toIndex(i, { duration: 0.8, ease: "power1.inOut" });
                }
            };
            box.addEventListener("click", handler);
            return { box, handler };
        });

        // CLEANUP: This runs whenever the effect re-triggers (on resize or data change)
        return () => {
            if (loop) loop.kill();
            gsap.set(".project", { clearProps: "all" }); // Reset positions for static layout
            clickHandlers.forEach(({ box, handler }) => box.removeEventListener("click", handler));
        };
    });
</script>

<section id="related">
    {#if title}
        <h3 class="md-36 md-26-mb">{title}</h3>
    {/if}
    
    <div class="marquee" class:is-static={!isDynamic}>
        <div 
            class="track {isDynamic ? 'dynamic' : 'static'}" 
            bind:this={track}
        >
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
            position: relative;
            display: flex;
            align-items: center;
            overflow: hidden;
            /* Adaptive height based on project aspect ratio */
            height: clamp(300px, 40vh, 600px); 
            cursor: grab;

            &:active { cursor: grabbing; }

            /* Remove marquee behaviors when static */
            &.is-static {
                cursor: default;
                overflow-x: auto;
                height: auto;
                
                .track {
                    position: relative;
                    padding: 0 var(--sp-m);
                    @media screen and (max-width: 768px) {
                        padding: 0 var(--margin-mb);
                    }
                }
            }

            .track {
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                display: flex;
                will-change: transform;

                .project {
                    flex-shrink: 0;
                    width: 18vw;
                    min-width: 180px;
                    max-width: 400px;
                    padding-right: var(--gutter);
                    transition: opacity 0.3s ease;
                }
            }
        }
    }
</style>