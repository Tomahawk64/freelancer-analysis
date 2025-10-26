@echo off
echo Starting Freelancer Analytics Dashboard...
echo.

echo [1/2] Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo [2/2] Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ Servers are starting!
echo Backend: http://localhost:4000
echo Frontend: http://localhost:3000
echo.
echo Note: If this is your first time, run the seed script!
echo Run: cd backend && npm run seed
echo.
pause
