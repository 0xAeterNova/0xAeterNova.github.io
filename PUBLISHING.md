# Publish V4.4 to GitHub Pages

Use the repository `0xAeterNova.github.io`.

1. Extract the V4.4 ZIP.
2. Copy the **contents** of the extracted folder into the root of your local `0xAeterNova.github.io` repository. Do not copy the outer folder itself.
3. In PowerShell, from the repository root, run `./VERIFY-V4.4.ps1`.
4. Confirm `Get-Content .\BUILD-ID.txt` includes `VERSION: 4.4.0`.
5. Run `git status --short`. It must show changes unless V4.4 is already committed.
6. Run `git add -A`.
7. Run `git commit -m "Transmission Machine v4.4 Deep Signal"`.
8. Run `git push origin main`.
9. In GitHub: Settings → Pages → Deploy from a branch → main → /(root).
10. After deployment, hard refresh once (`Ctrl+Shift+R`). The site itself should show `BUILD 4.4 · DEEP SIGNAL`.

If `git status --short` is empty but `BUILD-ID.txt` is missing or says an older version, the new files are not in your repository root.
