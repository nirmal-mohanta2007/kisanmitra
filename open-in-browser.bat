@echo off
title Kisan Mitra - Run in Browser
cd /d "%~dp0"

echo ====================================================================
echo             🌾 KISAN MITRA - WEB BROWSER LAUNCHER
echo ====================================================================
echo.
echo  [1] Live Cloud Web App (GitHub Pages - No setup required):
echo      https://nirmal-mohanta2007.github.io/kisanmitra/
echo.
echo  [2] Local Development Server:
echo      http://localhost:8081
echo.
echo ====================================================================
echo.
echo  Press [1] to open the Live Cloud Web App in your browser (Recommended)
echo  Press [2] to start the Local Development Web Server (Metro Bundler)
echo  Press [3] to open the QR Code / Connection Portal
echo  Press [4] to open the Web Browser Camera QR Scanner Tool
echo  Press any other key to exit.
echo.
choice /c 12345 /n /m "Choose an option (1, 2, 3, 4): "

if errorlevel 4 goto scanner
if errorlevel 3 goto portal
if errorlevel 2 goto local
if errorlevel 1 goto cloud

:cloud
echo.
echo Opening Live Web App in your default browser...
start "" "https://nirmal-mohanta2007.github.io/kisanmitra/"
goto done

:local
echo.
echo Starting Local Web Server...
if exist "KISAN MITRA\package.json" (
    cd "KISAN MITRA"
)
call npx.cmd expo start --web
goto done

:portal
echo.
echo Opening Visual QR / Web Portal...
if exist "expo-qr-viewer.html" (
    start "" "expo-qr-viewer.html"
) else (
    start "" "https://nirmal-mohanta2007.github.io/kisanmitra/"
)
goto done

:scanner
echo.
echo Opening Web Browser Camera QR Scanner...
if exist "web-scanner.html" (
    start "" "web-scanner.html"
) else (
    start "" "KISAN MITRA\web-scanner.html"
)
goto done

:done
echo.
echo Done!
pause
