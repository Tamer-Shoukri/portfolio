# 3D Portfolio — Interactive Skyscraper

A premium, minimalist developer portfolio built around an interactive 3D
skyscraper. Visitors land on a cinematic intro, scroll to rise through the
tower, orbit and zoom around it, click a floor to approach it, open its door,
and step into a room that showcases a project.

Built with **Next.js (App Router)**, **React Three Fiber**, **drei**, **Three.js**,
and **TypeScript**. Statically exported — deploys to any static host.

## Experience

- **Intro** — cinematic establishing shot of the tower with name & tagline.
- **Scroll to rise** — the wheel/trackpad drives the camera vertically along the building.
- **Orbit & zoom** — drag to orbit, scroll-pinch to zoom (OrbitControls) in the free exterior view.
- **Click a floor** — the camera smoothly approaches that floor.
- **Open the door** — clicking the door plays a hinge-open animation, then enters the room.
- **Room showcase** — an elegant panel with the project's description, role, tech, and links.
- **Return & explore** — exit the room, pick another floor.
- **Nav menu** — direct access to Projects, Experience, Education, and Contact.

Floors map to projects (top floor first); Experience / Education / Contact live
in a slide-over panel.

## Visual direction

Premium architectural visualization: a dark glass tower, restrained palette,
thin per-floor accent light-lines, realistic lighting with soft contact shadows,
and smooth damped camera transitions. Minimal clutter; typography-led UI.

## Project structure

```
src/
  app/            # Next.js App Router (layout, page, global CSS, favicon)
  data/content.ts # SINGLE SOURCE OF TRUTH for all portfolio content
  state/store.ts  # tiny external store (view/floor/door/scroll)
  scene/          # 3D: Scene, Building, Floor (+ animated door), CameraRig, layout
  ui/Hud.tsx      # DOM overlay: intro, nav, floor peek, room panel, info panel
```

> **Content:** everything is driven by `src/data/content.ts`. Swapping in real
> content never requires touching the 3D scene. Current content is placeholder
> except the Math Tug-of-War project, which is real.

## Develop

Requires Node 18+.

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # static export to ./out
pnpm typecheck  # tsc --noEmit
```

## Deploy

`pnpm build` produces a static site in `out/`. For a GitHub Pages project site,
set `NEXT_PUBLIC_BASE_PATH=/<repo-name>` at build time so asset paths resolve.

## Status

Functional 3D system complete and browser-verified (intro, scroll, orbit,
floor-approach, door, room, nav — zero runtime errors). Real content and final
art polish pending.
