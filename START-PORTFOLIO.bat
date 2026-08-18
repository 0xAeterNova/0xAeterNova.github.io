@echo off
setlocal
cd /d "%~dp0"
set "PORT=8080"
set "PYTHON_CMD="
where py >nul 2>&1 && set "PYTHON_CMD=py"
if not defined PYTHON_CMD where python >nul 2>&1 && set "PYTHON_CMD=python"
if not defined PYTHON_CMD (
  echo.
  echo [AeterNova] Python was not found.
  echo Install Python 3, then run this file again.
  echo.
  pause
  exit /b 1
)
echo.
echo  0xAeterNova // The Impossible Machine V4.1
echo  Starting server on http://127.0.0.1:%PORT%/
echo.
start "AeterNova Local Server" /min cmd /c "%PYTHON_CMD% -m http.server %PORT% --bind 127.0.0.1"
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:%PORT%/"
exit /b 0
