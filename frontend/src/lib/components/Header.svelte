<script>
    import { browser } from "$app/environment";
    import { page } from "$app/state";
    import { innerWidth } from "svelte/reactivity/window";
    import { getMenu } from '$lib/stores/menu.svelte.js';
    let menuer = getMenu();

    let y = $state(0)
    let y_old = $state(0)
    let y_threshold = $state(0)

    // New: Handle mouse position to show header at the top
    function handleMouseMove(e) {
        if (!browser || menuer.open) return;
        
        // Convert 7rem to pixels based on current root font size
        const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const thresholdPx = rootFontSize * 7;

        if (e.clientY <= thresholdPx) {
            menuer.setHidden(false);
            y_threshold = 0; // Reset scroll threshold when manually shown
        }
    }

    function handleScroll(e) {
        if (!browser) return;

        const delta = y - y_old;
        if (y < 50) {
            menuer.setHidden(false);
            y_threshold = 0;
        } else {
            if (delta < 0) {
                menuer.setHidden(false);
                y_threshold = 0;
            } else if (delta > 0) {
                y_threshold += delta;
                if (y_threshold > 50) {
                    menuer.setHidden(true);
                }
            }
        }
        y_old = y;
    }
</script>

<svelte:window bind:scrollY={y} onscroll={handleScroll} onmousemove={handleMouseMove}></svelte:window>

