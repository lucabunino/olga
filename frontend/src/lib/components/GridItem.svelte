<script>
    import { T, useTask } from '@threlte/core';
	import { TextureLoader } from 'three';
    import { ImageMaterial, useTexture } from '@threlte/extras';
    import { urlFor } from '$lib/utils/image';
    import { goto, preloadCode, preloadData } from '$app/navigation';
	import { getMenu } from '$lib/stores/menu.svelte.js';

    let {
        image, i, gridX, gridY, entryOrder, cell, gridWidth, gridHeight, totalSlots, currentX, currentY, introProgress, isDragging, gridScale, cursor = $bindable(), isExiting
    } = $props();

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
    let hovered = $state(false);
    let lerpScale = $state(0);
    
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

	let exitProgress = $state(0);
    useTask(() => {
        if (!mesh) return;

        if (introProgress <= 0) {
            mesh.visible = false;
            return;
        }

        const targetX = wrap(baseX - currentX, gridWidth);
        const targetY = wrap(baseY - currentY, gridHeight);

        // 1. Intro progress
        const stagger = entryOrder * 0.02;
        const p = Math.max(0, Math.min(1, (introProgress - stagger) * 1.8));
        const posEase = 1 - Math.pow(1 - p, 2); 

        // 2. Reverse Z-Depth
        const zDepth = (totalSlots - entryOrder) * 0.01 * (1 - posEase);

        // 3. Posizionamento (radiates out from the bottom-center edge of the screen, not the center)
        // Original: mesh.position.set(targetX * posEase, targetY * posEase, zDepth);
        const CAMERA_DISTANCE = 10;
        const CAMERA_FOV_DEG = 45;
        const viewportHalfHeight = CAMERA_DISTANCE * Math.tan((CAMERA_FOV_DEG / 2) * Math.PI / 180);
        const ENTRY_FROM_Y = -viewportHalfHeight / gridScale;
        // mesh.position.set(targetX * posEase, ENTRY_FROM_Y + (targetY - ENTRY_FROM_Y) * posEase, zDepth);
		 mesh.position.set(targetX * posEase, targetY * posEase, zDepth);

        // 4. Rotazione
        const targetHover = hovered ? 1.1 : 1.0;
        const finalTargetScale = (0.3 + 0.7 * p) * targetHover;
        lerpScale += (finalTargetScale - lerpScale) * 0.15;
        mesh.scale.set(lerpScale, lerpScale, 1);

        // Visibility Buffer
        const threshold = 24 / Math.min(1, gridScale); 
        mesh.visible = lerpScale > 0.01 && 
                       Math.abs(targetX) < threshold && 
                       Math.abs(targetY) < threshold;
    });
</script>

<T.Mesh
    bind:ref={mesh}
    onclick={() => {
		if (!isDragging && introProgress > 1.2 && image.project?.slug) {
			goto(projectUrl);
			setTimeout(() => {
				menuer.setHidden(false)
			}, 400);
		}
	}
	}
    onpointerenter={() => {
		preloadCode(projectUrl);
        preloadData(projectUrl);
		if (introProgress > 1.2) {
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
				const material = e.ref;

				if (material && !mainTexture.image) {
					material.map = placeholderTexture;
					mainTexture.onUpdate = () => {
						material.map = mainTexture;
						material.needsUpdate = true;
					};
				}
			}}
		/>
</T.Mesh>