@echo off
color 0A
title Kisan Mitra - Codebase Bug and Diagnostics Scanner
echo ========================================================
echo   KISAN MITRA - BUG AND HEALTH CHECK SCANNER
echo ========================================================
echo.

echo [1/2] Running TypeScript Compile and Bug Check (tsc --noEmit)...
echo --------------------------------------------------------
call npm.cmd run typecheck
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo [ERROR] Bugs or type errors detected above! Please review the files and line numbers.
    echo.
    pause
    exit /b %errorlevel%
) else (
    echo [SUCCESS] 0 TypeScript bugs found! All types and syntax are clean.
)

echo.
echo [2/2] Running Project Diagnostics and Dependency Audit...
echo --------------------------------------------------------
call npx.cmd expo-doctor
echo.

echo ========================================================
echo   DIAGNOSTICS COMPLETE
echo ========================================================
pause
