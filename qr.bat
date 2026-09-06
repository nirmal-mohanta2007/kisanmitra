@echo off
title Kisan Mitra - Terminal QR Code
cd /d "%~dp0"
call node scripts\show-qr.js
pause
