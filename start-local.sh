#!/usr/bin/env sh
cd "$(dirname "$0")"
printf '\n0xAeterNova // The Impossible Machine\nhttp://localhost:8080\n\n'
python3 -m http.server 8080
