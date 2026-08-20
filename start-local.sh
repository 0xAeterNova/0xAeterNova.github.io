#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
PORT=${PORT:-8080}
printf '\n0xAeterNova // Transmission Machine V5.0 // NIGHT CIRCUIT\nLocal WebGL2 engine - no CDN\nhttp://127.0.0.1:%s/?v=5.0.0\n\n' "$PORT"
python3 -m http.server "$PORT" --bind 127.0.0.1
