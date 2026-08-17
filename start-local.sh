#!/usr/bin/env sh
cd "$(dirname "$0")" || exit 1
echo "0xAeterNova // The Living Archive"
echo "Starting http://localhost:8080"
python3 -m http.server 8080
