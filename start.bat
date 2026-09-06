@echo off
title Kisan Mitra - Expo Go SDK 54 Launcher
cd /d "%~dp0"

echo ====================================================================
echo   Checking Node.js and npx environment for Kisan Mitra (SDK 54)...
echo ====================================================================

REM 1. Add common Node.js install paths to PATH if missing
set "PATH=C:\Program Files\nodejs;C:\Program Files (x86)\nodejs;%APPDATA%\npm;%LOCALAPPDATA%\Programs\node;%PATH%"

REM 2. Verify node
where node >nul 2>nul
if errorlevel 1 (
    echo.
    echo [ERROR] Node.js is not found on your system!
    echo.
    echo Please install Node.js (LTS):
    echo 1. Download from: https://nodejs.org
    echo    OR
    echo 2. Run in PowerShell: winget install OpenJS.NodeJS.LTS
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js found:
call node -v
echo [OK] npx found:
call npx.cmd -v 2>nul || call npx -v

REM 3. Check if node_modules exists
if not exist "node_modules\" (
    echo.
    echo [INFO] First-time setup: Installing dependencies (npm install)...
    echo Please wait 1-2 minutes...
    call npm.cmd install || call npm install
)

echo.
echo ====================================================================
echo   Starting Expo Dev Server (SDK 54 with Expo Go QR Code)...
echo ====================================================================
echo.
call npx.cmd expo start --go --lan || call npx expo start --go --lan
pause
