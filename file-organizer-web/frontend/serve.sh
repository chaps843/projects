#!/bin/bash

# File Organizer Frontend Server
# Simple script to serve the frontend

echo "=========================================="
echo "  File Organizer Frontend Server"
echo "=========================================="
echo ""

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    echo "Starting server with Python 3..."
    echo "Frontend: http://localhost:8080"
    echo "Backend should be running on: http://localhost:8000"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    cd "$(dirname "$0")"
    python3 -m http.server 8080
elif command -v python &> /dev/null; then
    echo "Starting server with Python..."
    echo "Frontend: http://localhost:8080"
    echo "Backend should be running on: http://localhost:8000"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    cd "$(dirname "$0")"
    python -m http.server 8080
else
    echo "Error: Python is not installed."
    echo "Please install Python or use another web server to serve this directory."
    exit 1
fi
