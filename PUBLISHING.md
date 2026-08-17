# Publish on GitHub Pages

## 1. Create the website repository

Create a new public repository named exactly:

`0xAeterNova.github.io`

Keep your existing `0xAeterNova/0xAeterNova` repository as your GitHub profile README. Do not replace it with this project.

## 2. Upload this project's CONTENTS

Your repository root should look like this:

```text
0xAeterNova.github.io/
├── index.html
├── 404.html
├── projects.html
├── cyber.html
├── about.html
├── contact.html
├── css/
├── js/
├── assets/
├── .nojekyll
└── ...documentation files
```

Do not upload an extra outer folder around these files.

## 3. Enable Pages

GitHub repository → `Settings` → `Pages`

Choose:

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/(root)`

Save.

The site will be available at:

`https://0xaeternova.github.io/`

## 4. Update it later

Edit `js/data.js` and add project images under `assets/projects/`, commit, and push. GitHub Pages redeploys automatically.

## Optional custom domain

When you buy a domain later, add it under GitHub `Settings → Pages → Custom domain`, then follow GitHub's DNS instructions.
