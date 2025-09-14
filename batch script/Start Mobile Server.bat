@echo off
echo RECETRA - Starting Mobile Server
echo ==================================

cd /d "C:\Users\Asus\Downloads\-RECETRA-"

echo Stopping any existing processes...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im npm.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo Starting Mobile Server...
start "Mobile Server" cmd /k "cd mobile && npm start"

echo Mobile Server is starting up!
echo Check Expo for QR code to scan with your phone
pause
