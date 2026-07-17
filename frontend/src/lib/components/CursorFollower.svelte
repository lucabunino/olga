<script>
    import { getCursor } from '$lib/stores/cursor.svelte.js';
    const cursor = getCursor();

    function move(e) {
        cursor.move(e.clientX, e.clientY);
    }
</script>

<svelte:window onmousemove={move} />

<div class="cursor" class:visible={cursor.visible} style:transform="translate3d({cursor.x}px, {cursor.y}px, 0)"></div>

<style lang="scss">
    .cursor {
        position: fixed;
        top: -20px;
        left: -20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: var(--yellow);
        pointer-events: none;
        z-index: 9999;
        opacity: 0;
        transition: opacity var(--transition-s);

        &.visible {
            opacity: 1;
        }

        @media (hover: none) {
            display: none;
        }
    }
</style>
