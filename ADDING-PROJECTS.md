# Adding Projects in V5.0

Edit `js/data.js` and add a new object to the `projects` array. Give it a unique `slug`, name, descriptions, stack, repository, poster path, accent and realm.

Place the project artwork in `assets/projects/`.

The project is then included automatically in:
- Project Archive
- Neon Atlas
- Spectral Search
- Project detail view
- Autopilot/search routing

Flagship projects can receive a custom 3D scene in `js/engine.js` by adding a realm-specific builder.
