#!/bin/bash
# Quick start script for backend

cd "$(dirname "$0")/backend"

if [ ! -d "venv" ]; then
    echo "Error: Virtual environment not found."
    echo "Please run ./setup.sh first"
    exit 1
fi

echo "Starting File Organizer Backend..."
echo "API will be available at: http://localhost:8000"
echo "API docs at: http://localhost:8000/docs"
echo ""

source venv/bin/activate
python main.py
