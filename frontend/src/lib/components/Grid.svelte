<script>
    import { useTask } from '@threlte/core';
    import { interactivity } from '@threlte/extras';
    import { innerWidth } from 'svelte/reactivity/window';
    import GridItem from './GridItem.svelte';

    interactivity();
    let { images, cursor = $bindable() } = $props();

    // --- Grid Logic ---
    let cols = $derived(innerWidth.current < 768 ? 3 : innerWidth.current < 1440 ? 5 : 7);
    const cell = 3.5;
    const wheelFactor = 0.001;
    let totalSlots = $derived(Math.ceil(images.length / cols) * cols);
    let rows = $derived(totalSlots / cols);
    
    let gridWidth = $derived(cols * cell);
    let gridHeight = $derived(rows * cell);

    // --- State & Physics ---
    let currentX = $state(0);
    let currentY = $state(0);
    let velX = 0;
    let velY = 0;
    let isDragging = $state(false);
    let introProgress = $state(0);

    const FRICTION = 0.94;
    // Mobile fingers usually need slightly higher sensitivity than a mouse
    const DRAG_SENS = 0.008;

    useTask((delta) => {
        if (introProgress < 2.5) introProgress += delta * 0.6;

        currentX += velX;
        currentY += velY;

        if (!isDragging) {
            velX *= FRICTION;
            velY *= FRICTION;
        } else {
            // Lower damping during active drag for a "stuck to finger" feel
            velX *= 0.4;
            velY *= 0.4;
        }
    });

    const onWheel = (e) => {
        // Prevent page scroll while interacting with grid
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) e.preventDefault();
        velX += e.deltaX * wheelFactor;
        velY -= e.deltaY * wheelFactor;
    };

    const onPointerMove = (e) => {
        if (!isDragging) return;
        
        // movementX/Y works for both mouse and touch pointers
        const dx = e.movementX * DRAG_SENS;
        const dy = e.movementY * DRAG_SENS;
        
        currentX -= dx;
        currentY += dy;
        
        // Update velocity for the momentum "flick"
        velX = -dx;
        velY = dy;
    };

    const handlePointerDown = (e) => {
        isDragging = true;
        // Optional: stop momentum instantly when touching
        velX = 0;
        velY = 0;
    };
</script>

<svelte:window 
    onwheel|nonpassive={onWheel}
    onpointermove={onPointerMove}
    onpointerdown={handlePointerDown}
    onpointerup={() => (isDragging = false)}
    onpointercancel={() => (isDragging = false)}
/>

<style>
    :global(body) {
        touch-action: none;
        overflow: hidden;
    }
</style>

{#each { length: totalSlots } as _, i (i)}
    <GridItem 
        image={images[i % images.length]} 
        {i} {cols} {rows} {cell}
        {gridWidth} {gridHeight}
        {currentX} {currentY} 
        {introProgress} {isDragging}
        bind:cursor
    />
{/each}