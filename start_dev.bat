@echo off
echo Starting AICTE College Management System...

cd backend
if not exist .env (
    echo Creating .env from .env.example...
    copy .env.example .env
)
cd ..

echo Building and starting containers...
docker compose up --build -d

echo.
echo Application started!
echo Frontend: http://localhost:3006
echo Backend: http://localhost:8006/docs
echo.
pause
