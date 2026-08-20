@echo off
echo ========================================================
echo [0xAeterNova] Initializing Local Transmission Nexus...
echo ========================================================
python -m http.server 8080 || npx serve -p 8080 .
pause
