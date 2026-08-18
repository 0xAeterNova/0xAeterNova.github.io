@echo off
cd /d "%~dp0"
echo.
echo  0xAeterNova // The Impossible Machine

echo  Starting local server at http://localhost:8080
start "" http://localhost:8080
py -m http.server 8080 2>nul || python -m http.server 8080
pause
