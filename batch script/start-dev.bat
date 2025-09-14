@echo off
setlocal enabledelayedexpansion

echo RECETRA Development Server Manager
echo =================================

if "%1"=="web" goto :web
if "%1"=="mobile" goto :mobile
if "%1"=="both" goto :both
if "%1"=="stop" goto :stop
if "%1"=="status" goto :status

:status
echo.
echo Current Status:
netstat -an | findstr ":5173" >nul && echo Web Server: RUNNING (Port 5173) || echo Web Server: STOPPED
netstat -an | findstr ":8081" >nul && echo Mobile Server: RUNNING (Port 8081) || echo Mobile Server: STOPPED
echo.
echo Usage:
echo   start-dev.bat web      - Start web server only
echo   start-dev.bat mobile   - Start mobile server only
echo   start-dev.bat both     - Start both servers
echo   start-dev.bat stop     - Stop all servers
echo   start-dev.bat status   - Show server status
goto :end

:web
echo Starting Web Server...
echo Stopping any existing processes...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im npm.exe >nul 2>&1
timeout /t 2 /nobreak >nul
cd /d "C:\Users\Asus\Downloads\-RECETRA-\web"
start "Web Server" cmd /k "npm run dev"
echo Web Server starting at http://localhost:5173
goto :end

:mobile
echo Starting Mobile Server...
echo Stopping any existing processes...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im npm.exe >nul 2>&1
timeout /t 2 /nobreak >nul
cd /d "C:\Users\Asus\Downloads\-RECETRA-\mobile"
start "Mobile Server" cmd /k "npm start"
echo Mobile Server starting - Check Expo for QR code
goto :end

:both
echo Starting Both Servers...
echo Stopping any existing processes...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im npm.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo Starting Web Server...
cd /d "C:\Users\Asus\Downloads\-RECETRA-\web"
start "Web Server" cmd /k "npm run dev"
timeout /t 5 /nobreak >nul

echo Starting Mobile Server...
cd /d "C:\Users\Asus\Downloads\-RECETRA-\mobile"
start "Mobile Server" cmd /k "npm start"

echo Both servers are starting up!
echo Web Server: http://localhost:5173
echo Mobile Server: Check Expo for QR code
goto :end

:stop
echo Stopping all servers...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im npm.exe >nul 2>&1
echo All servers stopped!
goto :end

:end
echo.
pause

