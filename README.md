# 0xAeterNova // The Impossible Machine

V4 is an immersive Three.js portfolio built around one central idea: **the portfolio is one impossible machine that physically reconfigures for each part of the work**.

It is intentionally not a normal scrolling portfolio and not a driving-game clone. The same mechanical spine mutates into an archive, RF cathedral, neural face, kernel reactor, exploit volume, orbital biography and transmission crystal.

## Run

Windows: double-click `start-local.bat`.

Linux/macOS:

```bash
./start-local.sh
```

Then open `http://localhost:8080`.

An internet connection is required because Three.js r185 and its official post-processing addons are loaded from jsDelivr.

## Controls

- Drag empty 3D space: orbit
- Mouse wheel: camera depth
- Click empty space: energy pulse
- `X`: explode / recompose the active machine
- `M`: system map
- `/`: search / command palette
- `F`: focus mode
- `R`: reset camera
- `1`–`5`: primary sections
- **AUTO PILOT**: cinematic guided tour

## Files that matter

- `js/data.js` — profile, links, projects, skills
- `js/world.js` — 3D machine and state designs
- `js/audio.js` — generative spatial sound engine
- `js/app.js` — navigation, content lens, command palette, transitions
- `css/app.css` — responsive interface and visual system
- `assets/profile/profile-hero-dark.svg` — original GitHub profile hero

See `ADDING-PROJECTS.md` and `PUBLISHING.md`.
