#!/usr/bin/env bash
echo "========================================================"
echo "[0xAeterNova] Initializing Local Transmission Nexus..."
echo "========================================================"
python3 -m http.server 8080 || npx serve -p 8080 .
