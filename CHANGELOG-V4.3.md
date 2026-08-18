# V4.3 — Transmission Ascendancy

## World / background

- Rebuilt the procedural background shader with layered nebula/aurora motion, transmission lanes, radial filaments, horizon grid, futuristic skyline and animated beacons.
- Added route-aware UFO fleets to every realm, including denser traffic in Signal Atlas and Search.
- UFOs have orbit paths, wobble, canopy/ring/beam geometry and realm-matched emissive palettes.
- UFO traffic remains coherent during machine disassembly so the environment still reads as a living world.

## DISASSEMBLE X

- Replaced the old unclear/instant explode toggle.
- `X` now smoothly releases machine layers outward with rotational drift.
- Button clearly changes from `DISASSEMBLE X` to `REASSEMBLE X`.
- Added a contextual X-MODE HUD explaining how to inspect and restore the machine.

## Signal Atlas

- Rebuilt map geometry as a real 3D transmission lattice with depth.
- Added focus-lock highlighting and connected-path isolation.
- Added projected-label collision avoidance and viewport clamping.
- Added reticle, coordinate readout, route metadata and transit-craft legend.

## Spectral Search Array

- Replaced the large search list with a compact three-result acquisition console.
- Search updates the physical 3D signal field and highlights the selected target.
- Added signal-strength segments, animated spectrum and scanner-orbit treatment.

## About

- Removed **GITHUB ACTIVITY FIELD** completely.
- Removed skill percentages / progress bars.
- Added grouped capability clusters and an identity-signature system.
- Rebuilt the About 3D state around intertwined helixes and skill-orbit objects.
- Preserved the original GitHub profile hero artwork.

## Cursor

- New scanning-instrument cursor with crosshair, dual orbit rings, SCAN/LOCK state and inertial trail.
- Trail is reduced automatically in low-performance mode and disabled on touch/mobile layouts.

## Performance

- Cached WebGL uniform locations instead of resolving them per object per frame.
- Added measured-FPS adaptive render scale.
- Added adaptive GPU particle draw ratio.
- Added adaptive bloom pass count.
- Added CSS companion low-performance mode to reduce expensive blur, film, scan and cursor-trail effects.
- Quality recovers automatically when sustained frame rate improves.

## Layout

- Added stricter safe-area rules for the information lens, top controls, mobile panels and overlays.
- Added map-label collision handling.
- Browser-audited desktop/mobile static layouts for Home, About, Atlas and Search.

## Audio

- **Soundtrack unchanged from V4.2 by request.**
