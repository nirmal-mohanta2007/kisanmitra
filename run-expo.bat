@echo off
title Kisan Mitra - Expo Dev Server (SDK 54)
cd /d "%~dp0"
echo ========================================================
echo Starting Kisan Mitra on Expo SDK 54 (Expo Go v54.0.8)
echo ========================================================
echo.
call npx.cmd expo start --go --lan
pause
