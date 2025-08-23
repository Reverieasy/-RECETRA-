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
cd web
start "Web Server" cmd /k "npm run dev"
cd ..
goto :end

:mobile
echo Starting Mobile Server...
cd mobile
start "Mobile Server" cmd /k "npm start"
cd ..
goto :end

:both
echo Starting Both Servers...
cd web
start "Web Server" cmd /k "npm run dev"
cd ..
timeout /t 3 /nobreak >nul
cd mobile
start "Mobile Server" cmd /k "npm start"
cd ..
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

