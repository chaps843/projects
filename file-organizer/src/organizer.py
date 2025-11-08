#!/usr/bin/env python3
"""
Smart File Organizer - Automatically organize files by type, date, or custom rules
Author: Built with AI assistance
"""

import os
import sys
import json
import shutil
import argparse
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Tuple, Optional
from collections import defaultdict


class FileOrganizer:
    """Main class for organizing files in a directory."""
    
    # Default file type categories
    DEFAULT_CATEGORIES = {
        "Images": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".webp", ".ico", ".tiff"],
        "Documents": [".pdf", ".doc", ".docx", ".txt", ".rtf", ".odt", ".xls", ".xlsx", ".ppt", ".pptx"],
        "Videos": [".mp4", ".avi", ".mkv", ".mov", ".wmv", ".flv", ".webm", ".m4v"],
        "Audio": [".mp3", ".wav", ".flac", ".aac", ".ogg", ".wma", ".m4a"],
        "Archives": [".zip", ".rar", ".7z", ".tar", ".gz", ".bz2", ".xz"],
        "Code": [".py", ".js", ".java", ".cpp", ".c", ".h", ".cs", ".rb", ".go", ".rs", ".php"],
        "Data": [".json", ".xml", ".csv", ".sql", ".db", ".sqlite"],
        "Executables": [".exe", ".msi", ".dmg", ".pkg", ".deb", ".rpm", ".app"],
        "Fonts": [".ttf", ".otf", ".woff", ".woff2"],
        "Ebooks": [".epub", ".mobi", ".azw", ".azw3"],
    }
    
    def __init__(self, config_path: Optional[str] = None, dry_run: bool = False):
        """Initialize the organizer with optional custom config."""
        self.dry_run = dry_run
        self.categories = self._load_config(config_path) if config_path else self.DEFAULT_CATEGORIES
        self.move_log: List[Tuple[str, str]] = []
        
    def _load_config(self, config_path: str) -> Dict[str, List[str]]:
        """Load custom configuration from JSON file."""
        try:
            with open(config_path, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Warning: Could not load config {config_path}: {e}")
            print("Using default categories instead.")
            return self.DEFAULT_CATEGORIES
    
    def _get_category(self, file_ext: str) -> str:
        """Determine the category for a file based on its extension."""
        file_ext = file_ext.lower()
        for category, extensions in self.categories.items():
            if file_ext in extensions:
                return category
        return "Others"
    
    def _get_safe_destination(self, dest_path: Path) -> Path:
        """Generate a safe destination path, handling duplicates."""
        if not dest_path.exists():
            return dest_path
        
        # File exists, add number suffix
        stem = dest_path.stem
        suffix = dest_path.suffix
        parent = dest_path.parent
        counter = 1
        
        while True:
            new_name = f"{stem}_{counter}{suffix}"
            new_path = parent / new_name
            if not new_path.exists():
                return new_path
            counter += 1
    
    def organize_by_type(self, source_dir: str, create_others: bool = True) -> Dict[str, int]:
        """Organize files in source_dir by their file type."""
        source_path = Path(source_dir).resolve()
        
        if not source_path.exists() or not source_path.is_dir():
            raise ValueError(f"Invalid source directory: {source_dir}")
        
        stats = defaultdict(int)
        files = [f for f in source_path.iterdir() if f.is_file()]
        
        print(f"\n{'DRY RUN - ' if self.dry_run else ''}Organizing {len(files)} files in {source_path}")
        print("=" * 70)
        
        for file_path in files:
            file_ext = file_path.suffix
            category = self._get_category(file_ext)
            
            # Skip if category is "Others" and create_others is False
            if category == "Others" and not create_others:
                continue
            
            # Create category folder
            category_dir = source_path / category
            if not self.dry_run:
                category_dir.mkdir(exist_ok=True)
            
            # Get safe destination path
            dest_path = self._get_safe_destination(category_dir / file_path.name)
            
            # Move the file
            if self.dry_run:
                print(f"[WOULD MOVE] {file_path.name} → {category}/{dest_path.name}")
            else:
                shutil.move(str(file_path), str(dest_path))
                self.move_log.append((str(file_path), str(dest_path)))
                print(f"[MOVED] {file_path.name} → {category}/{dest_path.name}")
            
            stats[category] += 1
        
        return dict(stats)
    
    def organize_by_date(self, source_dir: str, date_format: str = "%Y/%m") -> Dict[str, int]:
        """Organize files by their modification date."""
        source_path = Path(source_dir).resolve()
        
        if not source_path.exists() or not source_path.is_dir():
            raise ValueError(f"Invalid source directory: {source_dir}")
        
        stats = defaultdict(int)
        files = [f for f in source_path.iterdir() if f.is_file()]
        
        print(f"\n{'DRY RUN - ' if self.dry_run else ''}Organizing {len(files)} files by date in {source_path}")
        print("=" * 70)
        
        for file_path in files:
            # Get file modification time
            mod_time = datetime.fromtimestamp(file_path.stat().st_mtime)
            date_folder = mod_time.strftime(date_format)
            
            # Create date folder structure
            date_dir = source_path / date_folder
            if not self.dry_run:
                date_dir.mkdir(parents=True, exist_ok=True)
            
            # Get safe destination path
            dest_path = self._get_safe_destination(date_dir / file_path.name)
            
            # Move the file
            if self.dry_run:
                print(f"[WOULD MOVE] {file_path.name} → {date_folder}/{dest_path.name}")
            else:
                shutil.move(str(file_path), str(dest_path))
                self.move_log.append((str(file_path), str(dest_path)))
                print(f"[MOVED] {file_path.name} → {date_folder}/{dest_path.name}")
            
            stats[date_folder] += 1
        
        return dict(stats)
    
    def save_undo_log(self, log_path: str = "organize_undo.log"):
        """Save the move log for potential undo operations."""
        if self.dry_run or not self.move_log:
            return
        
        with open(log_path, 'w') as f:
            json.dump(self.move_log, f, indent=2)
        print(f"\nUndo log saved to: {log_path}")
        print(f"To undo, run: python src/undo.py {log_path}")
    
    def print_summary(self, stats: Dict[str, int]):
        """Print a summary of the organization operation."""
        print("\n" + "=" * 70)
        print("SUMMARY")
        print("=" * 70)
        
        if not stats:
            print("No files were organized.")
            return
        
        total = sum(stats.values())
        print(f"Total files {'that would be ' if self.dry_run else ''}organized: {total}\n")
        
        for category, count in sorted(stats.items(), key=lambda x: x[1], reverse=True):
            percentage = (count / total) * 100
            bar = "█" * int(percentage / 2)
            print(f"{category:20} {count:4} files {bar} {percentage:.1f}%")


def main():
    """Main entry point for the file organizer."""
    parser = argparse.ArgumentParser(
        description="Smart File Organizer - Organize files by type or date",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python organizer.py ~/Downloads --dry-run          # Preview organization
  python organizer.py ~/Downloads                     # Organize by type
  python organizer.py ~/Downloads --by-date           # Organize by date
  python organizer.py ~/Downloads --config custom.json  # Use custom rules
        """
    )
    
    parser.add_argument(
        "directory",
        help="Directory to organize"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview changes without moving files"
    )
    parser.add_argument(
        "--by-date",
        action="store_true",
        help="Organize by modification date instead of file type"
    )
    parser.add_argument(
        "--date-format",
        default="%Y/%m",
        help="Date format for folder names (default: %%Y/%%m)"
    )
    parser.add_argument(
        "--config",
        help="Path to custom configuration JSON file"
    )
    parser.add_argument(
        "--no-others",
        action="store_true",
        help="Don't create 'Others' folder for uncategorized files"
    )
    
    args = parser.parse_args()
    
    try:
        organizer = FileOrganizer(config_path=args.config, dry_run=args.dry_run)
        
        if args.by_date:
            stats = organizer.organize_by_date(args.directory, args.date_format)
        else:
            stats = organizer.organize_by_type(args.directory, create_others=not args.no_others)
        
        organizer.print_summary(stats)
        
        if not args.dry_run:
            organizer.save_undo_log()
        
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
