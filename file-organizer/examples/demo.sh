#!/bin/bash
# Demo script to showcase the file organizer capabilities

echo "=========================================="
echo "Smart File Organizer - Interactive Demo"
echo "=========================================="
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is required"
    exit 1
fi

cd "$(dirname "$0")/.."

echo "Step 1: Creating sample messy directory..."
DEMO_DIR="demo_files"
rm -rf "$DEMO_DIR"
mkdir -p "$DEMO_DIR"

# Create sample files with realistic names
cd "$DEMO_DIR"
touch "vacation_2024.jpg" "meeting_notes.pdf" "budget_2024.xlsx"
touch "family_photo.png" "presentation.pptx" "song.mp3"
touch "movie_clip.mp4" "backup.zip" "analysis.py"
touch "invoice.pdf" "screenshot.png" "data.json"
cd ..

echo "✓ Created 12 sample files"
echo ""

echo "Step 2: Show current directory state..."
ls -1 "$DEMO_DIR"
echo ""

read -p "Press Enter to preview organization (dry-run)..."
echo ""

echo "Step 3: Running dry-run to preview changes..."
python3 src/organizer.py "$DEMO_DIR" --dry-run
echo ""

read -p "Press Enter to organize files for real..."
echo ""

echo "Step 4: Organizing files by type..."
python3 src/organizer.py "$DEMO_DIR"
echo ""

echo "Step 5: Show organized directory structure..."
tree "$DEMO_DIR" 2>/dev/null || find "$DEMO_DIR" -type f
echo ""

read -p "Press Enter to demonstrate undo functionality..."
echo ""

echo "Step 6: Undoing organization..."
python3 src/undo.py organize_undo.log
echo ""

echo "Step 7: Directory restored to original state..."
ls -1 "$DEMO_DIR"
echo ""

echo "=========================================="
echo "Demo complete!"
echo "=========================================="
echo ""
echo "Try it yourself:"
echo "  python3 src/organizer.py <your-directory> --dry-run"
echo ""
echo "Cleanup demo files:"
echo "  rm -rf $DEMO_DIR organize_undo.log"
