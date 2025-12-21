<script>
    import { T, useTask } from '@threlte/core';
    import { ImageMaterial } from '@threlte/extras';
    import { urlFor } from '$lib/utils/image';
    import { goto } from '$app/navigation';

    let { 
        image, i, cols, rows, cell, gridWidth, gridHeight, 
        currentX, currentY, introProgress, isDragging, cursor = $bindable() 
    } = $props();

    let mesh;
    let hovered = $state(false);
    let lerpScale = $state(0);
    
    // Assign curve properties
    const curveDirection = i % 2 === 0 ? 1 : -1;
    // const curveIntensity = 1.2 + (i % 3) * 0.4;
    const curveIntensity = 0;

    // Aspect and Sizing
    const dims = image.cover.asset.metadata.dimensions;
    const aspect = dims.width / dims.height;
    const baseSize = (image.size ?? 0.8) * cell;
    const planeWidth = aspect > 1 ? baseSize : baseSize * aspect;
    const planeHeight = aspect > 1 ? baseSize / aspect : baseSize;

    // Grid Positions
    const baseX = (i % cols - (cols - 1) / 2) * cell;
    const baseY = (Math.floor(i / cols) - (rows - 1) / 2) * -cell;

    const wrap = (v, range) => {
        const half = range / 2;
        return ((((v + half) % range) + range) % range) - half;
    };

    useTask(() => {
        if (!mesh) return;

        const targetX = wrap(baseX - currentX, gridWidth);
        const targetY = wrap(baseY - currentY, gridHeight);

        // 1. Progress with Stagger
        const stagger = i * 0.015;
        const p = Math.max(0, Math.min(1, (introProgress - stagger) * 1.5));
        
        // Use a "Back" ease for the position to give it some weight
        const posEase = 1 - Math.pow(1 - p, 3); 

        // 2. Circular Path Calculation
        const arc = Math.sin(p * Math.PI) * curveIntensity * curveDirection;
        const offsetX = -targetY * 0.15 * arc; 
        const offsetY = targetX * 0.15 * arc;

        mesh.position.set(
            (targetX * posEase) + offsetX,
            (targetY * posEase) + offsetY,
            0 
        );

        // 3. Intro Scale Pop (Starts at 0.3, ends at 1.0)
        // We want the scale to finish its intro faster than the movement (p * 2)
        const scaleProgress = Math.min(1, p * 2.5);
        const introScale = scaleProgress === 0 ? 0 : 0.3 + (0.7 * scaleProgress);
        
        // Combine with Hover Scale
        const targetHover = hovered ? 1.2 : 1.0;
        const finalTargetScale = introScale * targetHover;
        
        lerpScale += (finalTargetScale - lerpScale) * 0.15;
        mesh.scale.set(lerpScale, lerpScale, 1);

        mesh.visible = lerpScale > 0.01;
    });
</script>

<T.Mesh
    bind:ref={mesh}
    onclick={() => !isDragging && introProgress > 1.2 && goto(`/portfolio/${image.project.slug.current}`)}
    onpointerenter={() => { if (introProgress > 1.2) { hovered = true; cursor = 'pointer'; } }}
    onpointerleave={() => { hovered = false; cursor = ''; }}
>
    <T.PlaneGeometry args={[planeWidth, planeHeight]} />
    <ImageMaterial 
        url={urlFor(image.cover).width(1000).auto('format').url()} 
        transparent
    />
</T.Mesh>