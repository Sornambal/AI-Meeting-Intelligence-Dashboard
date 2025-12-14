#!/bin/bash

# Meeting Action Extractor - Setup Script for Linux/Mac

echo ""
echo "============================================"
echo "Meeting Action Extractor - Backend Setup"
echo "============================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed"
    echo "Please install Python 3.11+ from python.org"
    exit 1
fi

# Check Python version
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "Python version: $python_version"

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "Error: backend directory not found"
    exit 1
fi

echo ""
echo "Step 1: Installing Python dependencies..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    python3 -m venv venv
    source venv/bin/activate
else
    source venv/bin/activate
fi

pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "Error: Failed to install dependencies"
    exit 1
fi

echo ""
echo "Step 2: Creating .env file..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "Created .env file - Please edit it with your Groq API key"
    echo ""
    echo "Edit the following in backend/.env:"
    echo "- GROQ_API_KEY=your-groq-api-key-from-console.groq.com"
    echo "- DATABASE_URL=postgresql://postgres:postgres@localhost:5432/meeting_extractor"
    echo ""
    read -p "Press Enter to continue..."
fi

echo ""
echo "Step 3: Checking PostgreSQL..."
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL CLI not found. You can:"
    echo "1. Install PostgreSQL locally"
    echo "2. Use Docker: docker run --name meeting-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=meeting_extractor -p 5432:5432 -d postgres:15-alpine"
    echo ""
    read -p "Press Enter to continue..."
fi

echo ""
echo "Step 4: Starting Backend Server..."
echo "Backend will start at http://localhost:8000"
echo "API Documentation at http://localhost:8000/docs"
echo ""

python main.py
