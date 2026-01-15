<script>
    import { T, useTask } from '@threlte/core';
    import { ImageMaterial } from '@threlte/extras';
    import { urlFor } from '$lib/utils/image';
    import { goto } from '$app/navigation';

    let { 
        image, i, cols, rows, cell, gridWidth, gridHeight, currentX, currentY, introProgress, isDragging, gridScale, cursor = $bindable() 
    } = $props();

    let mesh;
    let hovered = $state(false);
    let lerpScale = $state(0);
    
    // Sizing
    const dims = image.cover.asset.metadata.dimensions;
    const aspect = dims.width / dims.height;
    const baseSize = (image.size ?? 0.8) * cell;
    const planeWidth = aspect > 1 ? baseSize : baseSize * aspect;
    const planeHeight = aspect > 1 ? baseSize / aspect : baseSize;

    // --- POSITIONING LOGIC ---
    // Extract positions from backend, defaulting to 0.5 (center)
    const pX = image.positionX ?? 0.5;
    const pY = image.positionY ?? 0.5;

    // Calculate offset within the cell
    // (pX - 0.5) converts 0->1 range to -0.5->0.5 range
    // Multiplying by (cell - planeWidth) ensures the image stays within the cell bounds
    const offsetX = (pX - 0.5) * (cell - planeWidth);
    const offsetY = (pY - 0.5) * (cell - planeHeight);

    // Stable Grid Positions + Offset
    // const baseX = (i % cols - (cols - 1) / 2) * cell + offsetX;
    // // Note: Y is inverted in 3D space, but since 1 is Top in your backend, 
    // // we add the offsetY to move it "up"
    // const baseY = (Math.floor(i / cols) - (rows - 1) / 2) * -cell + offsetY;
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
        const targetHover = hovered ? 1.2 : 1.0;
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
    onclick={() => !isDragging && introProgress > 1.2 && image.project?.slug && goto(`/portfolio/${image.project.slug.current}`)}
    onpointerenter={() => { if (introProgress > 1.2) { hovered = true; cursor = 'pointer'; } }}
    onpointerleave={() => { hovered = false; cursor = ''; }}
>
    <T.PlaneGeometry args={[planeWidth, planeHeight]} />
    <ImageMaterial 
        url={urlFor(image.cover).width(800).auto('format').url()} 
        transparent
    />
</T.Mesh>