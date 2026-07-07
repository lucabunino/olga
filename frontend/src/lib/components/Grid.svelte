<script>
    import { useTask, T } from '@threlte/core';
    import { interactivity } from '@threlte/extras';interactivity();
    import { innerWidth } from 'svelte/reactivity/window';
    import GridItem from './GridItem.svelte';
    import { onMount } from 'svelte';
	import { getMenu } from '$lib/stores/menu.svelte.js';
    let menuer = getMenu();

    let { images, cursor = $bindable(), isExiting } = $props();
	let body = $state()

	// Freeze the layout on the last non-empty images list so the grid never
	// collapses (e.g. mid page-transition, when `images` briefly goes undefined).
	let lastImages = $state(images);
	$effect(() => {
		if (images?.length) lastImages = images;
	});
	let effectiveImages = $derived(images?.length ? images : lastImages);

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

    const cell = 3.5;
    let cols = $derived(Math.max(1, Math.ceil(Math.sqrt(effectiveImages?.length ?? 1))));
    let rows = $derived(cols);

    let totalSlots = $derived(cols * rows);

    let gridWidth = $derived(cols * cell);
    let gridHeight = $derived(rows * cell);

    function generateSpiral(n) {
        const coords = [{ x: 0, y: 0 }];
        const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]]; 
        let x = 0, y = 0, dirIndex = 0, steps = 1, idx = 1;

        while (idx < n) {
            for (let rep = 0; rep < 2 && idx < n; rep++) {
                const [dx, dy] = dirs[dirIndex % 4];
                for (let s = 0; s < steps && idx < n; s++) {
                    x += dx; y += dy;
                    coords.push({ x, y });
                    idx++;
                }
                dirIndex++;
            }
            steps++;
        }
        return coords;
    }

    let spiralPositions = $derived.by(() => generateSpiral(totalSlots));

    // Entry animation should stagger top-left to bottom-right, independent of spiral spatial order.
    let entryOrder = $derived.by(() => {
        const rank = new Array(spiralPositions.length);
        spiralPositions
            .map((pos, i) => ({ i, pos }))
            .sort((a, b) => (b.pos.y - a.pos.y) || (a.pos.x - b.pos.x))
            .forEach(({ i }, order) => { rank[i] = order; });
        return rank;
    });

    let currentX = $state(0);
    let currentY = $state(0);
	let y = $derived(currentY)
	let y_old = $state(0)
	let y_threshold = $state(0)
    let gridScale = $derived(innerWidth.current > 768 ? 1 : .7); 
    let isDragging = $state(false);
    let introProgress = $state(0);

    let velX = 0;
    let velY = 0;
	
	const FRICTION = $derived(innerWidth.current > 768 ? .8 : .98); 
	const DRAG_SENS = $derived(innerWidth.current > 768 ? .003 : .006); ;
	const WHEEL_SENS = 0.0008;

    let activePointers = new Map();
    let initialPinchDist = 0;
    let initialScale = 1;

    const INTRO_DELAY = .4;
    let elapsed = 0;

    useTask((delta) => {
		elapsed += delta;
		if (elapsed > INTRO_DELAY && introProgress < 2.5) introProgress += delta * 0.6;

		currentX += velX;
		currentY += velY;

		handleScroll();

		velX *= FRICTION;
		velY *= FRICTION;

		if (Math.abs(velX) < 0.0001) velX = 0;
		if (Math.abs(velY) < 0.0001) velY = 0;
	});

    // --- 3. Interaction Handlers ---
    const getDist = (p1, p2) => Math.hypot(p1.clientX - p2.clientX, p1.clientY - p2.clientY);

    const onWheel = (e) => {
		e.preventDefault();
		velX += e.deltaX * WHEEL_SENS;
		velY -= e.deltaY * WHEEL_SENS;
    };

	let lastY = $state(0);
    let upMovementAccumulator = $state(0);
    let horizontalMovementAccumulator = $state(0);
	function handleScroll() {
        const deltaY = currentY - lastY;
        const horizontalDominant = Math.abs(velX) > Math.abs(velY);

        // 1. HIDE: Down movement is unambiguous, hide immediately.
        if (deltaY < -0.001) {
            menuer.setHidden(true);
            upMovementAccumulator = 0;
            horizontalMovementAccumulator = 0;
        }
        // 2. HIDE: Horizontal-dominant movement, but only once sustained
        //    (avoids flicker from single noisy touch frames during an up-drag).
        else if (horizontalDominant) {
            horizontalMovementAccumulator += Math.abs(velX);
            upMovementAccumulator = 0;
            if (horizontalMovementAccumulator > 0.02) {
                menuer.setHidden(true);
            }
        }
        // 3. SHOW: Only on Up movement after passing the 0.02 threshold
        else if (deltaY > 0) {
            upMovementAccumulator += deltaY;
            horizontalMovementAccumulator = 0;
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

			velX = -dx * 1.5 / gridScale;
			velY = dy * 1.5 / gridScale;
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
            image={effectiveImages[i % effectiveImages?.length]}
            {i} {cell} {totalSlots}
            gridX={spiralPositions[i]?.x ?? false} gridY={spiralPositions[i]?.y ?? false}
            entryOrder={entryOrder[i]}
            {gridWidth} {gridHeight}
            {currentX} {currentY} 
            {introProgress} {isDragging}
            {gridScale}
			{isExiting}
            bind:cursor
        />
    {/each}
</T.Group>