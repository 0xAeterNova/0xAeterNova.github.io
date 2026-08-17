# 0xAeterNova — Interactive 3D Portfolio

A driveable WebGL portfolio world for **0xAeterNova / Zaid Tawalbeh**.

This version deliberately avoids the normal "hero + cards + scrolling sections" structure. The portfolio is one persistent Three.js world with:

- a controllable cyber rover;
- 3D world districts and project landmarks;
- proximity interaction;
- cinematic camera travel between portfolio pages;
- a holographic world map;
- live 3D project detail views;
- animated HUD and page transitions;
- responsive mobile controls;
- auto/high/low graphics quality;
- procedural 3D assets to keep the project lightweight;
- the original `profile-hero-dark.svg` from the GitHub profile repository.

## Run locally

### Windows
Double-click `start-local.bat`.

### Linux / macOS
```bash
./start-local.sh
```

Then open `http://localhost:8080`.

## Content editing

Edit `js/data.js` for projects, links, descriptions, and skills.

World construction is in `js/world.js`. UI/routing is in `js/main.js`. Styling is in `css/main.css`.

## Direct page URLs

The portfolio itself is a single continuous 3D experience, but convenience page URLs are included:

- `projects.html` → `index.html#projects`
- `cybersecurity.html` → `index.html#security`
- `about.html` → `index.html#about`
- `contact.html` → `index.html#contact`

## Core technology

The site imports Three.js as an ES module. All portfolio world assets are custom procedural geometry and your own profile assets; no Bruno Simon models or textures are included.

See `CREDITS.md` and `PUBLISHING.md`.