<header>
    <nav class="{page.url.pathname === '/' ? 'bg-gray' : undefined} {menuer.open ? 'open' : 'closed'} {menuer.hidden ? 'up' : 'down'}" aria-label="Main navigation">
        <a href="/" class="logo" aria-label="Studio Olga home" onclick={() => {menuer.setOpen(false); menuer.setHidden(false)}}>
            <svg width="63" height="36" viewBox="0 0 63 36" xmlns="http://www.w3.org/2000/svg">
                <path d="M39.0455 27.9085C39.0455 29.7838 37.0345 30.4148 35.3008 30.4148C34.0623 30.4148 33.1306 30.0584 33.1306 29.0711C33.1306 28.1831 33.909 27.7274 35.1238 27.6281L39.0514 27.3301V27.9085H39.0455ZM42.0531 30.2629C41.4751 30.2629 41.1744 30.0058 41.1744 29.3574V25.5657C41.1744 23.036 39.1045 21.7916 36.3092 21.7916C33.4608 21.7916 31.7035 23.1529 31.4676 25.186H33.6024C33.8441 24.0993 34.6992 23.4683 36.3151 23.4683C38.0666 23.4683 39.0455 24.1811 39.0455 25.5015V25.8754L34.5636 26.1908C32.4701 26.3661 30.9958 27.2775 30.9958 29.1704C30.9958 31.1451 32.6883 32.0506 35.0826 32.0506C37.1525 32.0506 38.5324 31.4197 39.305 30.4499C39.6057 31.5131 40.4019 31.852 41.3985 31.852H42.3538V30.2746L42.0531 30.2629ZM24.1137 34.3875C22.0615 34.3875 21.0472 33.6573 20.7228 32.8452L22.2561 31.5248H25.4642C26.2839 31.5248 27.2982 31.7994 27.2982 32.7868C27.3041 33.8734 25.989 34.3875 24.1137 34.3875ZM23.9958 23.369C25.7296 23.369 26.7085 24.0818 26.7085 25.186C26.7085 26.2142 25.7119 26.9445 23.9958 26.9445C22.3033 26.9445 21.2654 26.2142 21.2654 25.186C21.2654 24.0818 22.3033 23.369 23.9958 23.369ZM25.7119 29.8656H22.321C21.5425 29.8656 20.888 29.591 20.888 28.9951C20.888 28.6388 21.1061 28.3408 21.5248 28.148C22.2443 28.4051 23.0817 28.5453 23.9958 28.5453C26.7439 28.5453 28.8197 27.3009 28.8197 25.186C28.8197 24.4732 28.5425 23.8247 28.0413 23.2931C28.7961 22.9776 29.4743 22.5628 29.8163 22.224L28.7372 20.962C28.3008 21.4761 27.481 22.0662 26.7439 22.3642C25.989 22.0078 25.0278 21.7916 23.9545 21.7916C20.9823 21.7916 19.1542 23.2347 19.1542 25.186C19.1542 26.1324 19.5729 26.9211 20.31 27.4937C19.5729 27.8676 18.936 28.4985 18.936 29.4275C18.936 30.2746 19.4313 30.9698 20.251 31.3028L18.5939 32.7225C18.9301 34.481 20.4869 36 24.0548 36C27.4633 36 29.3976 34.7556 29.3976 32.6641C29.3976 30.9289 28.0826 29.8656 25.7119 29.8656ZM14.2123 31.8578H16.3471V17.8364H14.2123V31.8578ZM5.97978 30.1986C3.55013 30.1986 2.13479 28.7205 2.13479 26.9211C2.13479 25.1042 3.53243 23.6436 5.97978 23.6436C8.42713 23.6436 9.84836 25.1042 9.84836 26.9211C9.84836 28.7205 8.43302 30.1986 5.97978 30.1986ZM5.97978 32.0565C9.5476 32.0565 11.9772 29.924 11.9772 26.9211C11.9772 23.9182 9.52401 21.7858 5.97978 21.7858C2.42965 21.7858 0 23.9182 0 26.9211C0 29.9065 2.45324 32.0565 5.97978 32.0565Z"/>
                <path d="M57.0024 12.3681C54.5728 12.3681 53.1574 10.89 53.1574 9.09055C53.1574 7.27361 54.5551 5.81304 57.0024 5.81304C59.4498 5.81304 60.871 7.27361 60.871 9.09055C60.8651 10.8841 59.4498 12.3681 57.0024 12.3681ZM57.0024 14.2259C60.5702 14.2259 62.9999 12.0935 62.9999 9.09055C62.9999 6.08763 60.5466 3.9552 57.0024 3.9552C53.4523 3.9552 51.0226 6.08763 51.0226 9.09055C51.0226 12.0701 53.47 14.2259 57.0024 14.2259ZM46.6351 14.0273H48.7699V4.15384H46.6351V14.0273ZM47.7143 2.73417C48.4514 2.73417 49.0471 2.12073 49.0471 1.41382C49.0471 0.666008 48.4514 0.0934783 47.7143 0.0934783C46.9771 0.0934783 46.3579 0.666008 46.3579 1.41382C46.3579 2.12073 46.9771 2.73417 47.7143 2.73417ZM38.3849 12.3681C36.1498 12.3681 34.7168 11.0652 34.7168 9.07303C34.7168 7.11587 36.1498 5.81304 38.3849 5.81304C40.5963 5.81304 41.9527 7.09834 41.9527 9.07303C41.9527 11.0828 40.5786 12.3681 38.3849 12.3681ZM41.9527 0.00584796V5.43329C41.3335 4.74391 40.0774 3.9552 38.1077 3.9552C34.9409 3.9552 32.5879 5.87146 32.5879 9.06718C32.5879 12.2045 34.8407 14.2201 38.1077 14.2201C40.2012 14.2201 41.3571 13.3729 41.9527 12.6602H42.1119L42.3124 14.0214H44.0875V0H41.9527V0.00584796ZM30.3529 4.15384H28.2181V9.30671C28.2181 11.4391 26.7851 12.3681 25.0277 12.3681C23.2939 12.3681 22.0555 11.48 22.0555 9.44692V4.15384H19.9207V9.96104C19.9207 12.7244 21.7134 14.2259 24.4439 14.2259C26.3781 14.2259 27.3925 13.4956 28.053 12.7069H28.2122L28.3891 14.0273H30.3411V4.15384H30.3529ZM16.2054 14.2259C16.8836 14.2259 17.5028 14.1266 17.9392 14.0097V12.3914C17.6031 12.4732 17.1608 12.5083 16.8246 12.5083C15.5096 12.5083 15.3503 11.7605 15.3503 11.1237V5.85394H18.2813V4.15384H15.3503V1.39046H13.3748V2.63486C13.3748 3.73905 12.9384 4.15384 11.7412 4.15384H10.7859V5.85394H13.2155V11.5209C13.2155 13.0808 14.0707 14.2259 16.2054 14.2259ZM5.02431 14.2259C7.47756 14.2259 9.47081 13.3788 9.47081 11.3223C9.47081 9.74489 8.37394 8.77507 6.26273 8.3778L4.52895 8.07984C3.41437 7.8403 2.51799 7.64752 2.51799 6.77702C2.51799 5.9299 3.39669 5.55015 4.65279 5.55015C6.18607 5.55015 6.90553 6.08178 7.12373 6.89386H9.23493C9.01673 5.27555 7.61909 3.94937 4.65279 3.94937C2.22314 3.94937 0.406797 4.99512 0.406797 6.89386C0.406797 8.6699 1.92238 9.28335 3.53822 9.59883L5.23072 9.87341C6.68733 10.148 7.36552 10.5862 7.36552 11.3515C7.36552 12.3213 6.35119 12.6134 5.03611 12.6134C3.44386 12.6134 2.36467 12.1811 2.12878 10.9133H0.0175781C0.176803 12.999 1.89289 14.2259 5.02431 14.2259Z"/>
            </svg>
        </a>
        
        <button 
            class="menu-switch {menuer.open ? 'open' : 'closed'}" 
            onclick={() => {menuer.setOpen(!menuer.open); menuer.setHidden(false)}}
            aria-expanded={menuer.open}
            aria-controls="main-menu"
            aria-label={menuer.open ? "Close menu" : "Open menu"}
        >
            <span class="line"></span>
            <span class="line"></span>
            <span class="line"></span>
        </button>
        
        <ul 
            id="main-menu" 
            class="menu md-26-mb {menuer.open ? 'open' : 'closed'}"
            aria-hidden={innerWidth.current <= 768 && !menuer.open}
        >
            <li><a aria-current={page.url.pathname.startsWith('/studio') ? 'page' : undefined} href="/studio" onclick={() => {menuer.setOpen(false); menuer.setHidden(false)}}>studio</a></li>
            <li><a aria-current={page.url.pathname.startsWith('/portfolio') ? 'page' : undefined} href="/portfolio" onclick={() => {menuer.setOpen(false); menuer.setHidden(false)}}>portfolio</a></li>
            <li><a aria-current={page.url.pathname.startsWith('/contatti') ? 'page' : undefined} href="/contatti" onclick={() => {menuer.setOpen(false); menuer.setHidden(false)}}>contatti</a></li>
        </ul>
    </nav>
