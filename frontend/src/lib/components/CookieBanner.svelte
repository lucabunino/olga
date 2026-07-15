<script>
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';

    const STORAGE_KEY = 'cookies-acknowledged';
    let visible = $state(false);

    onMount(() => {
        visible = !localStorage.getItem(STORAGE_KEY);
    });

    function dismiss() {
        localStorage.setItem(STORAGE_KEY, 'true');
        visible = false;
    }
</script>

{#if visible}
    <aside id="cookie-banner" class="md-12" transition:fly={{ y: 20, duration: 400 }}>
        <p>This website uses only technical cookies, which are necessary for its proper functioning. No profiling or third-party cookies are used. For more details, please consult our <a class="underline hover-gray-dark" href="/cookies">cookies</a> and <a class="underline hover-gray-dark" href="/privacy-policy">privacy</a> policies.</p>
        <button onclick={dismiss}>Ok, I understand</button>
    </aside>
{/if}

<style lang="scss">
    #cookie-banner {
        position: fixed;
        bottom: calc(var(--sp-xs)*2);
        left: calc(var(--sp-xs)*2);
        max-width: 60ch;
        z-index: 10;
        background-color: var(--gray-light);
        padding: var(--sp-m) calc(var(--sp-s)*1.5);

        button {
            margin-top: calc(var(--sp-s)*1.5);
            cursor: pointer;
            transition: color var(--transition-xs);

            &:hover,
            &:active {
                color: var(--gray-dark);
            }
        }

        @media screen and (max-width: 768px) {
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            max-width: unset;
        }
    }
</style>
