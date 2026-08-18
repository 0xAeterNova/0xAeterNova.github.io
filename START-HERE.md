# 0xAeterNova — Transmission Machine V4.2

This build returns to the V4 visual direction: cinematic transmission blades, an asymmetric information lens, machine-state reconfiguration and color-changing 3D realms.

The important difference is that the 3D engine is now completely local. It does **not** download Three.js or any runtime library from a CDN.

## Run it on Windows

1. Extract the ZIP into its own folder.
2. Double-click `START-PORTFOLIO.bat`.
3. It opens `http://127.0.0.1:8080/` automatically.
4. Choose **ENTER WITH SOUND** or **ENTER SILENT**.

Do not double-click `index.html` directly. Browser module security may block JavaScript when a site is opened through `file://`.

## Controls

- Drag empty 3D space — orbit the camera
- Mouse wheel — camera depth
- Click a 3D project signal — open it
- `M` — 3D Signal Map
- `/` — Signal Acquisition search
- `R` — recenter camera
- `F` — cinematic focus mode
- `1`–`5` — Origin / Archive / Breach / Orbit / Uplink
- **EXPLODE X** — separate / reassemble machine geometry
- **AUTO TRANSMIT** — automatic portfolio tour

## If 3D does not work

Open `DIAGNOSTICS.html` through the same local server:

`http://127.0.0.1:8080/DIAGNOSTICS.html`

It checks WebGL2 and shows the GPU renderer. V4.2 has no CDN dependency, so a failure here is normally browser/GPU hardware acceleration rather than a missing library.

## Main editable files

- `js/data.js` — profile, projects, skills, links
- `js/app.js` — interface, transitions, map, search, soundtrack behavior
- `js/engine.js` — local 3D/WebGL2 engine and realm geometry
- `css/app.css` — complete visual design
- `assets/projects/` — project artwork
- `assets/profile/` — GitHub identity artwork
- `assets/audio/` — soundtrack
