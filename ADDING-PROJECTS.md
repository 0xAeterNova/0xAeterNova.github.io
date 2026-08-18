# Adding a project

Open `js/data.js` and add one object to the `projects` array.

```js
{
  slug: 'project-slug',
  name: 'Project Name',
  label: '04 / CATEGORY',
  tagline: 'One strong sentence.',
  summary: 'Short archive description.',
  long: 'Full project description.',
  year: '2026',
  status: 'Active development',
  role: 'Creator / Developer',
  stack: ['Python', 'C++', 'Three.js'],
  repository: 'https://github.com/0xAeterNova/project',
  poster: 'assets/projects/project.webp',
  realm: 'generic',
  accent: '#7cffc4'
}
```

Then put the poster image in `assets/projects/`.

The new project automatically gets:

- an Archive entry
- a search/command entry
- a `#/project/project-slug` route
- a reusable project information view
- a generated 3D artifact

## Give a flagship project a custom 3D machine

For major projects, add a builder in `js/world.js`, similar to `buildRuVigil`, `buildPhantom`, or `buildElif`, and route to it from `buildProject()`.

You still do not need a separate HTML page.
