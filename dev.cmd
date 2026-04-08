@echo off
cd /d "%~dp0"
if not exist "node_modules\" (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 exit /b 1
)
echo.
echo  Elevate Interns
echo  Open in browser:  http://127.0.0.1:3333
echo  Stop server:      Ctrl+C
echo.
call npm run dev
