"""
File organization service - integrates with existing organizer.py logic.
"""

import shutil
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Tuple, Optional
from collections import defaultdict

from schemas.organize import FileMove, OrganizePreview


class FileOrganizerService:
    """
    Service for organizing files by type or date.
    Based on the original FileOrganizer class.
    """
    
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
    
    def __init__(self):
        """Initialize the organizer service."""
        self.categories = self.DEFAULT_CATEGORIES
    
    def _get_category(self, file_ext: str) -> str:
        """
        Determine the category for a file based on its extension.
        
        Args:
            file_ext: File extension (including dot)
            
        Returns:
            Category name
        """
        file_ext = file_ext.lower()
        for category, extensions in self.categories.items():
            if file_ext in extensions:
                return category
        return "Others"
    
    def _get_safe_destination(self, dest_path: Path) -> Path:
        """
        Generate a safe destination path, handling duplicates.
        
        Args:
            dest_path: Desired destination path
            
        Returns:
            Safe destination path (may have number suffix if duplicate)
        """
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
    
    def preview_organize_by_type(
        self,
        source_dir: str,
        create_others: bool = True
    ) -> OrganizePreview:
        """
        Preview organization by file type without moving files.
        
        Args:
            source_dir: Source directory path
            create_others: Whether to create "Others" category
            
        Returns:
            OrganizePreview with planned moves
            
        Raises:
            ValueError: If source directory is invalid
        """
        source_path = Path(source_dir).resolve()
        
        if not source_path.exists() or not source_path.is_dir():
            raise ValueError(f"Invalid source directory: {source_dir}")
        
        stats = defaultdict(int)
        moves: List[FileMove] = []
        categories_set = set()
        files = [f for f in source_path.iterdir() if f.is_file()]
        
        for file_path in files:
            file_ext = file_path.suffix
            category = self._get_category(file_ext)
            
            # Skip if category is "Others" and create_others is False
            if category == "Others" and not create_others:
                continue
            
            # Plan the move
            category_dir = source_path / category
            dest_path = self._get_safe_destination(category_dir / file_path.name)
            
            moves.append(FileMove(
                source=str(file_path),
                destination=str(dest_path),
                category=category,
                file_name=file_path.name
            ))
            
            stats[category] += 1
            categories_set.add(category)
        
        return OrganizePreview(
            total_files=len(moves),
            moves=moves,
            stats=dict(stats),
            categories_to_create=sorted(list(categories_set))
        )
    
    def organize_by_type(
        self,
        source_dir: str,
        create_others: bool = True
    ) -> Tuple[Dict[str, int], List[Tuple[str, str]]]:
        """
        Organize files by their file type.
        
        Args:
            source_dir: Source directory path
            create_others: Whether to create "Others" category
            
        Returns:
            Tuple of (stats dict, move log list)
            
        Raises:
            ValueError: If source directory is invalid
        """
        source_path = Path(source_dir).resolve()
        
        if not source_path.exists() or not source_path.is_dir():
            raise ValueError(f"Invalid source directory: {source_dir}")
        
        stats = defaultdict(int)
        move_log: List[Tuple[str, str]] = []
        files = [f for f in source_path.iterdir() if f.is_file()]
        
        for file_path in files:
            file_ext = file_path.suffix
            category = self._get_category(file_ext)
            
            # Skip if category is "Others" and create_others is False
            if category == "Others" and not create_others:
                continue
            
            # Create category folder
            category_dir = source_path / category
            category_dir.mkdir(exist_ok=True)
            
            # Get safe destination path
            dest_path = self._get_safe_destination(category_dir / file_path.name)
            
            # Move the file
            shutil.move(str(file_path), str(dest_path))
            move_log.append((str(file_path), str(dest_path)))
            
            stats[category] += 1
        
        return dict(stats), move_log
    
    def preview_organize_by_date(
        self,
        source_dir: str,
        date_format: str = "%Y/%m"
    ) -> OrganizePreview:
        """
        Preview organization by modification date without moving files.
        
        Args:
            source_dir: Source directory path
            date_format: Date format for folder names
            
        Returns:
            OrganizePreview with planned moves
            
        Raises:
            ValueError: If source directory is invalid
        """
        source_path = Path(source_dir).resolve()
        
        if not source_path.exists() or not source_path.is_dir():
            raise ValueError(f"Invalid source directory: {source_dir}")
        
        stats = defaultdict(int)
        moves: List[FileMove] = []
        date_folders_set = set()
        files = [f for f in source_path.iterdir() if f.is_file()]
        
        for file_path in files:
            # Get file modification time
            mod_time = datetime.fromtimestamp(file_path.stat().st_mtime)
            date_folder = mod_time.strftime(date_format)
            
            # Plan the move
            date_dir = source_path / date_folder
            dest_path = self._get_safe_destination(date_dir / file_path.name)
            
            moves.append(FileMove(
                source=str(file_path),
                destination=str(dest_path),
                category=date_folder,
                file_name=file_path.name
            ))
            
            stats[date_folder] += 1
            date_folders_set.add(date_folder)
        
        return OrganizePreview(
            total_files=len(moves),
            moves=moves,
            stats=dict(stats),
            categories_to_create=sorted(list(date_folders_set))
        )
    
    def organize_by_date(
        self,
        source_dir: str,
        date_format: str = "%Y/%m"
    ) -> Tuple[Dict[str, int], List[Tuple[str, str]]]:
        """
        Organize files by their modification date.
        
        Args:
            source_dir: Source directory path
            date_format: Date format for folder names
            
        Returns:
            Tuple of (stats dict, move log list)
            
        Raises:
            ValueError: If source directory is invalid
        """
        source_path = Path(source_dir).resolve()
        
        if not source_path.exists() or not source_path.is_dir():
            raise ValueError(f"Invalid source directory: {source_dir}")
        
        stats = defaultdict(int)
        move_log: List[Tuple[str, str]] = []
        files = [f for f in source_path.iterdir() if f.is_file()]
        
        for file_path in files:
            # Get file modification time
            mod_time = datetime.fromtimestamp(file_path.stat().st_mtime)
            date_folder = mod_time.strftime(date_format)
            
            # Create date folder structure
            date_dir = source_path / date_folder
            date_dir.mkdir(parents=True, exist_ok=True)
            
            # Get safe destination path
            dest_path = self._get_safe_destination(date_dir / file_path.name)
            
            # Move the file
            shutil.move(str(file_path), str(dest_path))
            move_log.append((str(file_path), str(dest_path)))
            
            stats[date_folder] += 1
        
        return dict(stats), move_log
    
    def undo_organization(self, move_log: List[Tuple[str, str]]) -> int:
        """
        Undo an organization operation by moving files back.
        
        Args:
            move_log: List of (source, destination) tuples
            
        Returns:
            Number of files restored
            
        Raises:
            Exception: If restoration fails
        """
        restored = 0
        
        # Reverse the move log to restore in reverse order
        for source, dest in reversed(move_log):
            dest_path = Path(dest)
            source_path = Path(source)
            
            if not dest_path.exists():
                continue
            
            # Ensure source directory exists
            source_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Move file back
            shutil.move(str(dest_path), str(source_path))
            restored += 1
        
        return restored
