@echo off
title Kisan Mitra - Expo Go SDK 54 (v54.0.8) QR Code
cd /d "%~dp0"

echo ====================================================================
echo   KISAN MITRA - EXPO GO SDK 54 (Client v54.0.8) QR LAUNCHER
echo ====================================================================
echo.
echo [1/3] Generating and displaying Terminal QR Codes...
echo.
if exist "scripts\show-qr.js" (
    call node scripts\show-qr.js
) else if exist "show-qr.js" (
    call node show-qr.js
)

echo.
echo [2/3] Opening Visual QR Code Viewer in default browser...
if exist "expo-qr-viewer.html" (
    start "" "expo-qr-viewer.html"
) else if exist "..\expo-qr-viewer.html" (
    start "" "..\expo-qr-viewer.html"
)

echo.
echo ====================================================================
echo   QR Codes are generated and active above!
echo   Scan the Dev Server QR with Expo Go v54.0.8 on your phone.
echo.
echo   Press any key to start the Expo Dev Server (Metro Bundler)...
echo   Or press Ctrl+C to exit if you only wanted the QR codes.
echo ====================================================================
pause

echo.
echo [3/3] Starting Expo Dev Server (SDK 54 with Expo Go)...
echo.
call npx.cmd -y expo start --go --lan
if errorlevel 1 (
    echo.
    echo Retrying with standard expo start...
    call npx.cmd -y expo start --go
)
pause
