#!/bin/bash
# Simple installation script for File Organizer Web

echo "=========================================="
echo "File Organizer Web - Installation"
echo "=========================================="
echo ""

# Check if python3-venv is installed
echo "Checking for python3-venv..."
if ! python3 -m venv --help > /dev/null 2>&1; then
    echo "❌ python3-venv is not installed"
    echo ""
    echo "Installing python3-venv..."
    echo "This requires sudo access."
    echo ""
    
    sudo apt update
    sudo apt install -y python3-venv
    
    echo ""
    echo "✅ python3-venv installed!"
else
    echo "✅ python3-venv is already installed"
fi
echo ""

# Create virtual environment
echo "Creating virtual environment..."
cd backend
if [ -d "venv" ]; then
    echo "Removing old venv..."
    rm -rf venv
fi

python3 -m venv venv

if [ -f "venv/bin/activate" ]; then
    echo "✅ Virtual environment created successfully!"
else
    echo "❌ Failed to create virtual environment"
    exit 1
fi
echo ""

# Install dependencies
echo "Installing Python packages..."
echo "This may take 1-2 minutes..."
source venv/bin/activate
pip install --upgrade pip -q
pip install -r requirements.txt -q
echo "✅ All packages installed!"
echo ""

# Create .env if needed
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ Created .env configuration file"
    echo ""
    echo "⚠️  IMPORTANT: Edit backend/.env and set ALLOWED_PATHS"
    echo "   Example: ALLOWED_PATHS=/home/chaps/Downloads,/home/chaps/Documents"
fi
echo ""

cd ..

echo "=========================================="
echo "✅ Installation Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Edit backend/.env and set ALLOWED_PATHS"
echo "2. Launch the app: ./launch"
echo ""
