# Aono Media — Portfolio Rebuild

Luxury, modern rebuild of [aonomedia.com](https://aonomedia.com) — a photography
portfolio for Hideki Aono, featuring a scroll-scrubbed 3D camera video hero.

## Current phase: design direction sketches

Three lo-fi option sketches live in [`sketches/`](sketches/). Open
`sketches/index.html` in a browser (no build step needed) and click through:

| Option | File | Direction |
| --- | --- | --- |
| A — Gallery Noir | `sketches/option-a-gallery-noir.html` | Dark, cinematic, serif; photos glow against near-black |
| B — Atelier Light | `sketches/option-b-atelier-light.html` | Warm light editorial; letterboxed video expands on scroll |
| C — Monolith | `sketches/option-c-monolith.html` | Fixed black rail + live section index; bold architectural |

Each sketch scrolls and includes a working simulation of the scroll-scrubbed
hero (frame counter + progress bar) so the pacing can be felt before the real
video is wired in. Gray X-blocks are placeholders for the site's photographs;
dashed orange/blue chips are annotations, not design elements.

## Assets needed for the final build

This cloud environment cannot reach the photographer's local machine, and the
network policy currently blocks fetching from aonomedia.com. To proceed with
the final build, add the assets to this repo (or grant network access to
aonomedia.com so the photos can be pulled from the live site):

```
assets/
  video/Camera_Hero.mp4     # 3D hero video (scroll-scrubbed)
  logos/                    # logo files (SVG preferred; light + dark variants if available)
  photos/                   # portfolio photographs from the existing site
```

Tip for large files: export web-sized photos (~2500px long edge, JPEG ~80
quality) before committing, or use Git LFS for the video if it exceeds 100 MB.

## Final build (next phase)

Once a direction is chosen and assets are in place: a static site (no heavy
framework), canvas-based scroll scrubbing of the hero video (frames drawn to
`<canvas>` for smooth scrubbing across browsers), responsive images, and
scroll-triggered reveals.
