#!/usr/bin/env sh
cd "$(dirname "$0")" || exit 1
PORT=8080
printf '\n0xAeterNova // Transmission Machine V4.2\nLocal WebGL2 engine - no CDN\nhttp://127.0.0.1:%s/\n\n' "$PORT"
python3 -m http.server "$PORT" --bind 127.0.0.1
