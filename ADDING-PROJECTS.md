# Adding projects

Open `js/data.js` and add another object inside the `projects` array.

```js
{
  slug: 'new-project',
  name: 'New Project',
  label: '04 / CATEGORY',
  tagline: 'One strong sentence.',
  summary: 'Short archive description.',
  long: 'Full project description for the project realm.',
  year: '2026',
  status: 'Active development',
  role: 'Developer',
  stack: ['Python', 'C++', 'ROS'],
  repository: 'https://github.com/0xAeterNova/new-project',
  poster: 'assets/projects/new-project.svg',
  realm: 'generic',
  accent: '#ff7a4d'
}
```

Then add the project artwork to:

`assets/projects/new-project.svg`

You can use PNG, JPG, WEBP or SVG; simply update the `poster` path.

## What appears automatically

Once the object exists in `projects`:

- the Project Archive UI gets a new entry
- the command palette can find it
- a route is created at `#/project/new-project`
- the project detail panel is generated automatically
- the world engine creates a new project destination automatically
- it receives a generic animated 3D artifact if it does not have a custom realm

## Giving a major project its own custom 3D realm

The three existing signature realms are implemented in `js/world.js`:

- `buildRuVigil()`
- `buildPhantom()`
- `buildElif()`

For another signature project:

1. Add a new `realm` value in its project object, for example `realm: 'aeterbot'`.
2. Create `buildAeterBot(project)` in `js/world.js`.
3. Add one branch inside `buildProjectWorlds()`.
4. Optionally add a custom camera/palette preset inside `routeSettings()`.

Everything else stays data-driven.
