let played = false;

export function getIntro() {
    return {
        get played() { return played; },
        markPlayed() { played = true; }
    };
}