</header>

<style>
header {
    nav {
        display: flex;
        justify-content: space-between;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        padding: 2rem var(--sp-m);
        align-items: center;
        z-index: 10;
        background-color: var(--white-70);
        backdrop-filter: blur(3rem);
		transition: var(--transition-s);

        &.bg-gray {
            background-color: var(--gray-light-70);
        }

		&.up:not(.open) {
			transform: translateY(-100%);
		}

        .logo {
            z-index: 11;
            svg {
                fill: var(--black);
                height: 3rem;
                width: auto;
            }
        }

        .menu-switch {
            display: none;
            border: none;
            background: transparent;
            cursor: pointer;
            z-index: 11;
        }

        .menu {
            display: flex;
            width: calc((100% - var(--gutter)*2)/12 * 3);
            list-style: none;
            margin: 0;
            padding: 0;

            li {
                width: 33%;
            }
        }

        @media screen and (max-width: 768px) {
            background-color: transparent;
            backdrop-filter: none;
            padding: 2rem var(--margin-mb);
            
            &.bg-gray {
                background-color: transparent;
            }

            .logo svg { height: 4rem; }

            .menu-switch {
                display: block;
                width: 2.5rem;
                height: 1.666rem;
                position: relative;

                .line {
                    position: absolute;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: var(--black);
                    transition: var(--transition-s);
                    transform-origin: center;
					border-radius: 1px;

                    &:nth-child(1) { top: 0; }
                    &:nth-child(2) { top: 50%; transform: translateY(-50%); }
                    &:nth-child(3) { bottom: 0; }
                }

                &.open {
                    .line:nth-child(1) {
                        top: 50%;
                        transform: translateY(-50%) rotate(45deg);
                    }
                    .line:nth-child(2) {
                        opacity: 0;
                        transform: translateY(-50%) scaleX(0);
                    }
                    .line:nth-child(3) {
                        bottom: 50%;
                        transform: translateY(50%) rotate(-45deg);
                    }
                }
            }

            .menu {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100dvh;
                flex-direction: column;
                padding: calc(8rem + var(--sp-l)) var(--margin-mb);
                row-gap: var(--sp-m);
                transform: translateY(-100%);
                transition: var(--transition-s);
				transition-property: transform;
                background-color: var(--white-70);
                backdrop-filter: blur(1rem);
                z-index: 10;
                
                &.open {
                    transform: translateX(0);
                }
                
                li { width: 100%; }
            }
        }
    }
}
</style>