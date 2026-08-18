@echo off
setlocal
cd /d "%~dp0"
set "PORT=8080"
set "PYTHON_CMD="
where py >nul 2>&1 && set "PYTHON_CMD=py"
if not defined PYTHON_CMD where python >nul 2>&1 && set "PYTHON_CMD=python"
if not defined PYTHON_CMD (
  echo.
  echo [AeterNova] Python 3 was not found.
  echo Install Python 3 from python.org, then run this file again.
  echo.
  pause
  exit /b 1
)
echo.
echo =====================================================
echo  0xAeterNova // Transmission Machine V4.4 // DEEP SIGNAL
echo  Local WebGL2 engine - no CDN / no Three.js download
echo =====================================================
echo.
echo Starting: http://127.0.0.1:%PORT%/
start "AeterNova Portfolio Server" /min cmd /c "%PYTHON_CMD% -m http.server %PORT% --bind 127.0.0.1"
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:%PORT%/?v=4.4.0"
exit /b 0
