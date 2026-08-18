# AeterNova Transmission Machine V4.4 — DEEP SIGNAL

This version keeps the V4 transmission-machine art direction and the soundtrack you approved, while substantially changing the background, UFO system, cursor, Engineering X-Ray, Signal Atlas, Spectral Search, About, and performance engine.

## 1. Test locally

On Windows, double-click `START-PORTFOLIO.bat` and use the browser page it opens.

You should see a small build marker reading **BUILD 4.4 · DEEP SIGNAL**. If you do not see that marker, you are not running V4.4.

## 2. Controls

- Drag: orbit camera
- Mouse wheel: camera depth
- `X`: Engineering X-Ray / reassemble
- `M`: Signal Atlas
- `/`: Spectral Search
- `R`: reset camera
- Autopilot button: cinematic guided sequence

## 3. What Engineering X-Ray does

It is an inspection mode, not an explosion. The active machine separates into architectural layers, the camera pulls back, and the pieces gain controlled rotational drift. Press X again to reassemble.


## Fastest install into your current repository

From the extracted V4.4 folder, you can run `./INSTALL-V4.4.ps1`. It defaults to `C:\Users\Xpl0iS4n\Desktop\0xAeterNova.github.io`, preserves `.git`, copies the runtime files, removes the old About heatmap folder, and immediately prints `git status --short`.

## 4. Copy V4.4 to GitHub Pages correctly

Your repository root must directly contain `index.html`, `BUILD-ID.txt`, `css`, `js`, and `assets`.

After copying the **contents** of this V4.4 folder into your repository, open PowerShell in the repository root and run:

`./VERIFY-V4.4.ps1`

It must report `VERSION: 4.4.0` and `Required V4.4 runtime files: OK`.

Then run `git status --short`. Before your first V4.4 commit, Git should show modified runtime files and the new `BUILD-ID.txt` / verifier unless you have already committed the build.

## 5. If Git says `nothing to commit`

First run `Get-Content .\BUILD-ID.txt`. If it does not say `VERSION: 4.4.0`, you copied the build somewhere other than the repository root. If it does say 4.4.0, run `git log -1 --oneline`; V4.4 may already be committed.

## 6. Browser cache

V4.4 cache-busts the main CSS/JS automatically. After GitHub Pages deploys, still use `Ctrl+Shift+R` once or open a private window if you had the old site open for a long time.
