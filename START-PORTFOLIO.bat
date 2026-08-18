@echo off
setlocal
cd /d "%~dp0"
echo.
echo 0xAeterNova // Interface Zero V5
echo Starting local server at http://127.0.0.1:8080
echo.
where py >nul 2>nul
if %errorlevel%==0 (
  start "" cmd /c "timeout /t 2 >nul & start http://127.0.0.1:8080"
  py -m http.server 8080 --bind 127.0.0.1
  goto :eof
)
where python >nul 2>nul
if %errorlevel%==0 (
  start "" cmd /c "timeout /t 2 >nul & start http://127.0.0.1:8080"
  python -m http.server 8080 --bind 127.0.0.1
  goto :eof
)
echo Python was not found. You can still open index.html directly in Chrome/Edge because V5 has no external modules.
pause
