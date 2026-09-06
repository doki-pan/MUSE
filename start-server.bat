@echo off
echo Stopping old server...
taskkill /F /IM node.exe 2>nul

echo Starting MUSE server...
cd /d "%~dp0"
start "MUSE Server" node server.js

timeout /t 2 >nul

echo.
echo ========================================
echo   MUSE Server Started!
echo ========================================
echo.
echo   Open in browser:
echo   http://127.0.0.1:4173
echo.
echo   Press any key to stop the server...
echo ========================================
pause >nul

echo Stopping server...
taskkill /F /IM node.exe 2>nul
