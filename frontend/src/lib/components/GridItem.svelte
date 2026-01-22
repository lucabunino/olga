<script>
    import { T, useTask } from '@threlte/core';
    import { ImageMaterial } from '@threlte/extras';
    import { urlFor } from '$lib/utils/image';
    import { goto, preloadCode, preloadData } from '$app/navigation';
	import { getMenu } from '$lib/stores/menu.svelte.js';

    let { 
        image, i, cols, rows, cell, gridWidth, gridHeight, currentX, currentY, introProgress, isDragging, gridScale, cursor = $bindable() 
    } = $props();

	let projectUrl = $derived(`/portfolio/${image.project.slug.current}`)
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
    const pX = image.positionX ?? 0.5;
    const pY = image.positionY ?? 0.5;

    const offsetX = (pX - 0.5) * (cell - planeWidth);
    const offsetY = (pY - 0.5) * (cell - planeHeight);

	let baseX = $derived((i % cols - (cols - 1) / 2) * cell + offsetX);
    let baseY = $derived((Math.floor(i / cols) - (rows - 1) / 2) * -cell + offsetY);

    const wrap = (v, range) => {
        const half = range / 2;
        return ((((v + half) % range) + range) % range) - half;
    };

    useTask(() => {
        if (!mesh) return;

        const targetX = wrap(baseX - currentX, gridWidth);
        const targetY = wrap(baseY - currentY, gridHeight);

        // Intro animation
        const stagger = i * 0.01;
        const p = Math.max(0, Math.min(1, (introProgress - stagger) * 1.5));
        const posEase = 1 - Math.pow(1 - p, 3); 

        mesh.position.set(targetX * posEase, targetY * posEase, 0);

        // Scale logic
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
    <ImageMaterial 
        url={urlFor(image.cover).width(400).auto('format').url()} 
        transparent
    />
</T.Mesh>