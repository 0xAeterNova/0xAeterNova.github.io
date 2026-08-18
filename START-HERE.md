# Start here

1. Extract the folder.
2. Double-click `start-local.bat` on Windows, or run `./start-local.sh` on Linux/macOS.
3. Open `http://localhost:8080` if it does not open automatically.
4. Choose **ENTER WITH SOUND** for the intended experience. Browser audio requires a user interaction, which is why the site starts with an entry gate.
5. Use the mouse in empty 3D space to orbit. Use the wheel to move the camera depth.
6. Press `X` to explode/recompose the active machine.
7. Open projects from the Archive, map, 3D objects, or search palette.

## Editing your information

Almost all portfolio content is in `js/data.js`.

Do not edit `index.html` every time you add a project. Add the project to the `projects` array instead.

## Visual philosophy

The site has one persistent mechanical identity. Every section changes the geometry, palette, fog/exposure, sound and motion while keeping the same machine spine. This is what makes the experience coherent without forcing every section into one dark-blue theme.
