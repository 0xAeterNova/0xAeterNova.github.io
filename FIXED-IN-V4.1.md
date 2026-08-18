# Startup hotfix

The original V4 created the Three.js world at module startup, before any click handlers were attached. If the CDN, WebGL context, post-processing module, browser module policy, or GPU initialization failed, JavaScript execution stopped and the two ENTER buttons had no listeners.

V4.1 changes the startup order:

1. Plain bootstrap script attaches to the ENTER buttons immediately.
2. Core interface/data/audio module starts independently of Three.js.
3. A safe animated renderer starts first.
4. The Three.js engine loads asynchronously.
5. If the primary source fails, a second source is tried.
6. If both fail, the whole portfolio remains navigable in safe visual mode.
7. Audio errors are caught independently and never trap the user on the boot screen.
