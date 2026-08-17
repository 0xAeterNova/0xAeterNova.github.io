# Publish 0xAeterNova Portfolio on GitHub Pages

## 1. Create the GitHub Pages repository

Create a **public** repository named exactly:

`0xAeterNova.github.io`

Keep the existing `0xAeterNova/0xAeterNova` repository as your GitHub profile README repository.

## 2. Upload this website

Extract the ZIP. Upload **the contents of this folder** to the root of `0xAeterNova.github.io`.

Correct:

```text
0xAeterNova.github.io/
├── index.html
├── projects.html
├── cybersecurity.html
├── about.html
├── contact.html
├── css/
├── js/
└── assets/
```

Wrong:

```text
0xAeterNova.github.io/
└── 0xAeterNova-portfolio-v2/
    └── index.html
```

## 3. Enable GitHub Pages

In the repository:

1. Open **Settings**.
2. Open **Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch **main**.
5. Select folder **/(root)**.
6. Save.

Your address will be:

`https://0xaeternova.github.io/`

## 4. Update projects later

The normal workflow is intentionally simple:

1. Edit `js/data.js`.
2. Commit the change.
3. GitHub Pages republishes automatically.

You do not make a new HTML file for each new project.

### Adding a fourth project

Copy a project object in `js/data.js`. Give it a unique `slug`.

For the 3D world, you have two choices:

- **Fast:** reuse `station: "sensor"`, `"ai"`, or `"bunker"`.
- **Custom:** create a new project station function in `js/world.js` and place it in the world.

## 5. Where to edit things

- `js/data.js` — projects, profile links, skills
- `js/world.js` — 3D world, rover, stations, camera, quality
- `js/main.js` — page routing, interactions, map, UI behavior
- `css/main.css` — visual design and responsive layout
- `assets/profile/profile-hero-dark.svg` — exact GitHub base hero

## 6. Custom domain later

If you later buy a domain, configure it in **Settings → Pages → Custom domain** after the GitHub Pages site is working normally.
