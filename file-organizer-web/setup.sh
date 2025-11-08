#!/bin/bash
# One-command setup script for File Organizer Web

set -e  # Exit on error

echo "=========================================="
echo "File Organizer Web - Setup Script"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "setup.sh" ]; then
    echo "Error: Please run this script from the file-organizer-web directory"
    exit 1
fi

# Step 1: Check Python version
echo "Step 1/5: Checking Python version..."
PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}' | cut -d. -f1,2)
echo "  ✓ Python $PYTHON_VERSION found"
echo ""

# Step 2: Install python3-venv if needed
echo "Step 2/5: Checking for python3-venv..."
if ! python3 -m venv --help > /dev/null 2>&1; then
    echo "  Installing python3-venv..."
    echo "  This requires sudo access."
    sudo apt update
    sudo apt install -y python3-venv
    echo "  ✓ python3-venv installed"
else
    echo "  ✓ python3-venv already installed"
fi
echo ""

# Step 3: Create virtual environment
echo "Step 3/5: Setting up virtual environment..."
cd backend
if [ -d "venv" ]; then
    echo "  Virtual environment already exists"
else
    python3 -m venv venv
    echo "  ✓ Virtual environment created"
fi
echo ""

# Step 4: Install dependencies
echo "Step 4/5: Installing Python dependencies..."
echo "  This may take 1-2 minutes..."
source venv/bin/activate
pip install --upgrade pip > /dev/null 2>&1
pip install -r requirements.txt
echo "  ✓ Dependencies installed"
echo ""

# Step 5: Create .env file if it doesn't exist
echo "Step 5/5: Configuring environment..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "  ✓ Created .env file"
    echo "  ⚠️  IMPORTANT: Edit backend/.env to set ALLOWED_PATHS"
else
    echo "  .env file already exists"
fi
echo ""

cd ..

echo "=========================================="
echo "Setup Complete! 🎉"
echo "=========================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Configure allowed paths:"
echo "   nano backend/.env"
echo "   Set ALLOWED_PATHS to directories you want to organize"
echo ""
echo "2. Start the backend:"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   python main.py"
echo ""
echo "3. In a NEW terminal, start the frontend:"
echo "   cd frontend"
echo "   ./serve.sh"
echo ""
echo "4. Open your browser:"
echo "   http://localhost:8080"
echo ""
echo "Or use the quick start scripts:"
echo "  ./start-backend.sh    (starts backend)"
echo "  ./start-frontend.sh   (starts frontend)"
echo ""
