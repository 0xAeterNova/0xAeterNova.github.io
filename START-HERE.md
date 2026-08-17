# 0xAeterNova — The Living Archive

This build is a complete restart. It is a single persistent 3D universe, not a normal multi-page template.

## Run it locally

### Windows
Double-click `start-local.bat`, then open:

`http://localhost:8080`

### Linux / macOS
Run:

```bash
chmod +x start-local.sh
./start-local.sh
```

Then open `http://localhost:8080`.

> The portfolio intentionally loads Three.js r185 from jsDelivr. You need an internet connection while previewing it locally.

## Controls

- Mouse / pointer: reactive scene movement
- Drag empty 3D space: orbit the active realm
- Mouse wheel: change camera depth
- `M`: open the realm map
- `/`: open the command palette
- `1`–`5`: jump directly between main realms
- `Q`: toggle High / Low rendering mode
- Sound icon: enable optional procedural WebAudio ambience
- Click a 3D project monolith: enter its project realm

## The only file you normally edit

`js/data.js`

That file contains:

- your name and links
- featured projects
- project technologies
- project descriptions
- skills
- achievements
- realm metadata

See `ADDING-PROJECTS.md` for the exact project workflow.
