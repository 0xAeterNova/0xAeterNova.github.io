# 0xAeterNova — Transmission Machine V4.3

V4.3 preserves the transmission-machine look and music from V4.2 while extending the environment, interactions and performance system.

The 3D engine is completely local. It does **not** download Three.js or any runtime library from a CDN.

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
- `M` — open the interactive **Signal Atlas**
- `/` — open **Spectral Search Array**
- `R` — recenter camera
- `F` — cinematic focus mode
- `1`–`5` — Origin / Archive / Breach / Orbit / Uplink
- `X` or **DISASSEMBLE X** — release the current machine into inspectable 3D layers; drag around it, then press `X` again or click **REASSEMBLE X** to rebuild it
- **AUTO TRANSMIT** — automatic cinematic portfolio tour

## What changed in V4.3

The background now contains a deeper procedural skyline, transmission lanes, aurora/nebula fields, reactive horizon geometry and themed UFO fleets. UFO colors inherit the active realm so they feel like part of the world instead of pasted-on props.

The old map has become **Signal Atlas**. Hovering a node focus-locks it in the 3D network, brightens connected transmission paths and suppresses unrelated routes. Labels include collision avoidance so they do not stack on top of each other.

Search is now **Spectral Search Array**. It keeps the 3D world visible, surfaces only the strongest three matches, and changes the 3D search field as the query changes.

About no longer contains percentage scores or the GitHub Activity Field. Skills are grouped into capability clusters and the original GitHub identity artwork remains intact.

The cursor is now a scanning instrument with crosshair, orbit rings, SCAN/LOCK state and an inertial trail. It is disabled on touch/mobile layouts.

## Lag / performance behavior

V4.3 measures real frame rate while running. When performance drops it automatically:

- lowers internal render resolution without changing CSS/layout size
- reduces GPU particle draw count
- reduces bloom passes
- reduces expensive UI blur/film effects

When performance recovers, quality rises again automatically.

The renderer also caches WebGL uniform locations instead of resolving them for every object on every frame.

## Music

The V4.2 soundtrack files are unchanged in V4.3. Their SHA-256 hashes remain the same; only visual reactivity/performance around the audio changed.

## If 3D does not work

Open `DIAGNOSTICS.html` through the same local server:

`http://127.0.0.1:8080/DIAGNOSTICS.html`

It checks WebGL2 and shows the GPU renderer. V4.3 has no CDN dependency, so a failure here is normally browser/GPU hardware acceleration rather than a missing library.

## Main editable files

- `js/data.js` — profile, projects, skills, links
- `js/app.js` — interface, transitions, map, search, soundtrack behavior
- `js/engine.js` — local 3D/WebGL2 engine and realm geometry
- `css/app.css` — complete visual design
- `assets/projects/` — project artwork
- `assets/profile/` — GitHub identity artwork
- `assets/audio/` — unchanged soundtrack
