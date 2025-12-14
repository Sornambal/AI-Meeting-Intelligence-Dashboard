@echo off
REM Meeting Action Extractor - Setup Script for Windows

echo.
echo ============================================
echo Meeting Action Extractor - Backend Setup
echo ============================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.11+ from python.org
    pause
    exit /b 1
)

REM Check if PostgreSQL is available
psql --version >nul 2>&1
if errorlevel 1 (
    echo Warning: PostgreSQL is not in PATH
    echo You can use Docker instead: docker run --name meeting-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=meeting_extractor -p 5432:5432 -d postgres:15-alpine
    echo.
)

REM Check if backend directory exists
if not exist "backend" (
    echo Error: backend directory not found
    pause
    exit /b 1
)

echo Step 1: Installing Python dependencies...
cd backend
pip install -r requirements.txt
if errorlevel 1 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Step 2: Creating .env file...
if not exist ".env" (
    copy .env.example .env
    echo Created .env file - Please edit it with your Groq API key
    echo.
    echo Edit the following in backend/.env:
    echo - GROQ_API_KEY=your-groq-api-key-from-console.groq.com
    echo - DATABASE_URL=postgresql://postgres:postgres@localhost:5432/meeting_extractor
    echo.
    pause
)

echo.
echo Step 3: Starting PostgreSQL with Docker...
docker ps | findstr "meeting-db" >nul 2>&1
if errorlevel 1 (
    echo Starting PostgreSQL container...
    docker run --name meeting-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=meeting_extractor -p 5432:5432 -d postgres:15-alpine
    echo PostgreSQL started
    timeout /t 3
) else (
    echo PostgreSQL already running
)

echo.
echo Step 4: Starting Backend Server...
echo Backend will start at http://localhost:8000
echo API Documentation at http://localhost:8000/docs
echo.

python main.py

pause
