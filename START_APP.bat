@echo off
echo ========================================
echo   Incloudhub AI - Starting Application
echo ========================================
echo.

echo [1/3] Checking MongoDB...
net start MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ MongoDB is running
) else (
    echo ! MongoDB service not found, starting manually...
    start "MongoDB" "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "C:\data\db"
    timeout /t 3 >nul
)

echo.
echo [2/3] Starting Backend Server...
start "Backend Server" cmd /k "cd server && npm start"
timeout /t 5 >nul

echo.
echo [3/3] Starting Frontend...
start "Frontend" cmd /k "npm start"

echo.
echo ========================================
echo   Application Started!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window...
pause >nul
