@echo off
cd /d "C:\Users\Asus\Desktop\RECETRA_"
start "Web Server" cmd /k "cd web && npm run dev"
timeout /t 3 /nobreak >nul
start "Mobile Server" cmd /k "cd mobile && npm start"
