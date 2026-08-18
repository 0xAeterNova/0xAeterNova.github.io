# Publish to GitHub Pages

## 1. Repository

Create a public repository named exactly:

`0xAeterNova.github.io`

Keep your existing `0xAeterNova/0xAeterNova` repository for your GitHub profile README.

## 2. Upload

Upload the **contents** of this V5 folder to the root of `0xAeterNova.github.io`.

Correct:

- `index.html`
- `css/`
- `js/`
- `assets/`
- `.nojekyll`

Do not upload an extra outer folder around those files.

## 3. GitHub Pages

Repository → Settings → Pages → Build and deployment:

- Source: Deploy from a branch
- Branch: `main`
- Folder: `/(root)`

The site will be served from `https://0xaeternova.github.io/`.

## 4. Why V5 is safer to deploy

All runtime code and the soundtrack are stored in the repository. WebGL no longer depends on a CDN being reachable from the visitor's network.
