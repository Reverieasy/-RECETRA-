@echo off
echo RECETRA - Starting Both Servers
echo ================================

cd /d "C:\Users\Asus\Downloads\-RECETRA-"

echo Stopping any existing processes...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im npm.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo Starting Web Server...
start "Web Server" cmd /k "cd web && npm run dev"
timeout /t 5 /nobreak >nul

echo Starting Mobile Server...
start "Mobile Server" cmd /k "cd mobile && npm start"

echo Both servers are starting up!
echo Web Server: http://localhost:5173
echo Mobile Server: Check Expo for QR code
pause
