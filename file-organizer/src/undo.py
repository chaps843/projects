#!/usr/bin/env python3
"""
Undo Script - Reverse file organization operations
"""

import os
import sys
import json
import shutil
from pathlib import Path


def undo_organization(log_path: str, dry_run: bool = False):
    """Undo a file organization operation using the log file."""
    
    if not os.path.exists(log_path):
        print(f"Error: Log file not found: {log_path}")
        sys.exit(1)
    
    # Load the move log
    with open(log_path, 'r') as f:
        moves = json.load(f)
    
    if not moves:
        print("No moves to undo.")
        return
    
    print(f"\n{'DRY RUN - ' if dry_run else ''}Undoing {len(moves)} file moves")
    print("=" * 70)
    
    success_count = 0
    error_count = 0
    
    # Reverse the moves (process in reverse order)
    for source, dest in reversed(moves):
        source_path = Path(source)
        dest_path = Path(dest)
        
        if not dest_path.exists():
            print(f"[SKIP] File no longer exists: {dest_path.name}")
            error_count += 1
            continue
        
        if source_path.exists():
            print(f"[SKIP] Original location occupied: {source_path.name}")
            error_count += 1
            continue
        
        if dry_run:
            print(f"[WOULD MOVE] {dest_path.name} → {source_path}")
        else:
            try:
                # Ensure parent directory exists
                source_path.parent.mkdir(parents=True, exist_ok=True)
                shutil.move(str(dest_path), str(source_path))
                print(f"[RESTORED] {dest_path.name} → {source_path}")
                success_count += 1
            except Exception as e:
                print(f"[ERROR] Could not restore {dest_path.name}: {e}")
                error_count += 1
    
    print("\n" + "=" * 70)
    print("UNDO SUMMARY")
    print("=" * 70)
    print(f"Successfully restored: {success_count}")
    print(f"Errors/Skipped: {error_count}")
    
    if not dry_run and success_count > 0:
        print(f"\nOriginal log file preserved at: {log_path}")


def main():
    """Main entry point."""
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Undo file organization operations"
    )
    parser.add_argument(
        "log_file",
        help="Path to the undo log file"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview undo without moving files"
    )
    
    args = parser.parse_args()
    
    try:
        undo_organization(args.log_file, args.dry_run)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
