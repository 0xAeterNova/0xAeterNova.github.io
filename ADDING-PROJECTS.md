# Adding a project

Most portfolio content lives in `js/data.js`.

Add another object inside `AETER_DATA.projects` using a unique `slug`, project name, description, stack, repository URL and palette.

The Project Archive list, search system and data-driven project detail screen are generated from that file.

For the project artwork, create:

`assets/projects/YOUR-SLUG.svg`

For a major project that deserves a custom 3D environment, add a scene branch inside `buildProject()` in `js/engine.js`. Existing visual languages are:

- `rf` — sensing / distributed hardware.
- `neural` — AI / computer vision / neural networks.
- `forge` — Linux / systems / low-level tooling.

You can also invent a new scene type without changing the UI system.

## Important

The project object is the single source of truth for the visible text. Do not duplicate the project description across multiple HTML pages.
