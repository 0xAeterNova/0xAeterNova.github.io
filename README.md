# 0xAeterNova Portfolio

A lightweight multi-page portfolio for **0xAeterNova**, matching the dark purple/cyan/emerald profile theme and adding an interactive Three.js hero.

## Pages

- `index.html` — home + interactive 3D hero
- `projects.html` — automatically renders all projects
- `project.html?project=ruvigil` — reusable project detail page
- `cybersecurity.html` — CTF/security profile
- `about.html` — profile and skills
- `contact.html` — social/contact links

## Add a project

Open `js/data.js`, find `export const projects = [...]`, copy one project object and edit it:

```js
{
  slug: "my-new-project",
  name: "My New Project",
  kicker: "Robotics / AI",
  year: "2026",
  featured: true,
  status: "Active",
  summary: "One short sentence.",
  description: "A fuller explanation.",
  contribution: "What you personally did.",
  stack: ["Python", "ROS", "C++"],
  image: "assets/projects/my-new-project.webp",
  repository: "https://github.com/0xAeterNova/..."
}
```

Then put the image in `assets/projects/`. That is all. The project will appear on `projects.html`; if `featured: true`, it also appears on the home page.

## 3D performance

The hero uses Three.js primitives only: no GLB model, physics engine, large textures, or video background. It automatically reduces particle count and pixel ratio on phones / lower-memory devices. Visitors can choose Auto, High, or Low quality. `prefers-reduced-motion` disables WebGL and shows a CSS fallback.

## Local preview

Because the site uses JavaScript modules, do not double-click `index.html`. Run a tiny local server from this folder:

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

## Publish

See `PUBLISHING.md`.
