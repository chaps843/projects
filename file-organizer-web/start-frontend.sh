#!/bin/bash
# Quick start script for frontend

cd "$(dirname "$0")/frontend"

echo "Starting File Organizer Frontend..."
echo "Web interface will be available at: http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop"
echo ""

python3 -m http.server 8080
