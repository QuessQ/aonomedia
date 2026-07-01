# Aono Media — Portfolio Rebuild

Luxury, modern rebuild of [aonomedia.com](https://aonomedia.com) — the
photography portfolio of Hideki Aono, featuring a scroll-scrubbed 3D camera
video hero.

**Design direction (chosen):** dark cinematic hero → warm light editorial.
The site opens on a full-bleed, near-black video hero scrubbed by scroll
(Gallery Noir), then releases into a warm porcelain editorial body with an
asymmetric work grid, statement quote, about section, and client inquiry form
(Atelier Light). The earlier lo-fi explorations remain in [`sketches/`](sketches/).

## Running the site

It is a static site — no build step. Open `index.html` in a browser, or serve
the folder (`python3 -m http.server`) for correct video behavior.

```
index.html        # single-page site
css/main.css      # all styles
js/main.js        # video scrub, reveals, parallax, lightbox, inquiry form
assets/           # media (see below)
sketches/         # phase-1 lo-fi design direction sketches
```

## Dropping in the real assets

The site is fully placeholder-safe: it renders complete with generated
stand-in imagery, and every real file drops in with **zero code changes**.

| What | Put it at | Notes |
| --- | --- | --- |
| Hero video | `assets/video/Camera_Hero.mp4` | Scrubbed by scroll. For buttery scrubbing, re-encode with dense keyframes: `ffmpeg -i Camera_Hero.mp4 -g 1 -crf 20 -movflags +faststart -an out.mp4`. Use Git LFS if over 100 MB. |
| Logo | `assets/logos/logo-light.svg` | Light/white variant (sits on the difference-blend nav). Until present, a spaced "AONO MEDIA" wordmark shows instead. |
| Photos | `assets/photos/photo-01.jpg` … `photo-07.jpg` | Overwrite the generated placeholders with the portfolio photographs (web-sized: ~2500px long edge, JPEG ~80 quality). |
| Portrait | `assets/photos/portrait.jpg` | Photographer portrait for the About section. |
| Video poster | `assets/photos/poster.jpg` | First frame of the hero video (optional; a generated one is included). |

More than seven photos? Duplicate a `<figure class="item …">` block in
`index.html` and extend the `.gN` grid classes in `css/main.css`.

## Copy still to migrate from the existing site

Marked with `TODO` comments in `index.html`:

- Introduction line and artist statement / quote
- Biography copy on the About section
- Contact email (currently `hello@aonomedia.com`) and social links
- Real titles/locations for the work-grid captions

## Later

- Swap the inquiry form's `mailto:` composition for a form backend
  (e.g. Formspree) when an endpoint exists.
- Optional: per-series pages if the portfolio grows beyond a single page.
