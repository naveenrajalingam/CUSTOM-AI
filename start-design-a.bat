@echo off
setlocal
title SupplyChainz Applied AI - Design A (Dark Theme)

:: Navigate to script directory
cd /d "%~dp0"

echo ====================================================================
echo   SUPPLYCHAINZ INFOTECH -- APPLIED AI PROTOTYPE
echo   Version: DESIGN A (Modern Dark AI Innovation)
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

echo Starting local server and opening Design A in your default browser...
echo.
echo   - Local URL: http://localhost:3000/
echo   - Press [Ctrl + C] in this window to stop the server when finished.
echo.

call npm run dev:a

if %errorlevel% neq 0 (
    echo.
    echo [INFO] Server process ended.
    pause
)
