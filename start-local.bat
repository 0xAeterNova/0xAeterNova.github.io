@echo off
setlocal
cd /d "%~dp0"
set PORT=8080
echo.
echo  0xAeterNova // Transmission Machine V5.0 // NIGHT CIRCUIT
echo  Local WebGL2 engine - no CDN
echo  Starting on http://127.0.0.1:%PORT%/?v=5.0.0
echo.
start "" /b python -m http.server %PORT% --bind 127.0.0.1
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:%PORT%/?v=5.0.0"
endlocal
