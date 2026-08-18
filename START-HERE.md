# 0xAeterNova // Interface Zero V5

This version is a full rebuild.

## Why V5 exists

V4/V4.1 could fall back to a flat UI when the Three.js CDN did not load. V5 removes that architecture completely.

- No Three.js CDN.
- No npm runtime dependency.
- No React.
- No GSAP.
- No external post-processing library.
- No external audio stream.

The 3D renderer in `js/engine.js` is a self-contained WebGL2 engine included with the site. It contains its own geometry generators, camera/matrix code, object picking, animated particles, background shaders, render targets, bright pass, multi-pass blur and final bloom/composite pass.

## Run it

### Windows
Double-click `START-PORTFOLIO.bat`.

Then use:

`http://127.0.0.1:8080`

### Linux/macOS
Run `./start-portfolio.sh` and open the same address.

Because V5 uses classic local scripts rather than ES-module imports, modern Chrome/Edge can also open `index.html` directly. A local server is still recommended because it matches GitHub Pages deployment.

## Controls

- Drag empty 3D space: orbit the current field.
- Mouse wheel: camera depth.
- Click a glowing project / topology node: open it.
- `M`: enter the 3D Nexus topology.
- `/`: open Signal Acquisition search.
- `Esc`: close Nexus/Search.
- `1`: Origin.
- `2`: Project Archive.
- `3`: Cybersecurity.
- `4`: About / Identity.
- `5`: Contact.
- `F`: distraction-free 3D focus mode.

## Sound

`assets/audio/aeternova-interface-zero.ogg` is an original locally generated stereo soundtrack. It is not a WebAudio drone. The browser audio graph is only used for mastering, filtering during world transitions, visualization and 3D reactivity.

## Diagnostics

If the 3D canvas ever fails, open `DIAGNOSTICS.html` and send a screenshot of the result. It has no dependencies and directly reports the browser WebGL2/GPU capability.
