<script>
    import { getCursor } from '$lib/stores/cursor.svelte.js';
    const cursor = getCursor();
</script>

<div class="circle">
    <div class="clone" class:visible={cursor.visible} style:transform="translate3d({cursor.x}px, {cursor.y}px, 0)"></div>
</div>

<style lang="scss">
    .circle {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: var(--yellow);
        clip-path: circle(50%);
        position: relative;
        z-index: 10000; // above the cursor follower so the clipped gray clone paints over it

        .clone {
            position: fixed;
            top: -20px;
            left: -20px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: var(--gray-light);
            pointer-events: none;
            opacity: 0;
            transition: opacity var(--transition-s);

            &.visible {
                opacity: 1;
            }

            @media (hover: none) {
                display: none;
            }
        }
    }
</style>
