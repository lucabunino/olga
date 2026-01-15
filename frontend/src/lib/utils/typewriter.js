import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

// Default values in milliseconds
const DEFAULT_SPEED = 50;   
const DEFAULT_DELAY = 0;
const DEFAULT_PAUSE = 1500;

/**
 * 1. SINGLE ANIMATION
 */
export function typewriter(node, options = {}) {
	gsap.registerPlugin(TextPlugin);

    const { 
        text = node.textContent, 
        speed = DEFAULT_SPEED, 
        delay = DEFAULT_DELAY, 
        ease = "none" 
    } = options;

    node.textContent = '';

    const tween = gsap.to(node, {
        delay: delay / 1000, // Convert ms to s
        duration: (text.length * speed) / 1000, 
        text: { value: text, delimiter: "" },
        ease
    });

    return {
        destroy() {
            tween.kill();
        }
    };
}

/**
 * 2. LOOP ANIMATION
 */
export function typewriterLoop(node, options = {}) {
	gsap.registerPlugin(TextPlugin);

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

/**
 * 3. GSAP SVELTE TRANSITION
 * Works with in: out: or transition:
 */
export function typewriterTransition(node, options = {}) {
	gsap.registerPlugin(TextPlugin);
	
    const {
        speed = DEFAULT_SPEED,
        delay = DEFAULT_DELAY,
        ease = "none"
    } = options;

    // Capture the full text immediately
    const fullText = node.textContent.trim();
    const duration = (fullText.length * speed); 

    return {
        delay,
        duration,
        tick: (t) => {
            // t flows 0 -> 1 for IN
            // t flows 1 -> 0 for OUT
            
            // 1. Calculate the current number of characters to show
            // We use Math.round and a small epsilon to ensure the last char appears
            const i = Math.round(fullText.length * t);
            const currentText = fullText.slice(0, i);

            // 2. Use GSAP's utility or simple assignment
            // assignment is safer here to avoid creating thousands of tweens
            node.textContent = currentText;
            
            // If you need specific GSAP easing on the string itself:
            // node.textContent = gsap.utils.interpolate("", fullText, t);
        }
    };
}