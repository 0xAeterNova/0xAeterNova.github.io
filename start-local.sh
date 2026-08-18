#!/usr/bin/env sh
cd "$(dirname "$0")" || exit 1
PORT=8080
printf '\n0xAeterNova // Transmission Machine V4.4 // DEEP SIGNAL\nLocal WebGL2 engine - no CDN\nhttp://127.0.0.1:%s/?v=4.4.0\n\n' "$PORT"
python3 -m http.server "$PORT" --bind 127.0.0.1
