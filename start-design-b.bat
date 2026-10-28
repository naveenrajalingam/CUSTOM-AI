@echo off
setlocal
title SupplyChainz Applied AI - Design B (Light Neomorphic Theme)

:: Navigate to script directory
cd /d "%~dp0"

echo ====================================================================
echo   SUPPLYCHAINZ INFOTECH -- APPLIED AI PROTOTYPE
echo   Version: DESIGN B (Corporate Enterprise - Light Neomorphic)
echo ====================================================================
echo.

:: Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is required to run the development server.
    echo Please install Node.js from https://nodejs.org/ and try again.
    echo.
    pause
    exit /b 1
)

echo Starting local server and opening Design B in your default browser...
echo.
echo   - Local URL: http://localhost:3000/design-b/
echo   - Press [Ctrl + C] in this window to stop the server when finished.
echo.

call npm run dev:b

if %errorlevel% neq 0 (
    echo.
    echo [INFO] Server process ended.
    pause
)
