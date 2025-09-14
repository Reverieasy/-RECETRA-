@echo off
echo Starting Web Server...
cd /d "%~dp0..\web"
npm run dev
pause
