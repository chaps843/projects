#!/bin/bash
# Run script for File Organizer Web API

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install/upgrade dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "Please edit .env to configure your settings, especially ALLOWED_BASE_PATHS"
fi

# Create logs directory
mkdir -p logs

# Run the application
echo "Starting File Organizer API..."
python main.py
