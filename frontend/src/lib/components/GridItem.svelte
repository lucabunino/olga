<script>
    import { T, useTask } from '@threlte/core';
	import { TextureLoader } from 'three';
    import { ImageMaterial, useTexture } from '@threlte/extras';
    import { urlFor } from '$lib/utils/image';
    import { goto, preloadCode, preloadData } from '$app/navigation';
	import { getMenu } from '$lib/stores/menu.svelte.js';

    let { 
        image, i, cols, rows, cell, gridWidth, gridHeight, currentX, currentY, introProgress, isDragging, gridScale, cursor = $bindable() 
    } = $props();

	const loader = new TextureLoader();
	const lqipUrl = image.cover.asset.metadata.lqip;
    const mainUrl = urlFor(image.cover).width(600).quality(60).auto('format').url();
	const placeholderTexture = loader.load(lqipUrl);
    const mainTexture = loader.load(mainUrl);
	mainTexture.matrixAutoUpdate = false;

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

        // 1. Intro progress
        const stagger = i * 0.02;
        const p = Math.max(0, Math.min(1, (introProgress - stagger) * 1.8));
        const posEase = 1 - Math.pow(1 - p, 2); 

        // 2. Reverse Z-Depth
        const zDepth = ((cols * rows) - i) * 0.01 * (1 - posEase);

        // 3. Posizionamento
        mesh.position.set(targetX * posEase, targetY * posEase, zDepth);

        // 4. Rotazione (Inclinazione wallet migliorata)
        // mesh.rotation.x = -0.8 * (1 - posEase);

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
	
    // useTask(() => {
    //     if (!mesh) return;

    //     // 1. Progresso globale con stagger
    //     // Usiamo uno stagger leggermente più alto per accentuare l'effetto "uno alla volta"
    //     const stagger = i * 0.02; 
    //     const p = Math.max(0, Math.min(1, (introProgress - stagger) * 2));

    //     // Easing: "Back Out" è perfetto per le esplosioni perché dà un leggero rimbalzo
    //     const ease = 1 - Math.pow(1 - p, 3); 

    //     // 2. Calcolo Target Finale
    //     const targetX = wrap(baseX - currentX, gridWidth);
    //     const targetY = wrap(baseY - currentY, gridHeight);

    //     // 3. LOGICA ESPLOSIONE
    //     // Punto di partenza comune: Centro (0) e in basso (-15)
    //     const startX = 0;
    //     const startY = 0;
        
    //     // Interpolazione lineare tra il punto di origine comune e il target finale unico
    //     const currentPosX = startX + (targetX - startX) * ease;
    //     const currentPosY = startY + (targetY - startY) * ease;
        
    //     // Rotazione: le immagini "ruotano" mentre volano verso l'esterno
    //     // Partono molto inclinate e si raddrizzano
    //     const currentRotX = -3 * (1 - ease);
    //     // Aggiungiamo una rotazione Z per l'effetto "volo" (opzionale)
    //     const currentRotZ = (i % 2 === 0 ? 0.2 : -0.2) * (1 - ease);

    //     mesh.position.set(currentPosX, currentPosY, 0);
    //     mesh.rotation.x = currentRotX;
    //     mesh.rotation.z = currentRotZ;

    //     // 4. Scale logic
    //     const targetHover = hovered ? 1.1 : 1.0;
    //     // Partono da scala 0 (invisibili nel punto di origine)
    //     const finalTargetScale = (p * 1.0) * targetHover;
    //     lerpScale += (finalTargetScale - lerpScale) * 0.15;
    //     mesh.scale.set(lerpScale, lerpScale, 1);

    //     // 5. Visibility
    //     mesh.visible = p > 0.0;
    // });
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
    <!-- <ImageMaterial 
        url={urlFor(image.cover).width(400).auto('format').url()} 
        transparent
    /> -->
	<!-- {#if $texture} -->
        <!-- <T.MeshBasicMaterial 
            map={useTexture(urlFor(image.cover).width(600).auto('format').url())} 
            transparent={true}
            toneMapped={false} 
        /> -->
		<!-- <T.MeshBasicMaterial map={texture} transparent toneMapped={false} /> -->
		<T.MeshBasicMaterial 
			map={mainTexture} 
			transparent 
			toneMapped={false}
			oncreate={(e) => {
				// 'e' è l'evento, l'oggetto Three.js è in e.ref
				const material = e.ref;

				if (material && !mainTexture.image) {
					// Assegna il placeholder se l'immagine principale non è pronta
					material.map = placeholderTexture;
					
					// Quando la mainTexture finisce il caricamento, aggiorna
					mainTexture.onUpdate = () => {
						material.map = mainTexture;
						material.needsUpdate = true;
					};
				}
			}}
		/>
    <!-- {/if} -->
</T.Mesh>