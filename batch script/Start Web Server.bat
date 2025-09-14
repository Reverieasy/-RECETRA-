@echo off
echo RECETRA - Starting Web Server
echo ==============================

cd /d "C:\Users\Asus\Downloads\-RECETRA-"

echo Stopping any existing processes...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im npm.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo Starting Web Server...
start "Web Server" cmd /k "cd web && npm run dev"

echo Web Server is starting up!
echo URL: http://localhost:5173
pause
