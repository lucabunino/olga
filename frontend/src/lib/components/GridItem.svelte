<script>
    import { T, useTask } from '@threlte/core';
	import { TextureLoader } from 'three';
    import { ImageMaterial, useTexture } from '@threlte/extras';
    import { urlFor } from '$lib/utils/image';
    import { goto, preloadCode, preloadData } from '$app/navigation';
	import { getMenu } from '$lib/stores/menu.svelte.js';

    let {
        image, i, gridX, gridY, entryOrder, cell, gridWidth, gridHeight, totalSlots,
        currentX, currentY, t, isDragging, gridScale, cursor = $bindable(),
        centralRank, cluster, choreography, skipIntro
    } = $props();

    const {
        CENTRAL_TOTAL, CENTRAL_APPEAR_STAGGER, CENTRAL_APPEAR_DURATION,
        CENTRAL_HOLD, CENTRAL_FLYOUT_STAGGER, CENTRAL_FLYOUT_DURATION,
        centralPhaseEnd, REST_FADE_STAGGER, REST_FADE_DURATION
    } = choreography;

    const isCentral = centralRank !== undefined;

	const loader = new TextureLoader();
	const lqipUrl = image.cover.asset.metadata.lqip;
    const mainUrl = urlFor(image.cover).width(600).quality(60).auto('format').url();
	const placeholderTexture = loader.load(lqipUrl);
    const mainTexture = loader.load(mainUrl, (tex) => {
		tex.colorSpace = 'srgb';
	});
	mainTexture.matrixAutoUpdate = false;

	let projectUrl = $derived(`/works/${image.project.slug.current}`)
	let menuer = getMenu();
    let mesh;
    let material;
    let hovered = $state(false);
    let lerpScale = $state(0.5);
    let settled = $state(false);

    // Sizing
    const dims = image.cover.asset.metadata.dimensions;
    const aspect = dims.width / dims.height;
    const baseSize = (image.size ?? 0.7) * cell;
    const planeWidth = aspect > 1 ? baseSize : baseSize * aspect;
    const planeHeight = aspect > 1 ? baseSize / aspect : baseSize;

	// Positioning
    const pX = image.positionX ?? Math.random();
    const pY = image.positionY ?? Math.random();

    const offsetX = (pX - 0.5) * (cell - planeWidth);
    const offsetY = (pY - 0.5) * (cell - planeHeight);

	let lastGridX = $state(gridX === false ? 0 : gridX);
    let lastGridY = $state(gridY === false ? 0 : gridY);
    $effect(() => {
        if (gridX !== false) lastGridX = gridX;
        if (gridY !== false) lastGridY = gridY;
    });

	let baseX = $derived((gridX !== false ? gridX : lastGridX) * cell + offsetX);
    let baseY = $derived((gridY !== false ? gridY : lastGridY) * cell + offsetY);

    const wrap = (v, range) => {
        const half = range / 2;
        return ((((v + half) % range) + range) % range) - half;
    };

    // A central item's own fly-out start time within the shared timeline.
    // Reversed: the last item to appear (highest rank) is the first to fly to its position.
    const flyStart = (CENTRAL_TOTAL - 1) * CENTRAL_APPEAR_STAGGER + CENTRAL_APPEAR_DURATION
        + CENTRAL_HOLD + (CENTRAL_TOTAL - 1 - (centralRank ?? 0)) * CENTRAL_FLYOUT_STAGGER;

    useTask(() => {
        if (!mesh) return;

        const targetX = wrap(baseX - currentX, gridWidth);
        const targetY = wrap(baseY - currentY, gridHeight);
        const targetHover = hovered ? 1.1 : 1.0;

        let posX, posY, zDepth, revealEase;

        if (skipIntro) {
            // Already played this session (e.g. re-navigating back to the homepage):
            // skip the choreography, but every item still simple-fades in at its final position,
            // staggered 0 -> n by index.
            const fadeStart = i * REST_FADE_STAGGER;
            const fadeP = Math.max(0, Math.min(1, (t - fadeStart) / REST_FADE_DURATION));

            posX = targetX;
            posY = targetY;
            zDepth = 0;
            revealEase = 1 - Math.pow(1 - fadeP, 6);
            settled = fadeP >= 1;
        } else if (t <= 0) {
            mesh.visible = false;
            return;
        } else if (isCentral) {
            // Phase 1: pop in, staggered, at a jittered spot near center.
            const appearStart = centralRank * CENTRAL_APPEAR_STAGGER;
            const appearP = Math.max(0, Math.min(1, (t - appearStart) / CENTRAL_APPEAR_DURATION));
            const appearEase = 1 - Math.pow(1 - appearP, 6);

            // Phase 2 (hold) + Phase 3: fly out together to the real grid position.
            const flyP = Math.max(0, Math.min(1, (t - flyStart) / CENTRAL_FLYOUT_DURATION));
            const flyEase = flyP < 0.5
                ? 4 * flyP * flyP * flyP
                : 1 - Math.pow(-2 * flyP + 2, 3) / 2;

            posX = cluster.x + (targetX - cluster.x) * flyEase;
            posY = cluster.y + (targetY - cluster.y) * flyEase;
            zDepth = centralRank * 0.01 * (1 - flyEase);
            revealEase = appearEase;
            settled = flyP >= 1;
        } else {
            // Phase 4: fade-in at the real position, once the central phase is done.
            const restStart = centralPhaseEnd + entryOrder * REST_FADE_STAGGER;
            const restP = Math.max(0, Math.min(1, (t - restStart) / REST_FADE_DURATION));

            posX = targetX;
            posY = targetY;
            zDepth = 0;
            revealEase = 1 - Math.pow(1 - restP, 3);
            settled = restP >= 1;
        }

        mesh.position.set(posX, posY, zDepth);

        // Every item reveals the same way: scale 0.5 -> 1 (x hover) together with opacity 0 -> 1.
        const finalTargetScale = (0.9 + 0.1 * revealEase) * targetHover;
        lerpScale += (finalTargetScale - lerpScale) * 0.15;
        mesh.scale.set(lerpScale, lerpScale, 1);

        if (mesh.material) {
            mesh.material.transparent = true;
            mesh.material.opacity = revealEase;
        }

        // Visibility Buffer (wrap-around culling for off-screen tiled copies)
        const threshold = 24 / Math.min(1, gridScale);
        mesh.visible = lerpScale > 0.01 &&
                       Math.abs(targetX) < threshold &&
                       Math.abs(targetY) < threshold;
    });
</script>

<T.Mesh
    bind:ref={mesh}
    onclick={() => {
		if (!isDragging && settled && image.project?.slug) {
			goto(projectUrl);
			setTimeout(() => {
				menuer.setHidden(false)
			}, 600);
		}
	}
	}
    onpointerenter={() => {
		preloadCode(projectUrl);
        preloadData(projectUrl);
		if (settled) {
			hovered = true;
			cursor = 'pointer';
		}
	}}
    onpointerleave={() => {
		hovered = false;
		cursor = '';
	}}
>
    <T.PlaneGeometry args={[planeWidth, planeHeight]} />
		<T.MeshBasicMaterial
			map={mainTexture}
			transparent
			toneMapped={false}
			oncreate={(e) => {
				material = e.ref;
				if (!material) return;
				material.opacity = 0;

				if (!mainTexture.image) {
					material.map = placeholderTexture;
					mainTexture.onUpdate = () => {
						material.map = mainTexture;
						material.needsUpdate = true;
					};
				}
			}}
		/>
</T.Mesh>
