<script>
    import { T, useTask } from '@threlte/core';
	import { TextureLoader } from 'three';
    import { ImageMaterial, useTexture } from '@threlte/extras';
    import { urlFor } from '$lib/utils/image';
    import { goto, preloadCode, preloadData } from '$app/navigation';
	import { getMenu } from '$lib/stores/menu.svelte.js';
	import { untrack } from 'svelte';

    let {
        image, i, gridX, gridY, entryOrder, cell, gridWidth, gridHeight, totalSlots,
        currentX, currentY, t, isDragging, gridScale, cursor = $bindable(),
        centralRank, cluster, choreography, skipIntro
    } = $props();

    // Each grid item is created once per slot and keeps its creation-time values
    // (position/rank/image never reflow live) — untrack marks these one-time
    // reads as intentional so Svelte doesn't warn they "should" be reactive.
    const { image: image0, cell: cell0, centralRank: centralRank0, choreography: choreography0 } =
        untrack(() => ({ image, cell, centralRank, choreography }));

    const {
        CENTRAL_TOTAL, CENTRAL_APPEAR_STAGGER, CENTRAL_APPEAR_DURATION,
        CENTRAL_HOLD, CENTRAL_FLYOUT_STAGGER, CENTRAL_FLYOUT_DURATION,
        centralPhaseEnd, REST_FADE_STAGGER, REST_FADE_DURATION
    } = choreography0;

    const isCentral = centralRank0 !== undefined;

	const loader = new TextureLoader();
	const lqipUrl = image0.cover.asset.metadata.lqip;
    const mainUrl = urlFor(image0.cover).width(600).quality(60).auto('format').url();
	const placeholderTexture = loader.load(lqipUrl);
    const mainTexture = loader.load(mainUrl, (tex) => {
		tex.colorSpace = 'srgb';
	});
	mainTexture.matrixAutoUpdate = false;

	let projectUrl = $derived(`/works/${image.project.slug.current}`)
	let menuer = getMenu();
    let mesh = $state();
    let material;
    let hovered = $state(false);
    let lerpScale = $state(0.5);
    let settled = $state(false);

    const dims = image0.cover.asset.metadata.dimensions;
    const aspect = dims.width / dims.height;
    const baseSize = (image0.size ?? 0.7) * cell0;
    const planeWidth = aspect > 1 ? baseSize : baseSize * aspect;
    const planeHeight = aspect > 1 ? baseSize / aspect : baseSize;

    const pX = image0.positionX ?? Math.random();
    const pY = image0.positionY ?? Math.random();

    const offsetX = (pX - 0.5) * (cell0 - planeWidth);
    const offsetY = (pY - 0.5) * (cell0 - planeHeight);

	let lastGridX = $state(untrack(() => gridX === false ? 0 : gridX));
    let lastGridY = $state(untrack(() => gridY === false ? 0 : gridY));
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

    const flyStart = (CENTRAL_TOTAL - 1) * CENTRAL_APPEAR_STAGGER + CENTRAL_APPEAR_DURATION
        + CENTRAL_HOLD + (CENTRAL_TOTAL - 1 - (centralRank0 ?? 0)) * CENTRAL_FLYOUT_STAGGER;

    const DRIFT_AMP = cell0 * 0.03; // world units of wander around the cluster spot
    const DRIFT_SPEED = 0.45; // radians per second
    const driftSeed = (centralRank0 ?? 0) + 1;
    const driftPhaseX = Math.sin(driftSeed * 127.1) * Math.PI * 2;
    const driftPhaseY = Math.sin(driftSeed * 311.7) * Math.PI * 2;

    useTask(() => {
        if (!mesh) return;

        const targetX = wrap(baseX - currentX, gridWidth);
        const targetY = wrap(baseY - currentY, gridHeight);
        const targetHover = hovered ? 1.1 : 1.0;

        let posX, posY, zDepth, revealEase;

        if (skipIntro) {
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
            const appearStart = centralRank * CENTRAL_APPEAR_STAGGER;
            const appearP = Math.max(0, Math.min(1, (t - appearStart) / CENTRAL_APPEAR_DURATION));
            const appearEase = 1 - Math.pow(1 - appearP, 6);

            const flyP = Math.max(0, Math.min(1, (t - flyStart) / CENTRAL_FLYOUT_DURATION));
            const flyEase = flyP < 0.5
                ? 4 * flyP * flyP * flyP
                : 1 - Math.pow(-2 * flyP + 2, 3) / 2;

            const driftFade = appearEase * (1 - flyEase);
            const driftX = Math.sin(t * DRIFT_SPEED + driftPhaseX) * DRIFT_AMP * driftFade;
            const driftY = Math.cos(t * DRIFT_SPEED * 1.3 + driftPhaseY) * DRIFT_AMP * driftFade;

            posX = cluster.x + (targetX - cluster.x) * flyEase + driftX;
            posY = cluster.y + (targetY - cluster.y) * flyEase + driftY;
            zDepth = centralRank * 0.01 * (1 - flyEase);
            revealEase = appearEase;
            settled = flyP >= 1;
        } else {
            const restStart = centralPhaseEnd + (entryOrder ?? 0) * REST_FADE_STAGGER;
            const restP = Math.max(0, Math.min(1, (t - restStart) / REST_FADE_DURATION));

            posX = targetX;
            posY = targetY;
            zDepth = 0;
            revealEase = 1 - Math.pow(1 - restP, 3);
            settled = restP >= 1;
        }

        mesh.position.set(posX, posY, zDepth);

        const finalTargetScale = (0.9 + 0.1 * revealEase) * targetHover;
        lerpScale += (finalTargetScale - lerpScale) * 0.15;
        mesh.scale.set(lerpScale, lerpScale, 1);

        if (mesh.material) {
            mesh.material.transparent = true;
            mesh.material.opacity = revealEase;
        }

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
