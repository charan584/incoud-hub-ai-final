@echo off
echo ========================================
echo   INCLOUDHUB AI - LAUNCHING
echo ========================================
echo.

echo [1/2] Starting Backend Server...
start "Backend - Port 5000" cmd /k "cd server && npm start"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend...
start "Frontend - Port 3000" cmd /k "npm start"

echo.
echo ========================================
echo   SERVERS STARTED!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Browser will open automatically...
echo.
echo Press any key to close this window
pause >nul
