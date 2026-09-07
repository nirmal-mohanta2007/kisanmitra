@echo off
title Push Kisan Mitra to GitHub
cd /d "%~dp0"

echo ====================================================================
echo   Preparing to Push Kisan Mitra to GitHub
echo ====================================================================

REM Add standard Git paths to PATH if missing
set "PATH=C:\Program Files\Git\cmd;C:\Program Files\Git\bin;C:\Program Files (x86)\Git\cmd;%LOCALAPPDATA%\Programs\Git\cmd;%PATH%"

REM Check if git is available
where git >nul 2>nul
if errorlevel 1 (
    echo.
    echo [ERROR] Git is not found in PATH!
    echo Please make sure Git for Windows is installed from: https://git-scm.com/
    echo.
    pause
    exit /b 1
)

echo [OK] Git found:
call git --version
echo.

echo Staging modified files...
call git add .

echo.
echo Committing changes...
call git commit -m "feat: live procurement dashboard and mandi officer 9348856994 configuration"

echo.
echo Pushing to GitHub (origin)...
call git push origin HEAD

if errorlevel 1 (
    echo.
    echo [WARNING] Direct push failed or branch requires explicit upstream. Trying: git push origin Sibani...
    call git push -u origin Sibani
)

echo.
echo ====================================================================
echo   Git Push Process Completed!
echo ====================================================================
pause
