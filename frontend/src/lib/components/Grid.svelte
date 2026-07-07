<script>
    import { useTask, T } from '@threlte/core';
    import { interactivity } from '@threlte/extras';interactivity();
    import { innerWidth } from 'svelte/reactivity/window';
    import GridItem from './GridItem.svelte';
    import { onMount } from 'svelte';
	import { getMenu } from '$lib/stores/menu.svelte.js';
	import { getIntro } from '$lib/stores/intro.svelte.js';
    let menuer = getMenu();

    let { images, cursor = $bindable(), isExiting } = $props();
	let body = $state()

	// The intro choreography (central cluster pop/hold/fly-out + rest fade-in) should only
	// play once per session, the first time the homepage loads — not on every SPA re-navigation.
	let intro = getIntro();
	const skipIntro = intro.played;
	if (!skipIntro) intro.markPlayed();

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

    // --- Intro choreography ---
    // Phase 1: the CENTRAL_COUNT most central items (spiral index 0..N-1) pop in,
    //          one after another, clustered in a tight jittered spread near center.
    // Phase 2: that cluster holds still for CENTRAL_HOLD seconds.
    // Phase 3: the cluster flies out together to each item's real grid position.
    // Phase 4: only then do the remaining items simple-fade in at their real position.
    const CENTRAL_COUNT = 25;
    let entryOrder = $derived.by(() => {
        const rank = new Array(spiralPositions.length);
        spiralPositions
            .map((pos, i) => ({ i, pos }))
            .filter(({ i }) => i >= CENTRAL_COUNT)
            .sort((a, b) => (b.pos.y - a.pos.y) || (a.pos.x - b.pos.x))
            .forEach(({ i }, order) => { rank[i] = order; });
        return rank;
    });
    const CENTRAL_APPEAR_STAGGER = .1; // seconds between each central item popping in
    const CENTRAL_APPEAR_DURATION = .3; // seconds for a single central item's pop-in
    const CENTRAL_HOLD = 1; // seconds the cluster sits still before flying out
    const CENTRAL_FLYOUT_STAGGER = .01; // seconds between each item's fly-out start (tune or set to 0 for a synced burst)
    const CENTRAL_FLYOUT_DURATION = 1.5; // seconds for the fly-out motion
    const REST_FADE_STAGGER = .01; // seconds between each remaining item's fade start
    const REST_FADE_DURATION = .3; // seconds for a remaining item's fade-in

    // Rest items should start fading in the moment the central cluster starts flying out
    // (not once it's finished) so the whole thing reads as one continuous motion.
    const centralPhaseEnd =
        (CENTRAL_COUNT - 1) * CENTRAL_APPEAR_STAGGER + CENTRAL_APPEAR_DURATION +
        CENTRAL_HOLD;

    // Deterministic small jitter (not random per-frame) so the central cluster is stable across renders.
    function pseudoRandom(seed) {
        const x = Math.sin(seed * 999) * 10000;
        return x - Math.floor(x);
    }
    let clusterOffsets = $derived.by(() => {
        return Array.from({ length: CENTRAL_COUNT }, (_, idx) => {
            const angle = pseudoRandom(idx) * Math.PI * 2;
            const radius = pseudoRandom(idx + 100) * (cell * 0.15);
            return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
        });
    });

    let currentX = $state(0);
    let currentY = $state(0);
	let y = $derived(currentY)
	let y_old = $state(0)
	let y_threshold = $state(0)
    let gridScale = $derived(innerWidth.current > 768 ? 1 : .55); 
    let isDragging = $state(false);
    let t = $state(0); // seconds since the intro choreography started (0 while still waiting)

    let velX = 0;
    let velY = 0;
	
	const FRICTION = $derived(innerWidth.current > 768 ? .8 : .98); 
	const DRAG_SENS = $derived(innerWidth.current > 768 ? .003 : .006); ;
	const WHEEL_SENS = 0.0008;

    let activePointers = new Map();
    let initialPinchDist = 0;
    let initialScale = 1;

    const INTRO_DELAY = .4; // seconds before the intro choreography begins
    let elapsed = 0;

    useTask((delta) => {
		elapsed += delta;
		if (elapsed > INTRO_DELAY) t = elapsed - INTRO_DELAY;

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
            {t} {isDragging}
            {gridScale}
			{isExiting}
            isCentral={i < CENTRAL_COUNT}
            clusterX={clusterOffsets[i]?.x ?? 0} clusterY={clusterOffsets[i]?.y ?? 0}
            {CENTRAL_COUNT} {CENTRAL_APPEAR_STAGGER} {CENTRAL_APPEAR_DURATION}
            {CENTRAL_HOLD} {CENTRAL_FLYOUT_STAGGER} {CENTRAL_FLYOUT_DURATION}
            {centralPhaseEnd} {REST_FADE_STAGGER} {REST_FADE_DURATION}
            {skipIntro}
            bind:cursor
        />
    {/each}
</T.Group>