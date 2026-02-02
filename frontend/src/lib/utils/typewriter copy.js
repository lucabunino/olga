import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(TextPlugin);
}

// Default values in milliseconds
const DEFAULT_SPEED = 50;   
const DEFAULT_DELAY = 0;
const DEFAULT_PAUSE = 1500;

/**
 * 1. SINGLE ANIMATION
 */
export function typewriter(node, options = {}) {
    let { 
        text = '', 
        speed = DEFAULT_SPEED, 
        delay = DEFAULT_DELAY, 
        outDelay = 0, // Optional delay before disappearing
        ease = "none" 
    } = options;

    let tween;

    function playIn() {
        node.textContent = '';
        tween = gsap.to(node, {
            delay: delay / 1000,
            duration: (text.length * speed) / 1000, 
            text: { value: text, delimiter: "" },
            ease
        });
    }

    playIn();

    return {
        // If the parameters change (e.g., text changes)
        update(newOptions) {
            text = newOptions.text;
            tween?.kill();
            playIn();
        },
        // Triggered when the element leaves the DOM
        destroy() {
            tween?.kill();
            // Optional: If you want a GSAP disappearing animation 
            // Note: This only works if you delay the actual DOM removal, 
            // otherwise, use Svelte's 'out:fade' for the visual disappearance.
        }
    };
}

/**
 * 2. LOOP ANIMATION
 */
export function typewriterLoop(node, options = {}) {
    const { 
        words = [], 
        speed = DEFAULT_SPEED, 
        delay = DEFAULT_DELAY, 
        pause = DEFAULT_PAUSE, 
        ease = "none"
    } = options;

    let index = 0;
    node.textContent = '';

    let tl = gsap.timeline({
        delay: delay / 1000, // Convert ms to s
        onComplete: () => {
            index = (index + 1) % words.length;
            playSequence();
        }
    });

    function playSequence() {
        const currentWord = words[index];
        // Calculate total time to type the word based on ms per character
        const duration = (currentWord.length * speed) / 1000;

        tl.clear();
        
        // 1. Type Full (In)
        tl.to(node, {
            duration: duration,
            text: { value: currentWord, delimiter: "" },
            ease
        });

        // 2. Wait (Pause)
        tl.to({}, { duration: pause / 1000 });

        // 3. Type Empty (Out)
        tl.to(node, {
            duration: (duration * 0.8), 
            text: { value: "", delimiter: "" },
            ease
        });

        // 4. Short gap (200ms) before restarting next word
        tl.to({}, { duration: 0.2 });
    }

    if (words.length > 0) {
        playSequence();
    }

    return {
        destroy() {
            tl.kill();
        }
    };
}