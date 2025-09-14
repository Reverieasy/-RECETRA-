@echo off
echo Starting Both Servers...
echo.
echo Starting Web Server...
start "Web Server" cmd /k "cd /d \"%~dp0..\web\" && npm run dev"
timeout /t 3 /nobreak >nul
echo.
echo Starting Mobile Server...
start "Mobile Server" cmd /k "cd /d \"%~dp0..\mobile\" && npm start"
echo.
echo Both servers are starting!
echo Web Server: http://localhost:5173
echo Mobile Server: Check Expo for QR code
pause
