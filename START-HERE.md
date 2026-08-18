# 0xAeterNova // The Impossible Machine V4.1

## Windows — recommended

Do **not** double-click `index.html`.

Double-click:

`START-PORTFOLIO.bat`

It starts a local web server first and then opens:

`http://127.0.0.1:8080/`

The server is required because the portfolio uses JavaScript modules and a WebGL 3D engine.

## What V4.1 fixes

- Entry buttons are attached before the 3D engine starts.
- A Three.js/CDN/WebGL failure can no longer freeze the opening screen.
- Audio failure can no longer block entry.
- The UI continues in a safe animated visual mode if the 3D libraries cannot load.
- The 3D loader tries the primary Three.js source and then a second mirror.
- If `index.html` is opened directly as a local file, the boot screen now explains the problem instead of appearing dead.
- `START-PORTFOLIO.bat` starts the server before opening the browser, fixing the old startup race.

## Controls

- Drag: orbit
- Mouse wheel: depth
- X: exploded machine view
- M: system map
- /: search
- F: focus mode
- R: reset camera
- 1–5: main sections

## Edit content

Projects and profile content live in:

`js/data.js`

Do not edit the 3D engine just to add a normal new project.
