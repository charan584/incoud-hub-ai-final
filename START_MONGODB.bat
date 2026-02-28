@echo off
echo Starting MongoDB...
net start MongoDB
if %errorlevel% neq 0 (
    echo MongoDB service not found. Starting manually...
    start "" "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "C:\data\db"
)
echo MongoDB started!
pause
