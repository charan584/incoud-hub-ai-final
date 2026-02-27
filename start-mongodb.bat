@echo off
echo Checking MongoDB status...
echo.

sc query MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    echo MongoDB service found. Starting...
    net start MongoDB
) else (
    echo MongoDB service not found. Starting mongod manually...
    start "MongoDB" mongod --dbpath "C:\data\db"
)

echo.
echo MongoDB should be running now.
echo.
pause
