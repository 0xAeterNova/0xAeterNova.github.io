# Transmission Machine V4.4 — DEEP SIGNAL

V4.4 is a runtime/visual upgrade of V4.3. It keeps the V4 transmission identity and the exact same soundtrack.

## Major visual changes

- Rebuilt procedural background shader: nebula strata, aurora ribbons, horizon grid, transmission lanes, radial energy filaments, sparse star field, distant ringed body, skyline silhouettes, beacons, and transition warp effects.
- UFO fleets are larger, closer, more readable, and use route palettes. Navigation lights and signal beams move with the craft.
- Signal Atlas is now a 3D astrolabe/constellation instead of a flat diagram. Project/core nodes are differentiated and projected labels use collision avoidance.
- Spectral Search now uses a compact acquisition console, animated spectrum/radar, and a live 3D resonance field with only the strongest matches.
- Cursor replaced by a spectral aperture scanner with inertial trail, rotating orbital elements, click pulse, hover lock, and contextual state text.
- Engineering X-Ray replaces the unclear Explode X. It separates the machine into inspectable architectural bands, pulls the camera back, adds controlled drift, and then reassembles.
- About rebuilt without GitHub Activity Field, contribution heatmap, skill percentages, or progress bars. Skills are qualitative capability constellations plus a BUILD/BREAK/EVOLVE manifesto.

## Performance changes

- Shader uniform locations are cached instead of queried for each object on every frame.
- Adaptive render resolution, particle budget, and bloom pass count based on measured FPS.
- Reduced PHANTOM small-node draw calls while strengthening larger composition geometry.
- Render targets are not reallocated for insignificant size changes.
- Rendering pauses while the document is hidden.
- WebGL context loss/recovery handling added.
- Mobile automatically reduces costly UI/particle effects.

## Deployment / cache safety

- Visible `BUILD 4.4 · DEEP SIGNAL` marker.
- `BUILD-ID.txt` at repository root.
- Runtime assets are requested with `?v=4.4.0` cache-busting.
- `VERIFY-V4.4.ps1` confirms you copied the new build into the correct Git repository before committing.
