<script>
    import { useTask, T } from '@threlte/core';
    import { interactivity } from '@threlte/extras';interactivity();
    import { innerWidth, innerHeight } from 'svelte/reactivity/window';
    import GridItem from './GridItem.svelte';
    import { onMount } from 'svelte';
	import { getMenu } from '$lib/stores/menu.svelte.js';
	import { getIntro } from '$lib/stores/intro.svelte.js';
    let menuer = getMenu();

    let { images, cursor = $bindable() } = $props();
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
    // Phase 1: the central items (the spiral slots actually visible in the viewport
    //          at rest position 0,0) pop in one after another, clustered near center.
    // Phase 2: that cluster holds still for CENTRAL_HOLD seconds.
    // Phase 3: the cluster flies out together to each item's real grid position.
    // Phase 4: the remaining items simple-fade in at their real position, starting the
    //          moment phase 3 begins (not once it finishes) so it reads as one motion.

    // Camera is fixed in +page.svelte: position z=10, fov 45 -> world-space viewport size.
    const CAM_Z = 10, CAM_FOV = 45;
    const viewH = 2 * CAM_Z * Math.tan((CAM_FOV / 2) * (Math.PI / 180));
    let viewW = $derived(viewH * ((innerWidth.current ?? 1) / (innerHeight.current ?? 1)));

    // Spiral slots whose cell overlaps the viewport at 0,0 — these form the intro cluster.
    let centralIndices = $derived.by(() => {
        const halfW = viewW / (2 * gridScale) + cell / 2;
        const halfH = viewH / (2 * gridScale) + cell / 2;
        const arr = [];
        spiralPositions.forEach((p, i) => {
            if (Math.abs(p.x * cell) <= halfW && Math.abs(p.y * cell) <= halfH) arr.push(i);
        });
        return arr;
    });
    let centralCount = $derived(centralIndices.length);
    let centralRank = $derived.by(() => {
        const m = new Map();
        centralIndices.forEach((idx, r) => m.set(idx, r));
        return m;
    });

    let choreography = $derived.by(() => {
        const c = {
            CENTRAL_TOTAL: centralCount,
            CENTRAL_APPEAR_STAGGER: .13, // seconds between each central item popping in
            CENTRAL_APPEAR_DURATION: .8, // seconds for a single central item's pop-in
            CENTRAL_HOLD: 1.8, // seconds the cluster sits still before flying out
            CENTRAL_FLYOUT_STAGGER: .01, // seconds between each item's fly-out start (tune or set to 0 for a synced burst)
            CENTRAL_FLYOUT_DURATION: 1, // seconds for the fly-out motion
            REST_FADE_STAGGER: .02, // seconds between each remaining item's fade start
            REST_FADE_DURATION: .8, // seconds for a remaining item's fade-in
        };
        c.centralPhaseEnd =
            (c.CENTRAL_TOTAL - 1) * c.CENTRAL_APPEAR_STAGGER + c.CENTRAL_APPEAR_DURATION + c.CENTRAL_HOLD;
        return c;
    });

    // Wheel/drag input stays locked until the fly-out has finished.
    let introEnd = $derived(
        choreography.centralPhaseEnd +
        (centralCount - 1) * choreography.CENTRAL_FLYOUT_STAGGER +
        choreography.CENTRAL_FLYOUT_DURATION
    );
    let inputLocked = $derived(!skipIntro && t < introEnd);

    let entryOrder = $derived.by(() => {
        const rank = new Array(spiralPositions.length);
        spiralPositions
            .map((pos, i) => ({ i, pos }))
            .filter(({ i }) => !centralRank.has(i))
            .sort((a, b) => (b.pos.y - a.pos.y) || (a.pos.x - b.pos.x))
            .forEach(({ i }, order) => { rank[i] = order; });
        return rank;
    });

    // Deterministic small jitter (not random per-frame) so the central cluster is stable across renders.
    function pseudoRandom(seed) {
        const x = Math.sin(seed * 999) * 10000;
        return x - Math.floor(x);
    }
    let clusterOffsets = $derived.by(() => {
        return Array.from({ length: centralCount }, (_, idx) => {
            const angle = pseudoRandom(idx) * Math.PI * 2;
            const radius = pseudoRandom(idx + 100) * (cell * 0.15);
            return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
        });
    });

    let currentX = $state(0);
    let currentY = $state(0);
    let gridScale = $derived(innerWidth.current > 768 ? 1 : .55);
    let isDragging = $state(false);
    let t = $state(0); // seconds since the intro choreography started (0 while still waiting)

    let velX = 0;
    let velY = 0;

	const FRICTION = $derived(innerWidth.current > 768 ? .8 : .94);
	const DRAG_SENS = $derived(innerWidth.current > 768 ? .003 : .004);
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
		if (inputLocked) return;
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
        if (inputLocked) return;
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
            centralRank={centralRank.get(i)}
            cluster={clusterOffsets[centralRank.get(i)] ?? { x: 0, y: 0 }}
            {choreography}
            {skipIntro}
            bind:cursor
        />
    {/each}
</T.Group>
