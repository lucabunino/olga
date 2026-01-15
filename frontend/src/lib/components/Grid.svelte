<script>
    import { useTask, T } from '@threlte/core';
    import { interactivity } from '@threlte/extras';interactivity();
    import { innerWidth } from 'svelte/reactivity/window';
    import GridItem from './GridItem.svelte';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
	import { getMenu } from '$lib/stores/menu.svelte.js';
    let menuer = getMenu();

    let { images, cursor = $bindable() } = $props();
	let body = $state()

	$effect(() => {
		body
		if (cols || rows) {
			currentX = 0;
			currentY = 0;
			velX = 0;
			velY = 0;
		}
	});

	onMount(() => {
		body.style.touchAction = 'none';
		body.style.overflow = 'hidden';

		return(() => {
			body.style.touchAction = '';
			body.style.overflow = '';
		})
	})

	

    // --- 1. Fixed Grid with Buffer ---
    // We add +2 or +4 to the base columns to create the overscan buffer
    const cell = 3.5;
    let cols = $derived((innerWidth.current < 768 ? 3 : innerWidth.current < 1440 ? 5 : 7) + 4);
    
    // Ensure we always have a full rectangle
    let totalSlots = $derived(Math.ceil(images.length / cols) * cols);
    let rows = $derived(totalSlots / cols);
    
    let gridWidth = $derived(cols * cell);
    let gridHeight = $derived(rows * cell);

    // --- 2. State & Physics ---
    let currentX = $state(0);
    let currentY = $state(0);
	let y = $derived(currentY)
	let y_old = $state(0)
	let y_threshold = $state(0)
    let gridScale = $state(1); 
    let isDragging = $state(false);
    let introProgress = $state(0);

    let velX = 0;
    let velY = 0;
    const FRICTION = 0.94;
    const DRAG_SENS = 0.012;

    let activePointers = new Map();
    let initialPinchDist = 0;
    let initialScale = 1;

    useTask((delta) => {
        if (introProgress < 2.5) introProgress += delta * 0.6;
        
        currentX += velX;
        currentY += velY;

        handleScroll();

        if (!isDragging) {
            velX *= FRICTION;
            velY *= FRICTION;
        } else {
            velX *= 0.5;
            velY *= 0.5;
        }
    });

    // --- 3. Interaction Handlers ---
    const getDist = (p1, p2) => Math.hypot(p1.clientX - p2.clientX, p1.clientY - p2.clientY);

    const onWheel = (e) => {
		e.preventDefault();
		velX += e.deltaX * 0.001;
		velY -= e.deltaY * 0.001;
    };

	let lastY = $state(0);
    let upMovementAccumulator = $state(0);
	function handleScroll() {
        const deltaY = currentY - lastY;
        const isMovingHorizontally = Math.abs(velX) > 0.005;

        // 1. HIDE: On Down movement OR Horizontal movement
        if (deltaY < -0.001 || isMovingHorizontally) {
            menuer.setHidden(true);
            upMovementAccumulator = 0; // Reset the progress toward showing
        } 
        // 2. SHOW: Only on Up movement after passing the 0.02 threshold
        else if (deltaY > 0) {
            upMovementAccumulator += deltaY;
            if (upMovementAccumulator > 0.02) {
                menuer.setHidden(false);
            }
        }

        lastY = currentY;
    }

    const handlePointerDown = (e) => {
        if (e.target.setPointerCapture) e.target.setPointerCapture(e.pointerId);
        activePointers.set(e.pointerId, e);
        isDragging = true;
        velX = 0;
        velY = 0;

        if (activePointers.size === 2) {
            const [p1, p2] = Array.from(activePointers.values());
            initialPinchDist = getDist(p1, p2);
            initialScale = gridScale;
        }
    };

    const onPointerMove = (e) => {
        if (!isDragging) return;
        activePointers.set(e.pointerId, e);

        if (activePointers.size === 2) {
            const [p1, p2] = Array.from(activePointers.values());
            const currentDist = getDist(p1, p2);
            gridScale = Math.max(0.4, Math.min(2.5, initialScale * (currentDist / initialPinchDist)));
        } else if (activePointers.size === 1) {
            const dx = e.movementX * DRAG_SENS;
            const dy = e.movementY * DRAG_SENS;
            currentX -= dx / gridScale;
            currentY += dy / gridScale;
            velX = -dx / gridScale;
            velY = dy / gridScale;
        }
    };

    const handlePointerUp = (e) => {
        activePointers.delete(e.pointerId);
        if (activePointers.size === 0) isDragging = false;
    };

	function setupGlobalEvents(node) {
		window.addEventListener('wheel', onWheel, { passive: false });

		return {
			destroy() {
				window.removeEventListener('wheel', onWheel);
			}
		};
	}
</script>

<svelte:window 
    onpointermove={onPointerMove}
    onpointerdown={handlePointerDown}
    onpointerup={handlePointerUp}
    onpointercancel={handlePointerUp}
/>

<svelte:body bind:this={body} use:setupGlobalEvents></svelte:body>

<T.Group scale={gridScale}>
    {#each { length: totalSlots } as _, i (i)}
        <GridItem 
            image={images[i % images.length]} 
            {i} {cols} {rows} {cell}
            {gridWidth} {gridHeight}
            {currentX} {currentY} 
            {introProgress} {isDragging}
            {gridScale}
            bind:cursor
        />
    {/each}
</T.Group>