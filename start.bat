@echo off
echo Starting Incloudhub AI...
echo.
echo Frontend will start on: http://localhost:3000
echo Backend will start on: http://localhost:5000
echo.
echo Press Ctrl+C to stop
echo.

start "Incloudhub Backend" cmd /k "cd server && npm start"
timeout /t 3 /nobreak >nul
start "Incloudhub Frontend" cmd /k "npm start"

echo.
echo Both servers are starting in separate windows...
echo.
pause
