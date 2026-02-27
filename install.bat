@echo off
echo Installing Incloudhub AI Dependencies...
echo.

echo [1/4] Installing frontend dependencies...
call npm install

echo.
echo [2/4] Installing server dependencies...
cd server
call npm install
cd ..

echo.
echo [3/4] Installation complete!
echo.
echo To start the application:
echo   Frontend: npm start
echo   Backend:  cd server && npm start
echo.
pause
