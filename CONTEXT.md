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
- **Related** — the "explore our world" project carousel at the bottom of project/studio pages.

## Implementation notes

- **Intro choreography fly-out easing** (`GridItem.svelte`): fly-out uses ease-in-out cubic — cluster leaves gently and settles gently ("poetic") — instead of a sharp pow-out burst.
- **Poem trigger** (`studio/+page.svelte`): the poem starts revealing once its text block (`.poem-inner`, observed instead of the padded section) crosses 30% above the viewport bottom; fires immediately when already past that point at first load. Plays once, observer disconnects after firing.
- **Poem height stability** (`studio/+page.svelte`): before the trigger, an invisible static copy of the poem + author renders in place (same markup and classes, `visibility: hidden`) so the page height doesn't jump when the animated version mounts.
- **Client-marquee seam** (`contact/+page.svelte`): logo spacing must go through the Marquee `gap` prop, never external `column-gap` — the library adds a matching `padding-right` at the loop seam; outside gaps reintroduce the reset jump.
- **LQIP placeholder** (`media/Image|Video|Gif.svelte`): the LQIP is painted only on the fading `::before` overlay (via the `--lqip` custom property), never as the container's own background — a permanent base background bleeds through as a 1px edge line in Safari, which rounds fractional `aspect-ratio` heights short.
- **Intro input lock** (`Grid.svelte`): wheel/drag are ignored until the intro fly-out finishes (`inputLocked`); skip-intro re-navigations are never locked.
- **Intro cluster size** (`Grid.svelte`): the cluster is exactly the spiral slots visible in the viewport at rest (computed from camera z=10 / fov 45 and `gridScale`), not a fixed count; stagger and fly-out order key on rank within that set.
