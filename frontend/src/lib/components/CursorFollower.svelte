<script>
    import { Tween } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';

    let visible = $state(false);

    const pos = new Tween({ x: 0, y: 0 }, { duration: 2000, easing: cubicOut });

    function move(e) {
        visible = true;
        pos.set({ x: e.clientX, y: e.clientY });
    }
</script>

<svelte:window onmousemove={move} />

<div class="cursor" class:visible style:transform="translate3d({pos.current.x}px, {pos.current.y}px, 0)"></div>

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
