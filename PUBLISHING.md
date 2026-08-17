# Publish on GitHub Pages

## Recommended repository

Create a new public repository named exactly:

`0xAeterNova.github.io`

Do **not** replace the current `0xAeterNova/0xAeterNova` repository; that one is your GitHub profile README.

## Upload using the GitHub website

1. Open the new `0xAeterNova.github.io` repository.
2. Choose **Add file → Upload files**.
3. Upload the **contents of this portfolio folder**, not the outer folder itself.
4. The repository root should directly contain `index.html`, `projects.html`, `css/`, `js/`, `assets/`, etc.
5. Commit the files to `main`.
6. Go to **Settings → Pages**.
7. Under **Build and deployment**, choose **Deploy from a branch**.
8. Select branch **main** and folder **/(root)**, then Save.
9. Your site will be available at `https://0xaeternova.github.io/` after GitHub finishes the deployment.

## Upload using Git (recommended after the first publish)

From inside this portfolio folder:

```bash
git init
git add .
git commit -m "Launch portfolio"
git branch -M main
git remote add origin https://github.com/0xAeterNova/0xAeterNova.github.io.git
git push -u origin main
```

For future edits:

```bash
git add .
git commit -m "Update portfolio"
git push
```

## Where files go

- New project image → `assets/projects/`
- New project text/links/stack → `js/data.js`
- Global colors/layout → `css/styles.css`
- Home 3D scene → `js/three-scene.js`
- Social/profile links → `js/data.js` in `profile.links`

## Custom domain later

If you buy a domain later, add it in **Settings → Pages → Custom domain**, configure the DNS records requested by GitHub, then enable **Enforce HTTPS** when available.
