@echo off
cd /d "%~dp0"
echo.
echo 0xAeterNova // The Living Archive
echo -----------------------------------
echo Starting local server at http://localhost:8080
echo Press Ctrl+C to stop it.
echo.
where py >nul 2>nul && py -m http.server 8080 && goto :eof
where python >nul 2>nul && python -m http.server 8080 && goto :eof
echo Python was not found. Install Python 3 or use VS Code Live Server.
pause
