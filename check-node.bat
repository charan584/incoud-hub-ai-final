@echo off
echo Checking Node.js installation...
echo.

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is NOT installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Download the LTS version and install it.
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node --version
echo.

where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is NOT installed!
    pause
    exit /b 1
)

echo [OK] npm is installed
npm --version
echo.
echo Everything is ready! You can now run install.bat
echo.
pause
