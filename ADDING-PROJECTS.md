# Adding a project

Open `js/data.js` and add another object inside `projects`.

Use a unique `slug`, for example `aeterbot`, and put its artwork in `assets/projects/`.

The interface automatically adds the project to:

- Archive
- search
- project detail view
- 3D Archive constellation
- 3D Signal Map

Projects with `realm: 'ruvigil'`, `realm: 'phantom'`, or `realm: 'elif'` use the three custom flagship worlds. Any other realm receives a generic spatial artifact automatically.

For a new flagship project with its own unique 3D world, add a new builder in `js/engine.js` and route it from `buildProject()`.
