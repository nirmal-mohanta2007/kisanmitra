@echo off
title Kisan Mitra - Operator Dashboard (Web Mode)
cd /d "%~dp0KISAN MITRA"
echo ========================================================
echo  Kisan Mitra - Operator Dashboard (Web Browser Mode)
echo  No Expo Go required. Opens directly in browser.
echo ========================================================
echo.
call npx.cmd expo start --web
pause
