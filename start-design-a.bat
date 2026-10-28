@echo off
setlocal
title SupplyChainz Applied AI

:: Navigate to script directory
cd /d "%~dp0"

echo ====================================================================
echo   SUPPLYCHAINZ INFOTECH -- APPLIED AI
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

if not exist node_modules (
    echo Installing dependencies...
    call npm install
)

echo Starting local server and opening the site in your default browser...
echo.
echo   - Local URL: http://localhost:3000/
echo   - Press [Ctrl + C] in this window to stop the server when finished.
echo.

call npm run dev

if %errorlevel% neq 0 (
    echo.
    echo [INFO] Server process ended.
    pause
)
