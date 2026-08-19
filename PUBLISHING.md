# Publish V5.0 to GitHub Pages

Copy the **contents** of this folder into the root of your `0xAeterNova.github.io` repository.

Before committing, verify:

```powershell
Get-Content .\BUILD-ID.txt
git status --short
```

`BUILD-ID.txt` must show `VERSION: 5.0.0` and `CODENAME: NIGHT-CIRCUIT`.

Then:

```powershell
git add -A
git commit -m "Transmission Machine v5.0 Night Circuit"
git push origin main
```

GitHub: **Settings → Pages → Deploy from a branch → main → /(root)**.

After deployment, hard refresh (`Ctrl+Shift+R`). The bottom build badge must read `BUILD 5.0 · NIGHT CIRCUIT`.
