@echo off
echo ========================================
echo   INCLOUDHUB AI - DIAGNOSTICS
echo ========================================
echo.

echo [1/4] Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found!
    pause
    exit /b 1
)
echo OK
echo.

echo [2/4] Checking MongoDB...
mongod --version
if %errorlevel% neq 0 (
    echo ERROR: MongoDB not installed!
    pause
    exit /b 1
)
echo OK
echo.

echo [3/4] Testing Backend Connection...
cd server
echo Starting backend test...
timeout /t 2 /nobreak >nul
curl http://localhost:5000 2>nul
if %errorlevel% neq 0 (
    echo WARNING: Backend not running. Starting it now...
    start "Backend Test" cmd /k "npm start"
    timeout /t 5 /nobreak >nul
)
cd ..
echo.

echo [4/4] Checking MongoDB Connection...
echo Attempting to connect to mongodb://localhost:27017/incloudhub
mongosh --eval "db.adminCommand('ping')" 2>nul
if %errorlevel% neq 0 (
    echo WARNING: MongoDB not running. Starting it...
    start "MongoDB" mongod
    timeout /t 3 /nobreak >nul
)
echo.

echo ========================================
echo   DIAGNOSTIC COMPLETE
echo ========================================
echo.
echo If all checks passed, run RUN.bat
echo.
pause
