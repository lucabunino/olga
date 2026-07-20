# CONTEXT

Glossary of domain terms for the Olga site (SvelteKit frontend + Sanity backend).

## Terms

- **Intro choreography** — the homepage image-grid entrance animation: central cluster pops in, holds, flies out to grid positions, remaining images fade in. Plays once per session.
- **Image grid** — the draggable/scrollable WebGL (Threlte) grid of project cover images on the homepage. Wraps infinitely in both axes.
- **Marquee (homepage)** — the yellow scrolling text strip under the header, content from CMS.
- **Client marquee** — the rows of client logos on the contact page, each row scrolling in alternating directions. A client without a logo is invisible here (never a placeholder).
- **Client line** — one CMS-ordered row of client references rendered as one client-marquee row.
- **Collaborations block** — CMS-editable rich-text section on the contact page, between services and the client marquee. Heading "collaborations" is fixed (not CMS).
- **Poem** — the animated typewriter poem on the studio page. Reveals once, when its section reaches the sticky header; never replays within the visit.
- **Cookie banner** — informational-only notice (technical cookies, no profiling). Dismissal is permanent per browser. Not a consent mechanism.
- **Operative adress / Legal adress** — the studio has two addresses (CMS `info` document; "adress" spelling is the codebase convention). Operative = where the studio works, shown on the contact page and first in the footer; legal = registered seat, shown below it in the footer only.
- **Related** — the "explore our world" project carousel at the bottom of project/studio pages. Items are plain links: click/tap navigates to the project, never re-centers the carousel, and interaction must never stop the automatic scroll.

## Implementation notes

- **Intro choreography fly-out easing** (`GridItem.svelte`): fly-out uses ease-in-out cubic — cluster leaves gently and settles gently ("poetic") — instead of a sharp pow-out burst.
- **Poem trigger** (`studio/+page.svelte`): the poem starts revealing once its text block (`.poem-inner`, observed instead of the padded section) crosses 30% above the viewport bottom; fires immediately when already past that point at first load. Plays once, observer disconnects after firing.
- **Poem height stability** (`studio/+page.svelte`): before the trigger, an invisible static copy of the poem + author renders in place (same markup and classes, `visibility: hidden`) so the page height doesn't jump when the animated version mounts.
- **Client-marquee seam** (`contact/+page.svelte`): logo spacing must go through the Marquee `gap` prop, never external `column-gap` — the library adds a matching `padding-right` at the loop seam; outside gaps reintroduce the reset jump.
- **LQIP placeholder** (`media/Image|Video|Gif.svelte`): the LQIP is painted only on the fading `::before` overlay (via the `--lqip` custom property), never as the container's own background — a permanent base background bleeds through as a 1px edge line in Safari, which rounds fractional `aspect-ratio` heights short.
- **Intro input lock** (`Grid.svelte`): wheel/drag are ignored until the intro fly-out finishes (`inputLocked`); skip-intro re-navigations are never locked.
- **Intro cluster size** (`Grid.svelte`): the cluster is exactly the spiral slots visible in the viewport at rest (computed from camera z=10 / fov 45 and `gridScale`), not a fixed count; stagger and fly-out order key on rank within that set. Intro length grows naturally with the count.
- **Cluster drift** (`GridItem.svelte`): while clustered, each central item wanders slowly around its spot (sin/cos, unique phase per item, `DRIFT_AMP`/`DRIFT_SPEED`); the drift grows in with the pop-in and eases off during the fly-out.
- **Grid zoom tiers** (`Grid.svelte`): `gridScale` = .55 mobile (≤768px), 1 desktop, .85 above 1512px, .65 above 1728px so larger screens see more images.
- **Intro phases** (`Grid.svelte`/`GridItem.svelte`): 1 — central items pop in staggered, clustered near center; 2 — cluster holds; 3 — cluster flies out to real grid positions (last-in flies first); 4 — remaining items fade in at their position, starting the moment phase 3 begins. Plays once per session (`intro` store); SPA re-navigations get a plain staggered fade instead.
- **Layout freeze** (`Grid.svelte`): the grid keeps the last non-empty `images` list so it never collapses mid page-transition when the prop briefly goes undefined.
- **Grid oversizing** (`Grid.svelte`): `cols`/`rows` grow beyond √imageCount so the grid period always exceeds the visible world area — otherwise the wrap-around seam lands on-screen and items visibly teleport at the edges (ultrawide bug). Repeats images to fill.
- **Resize reclassification** (`GridItem.svelte`): resizing changes which slots count as central; items keep their creation-time classification, and the rest-fade start falls back to `entryOrder ?? 0` — without the fallback a reclassified item computes NaN opacity and renders as a hole.
- **Cluster jitter** (`Grid.svelte`): cluster offsets use a deterministic pseudo-random (seeded, not per-frame) so the cluster is stable across renders.
- **Image repeat de-patterning** (`Grid.svelte`, `slotImageIndex`): the grid oversizes beyond the real image count and repeats images to fill it. A plain `i % N` repeat reads as an obvious fixed-stride pattern, so slots beyond the first N (one full, untouched, in-order pass) are assigned via a per-repeat-block deterministic shuffle, then a swap pass removes any grid-adjacent same-image collisions (including across block boundaries).
- **Accessibility contrast debt**: footer/policy text uses `--gray-dark` (#939393) on `--gray-light` (#EBEBEA) — ~2:1 contrast, fails WCAG AA (needs 4.5:1). Known, deliberately left unfixed (visual change, needs a design decision) as of the 2026-07-17 axe-core audit.
- **Related autoplay lock** (`utils/gsap.js`): Draggable pauses the loop on press and only `onThrowComplete` resumed it — a throwless tap left it paused forever, so `onRelease` also resumes when not throwing. A press that interrupts an inertia throw finds the timeline paused, so `wasPlaying` must also count `isThrowing`/its previous value or the loop locks permanently. Click-to-center (`toIndex`/`tweenTo`) was removed from `Related.svelte`: `tweenTo` leaves the timeline paused at the target, killing autoplay.
- **horizontalLoop repeat** (`Related.svelte`): the loop config must pass `repeat: -1` — the helper defaults to playing its timeline once, so without it the carousel silently stops after one full cycle (~track width / speed seconds), which reads as a freeze.
- **horizontalLoop teardown** (`utils/gsap.js`): with `wheel: true` the helper used to `return` from the context callback before `timeline = tl`, so callers got `undefined` and could never clean up — every SPA navigation leaked a live timeline + resize/wheel listeners + Draggable ("zombies") that piled up and froze Related and the homepage on later visits. The helper now always returns the timeline and exposes `timeline.cleanup()` (context revert); `Related.svelte` must call it on effect teardown.
