"""
File browser service for safe filesystem navigation.
"""

import os
import mimetypes
from pathlib import Path
from typing import List, Optional
from datetime import datetime

from core.config import settings
from schemas.file import FileInfo, DirectoryInfo, DirectoryContents


class FileBrowserService:
    """Service for browsing filesystem safely."""
    
    def __init__(self):
        """Initialize file browser with allowed paths."""
        self.allowed_paths = settings.get_allowed_paths()
    
    def _is_path_allowed(self, path: str) -> bool:
        """
        Check if a path is within allowed base paths.
        
        Args:
            path: Path to check
            
        Returns:
            True if path is allowed, False otherwise
        """
        try:
            resolved_path = Path(path).resolve()
            
            # If no allowed paths configured, allow all
            if not self.allowed_paths:
                return True
            
            # Check if path is under any allowed base path
            for allowed in self.allowed_paths:
                allowed_resolved = Path(allowed).resolve()
                try:
                    resolved_path.relative_to(allowed_resolved)
                    return True
                except ValueError:
                    continue
            
            return False
        except Exception:
            return False
    
    def _get_file_info(self, file_path: Path) -> FileInfo:
        """
        Get information about a file.
        
        Args:
            file_path: Path to the file
            
        Returns:
            FileInfo object
        """
        stat = file_path.stat()
        mime_type, _ = mimetypes.guess_type(str(file_path))
        
        return FileInfo(
            name=file_path.name,
            path=str(file_path),
            size=stat.st_size,
            extension=file_path.suffix,
            mime_type=mime_type,
            created_at=datetime.fromtimestamp(stat.st_ctime),
            modified_at=datetime.fromtimestamp(stat.st_mtime),
            is_hidden=file_path.name.startswith('.'),
            category=None  # Will be set by organizer if needed
        )
    
    def _get_directory_info(self, dir_path: Path) -> DirectoryInfo:
        """
        Get information about a directory.
        
        Args:
            dir_path: Path to the directory
            
        Returns:
            DirectoryInfo object
        """
        stat = dir_path.stat()
        
        # Count files and calculate total size
        file_count = 0
        total_size = 0
        try:
            for item in dir_path.iterdir():
                if item.is_file():
                    file_count += 1
                    total_size += item.stat().st_size
        except PermissionError:
            pass
        
        return DirectoryInfo(
            name=dir_path.name,
            path=str(dir_path),
            file_count=file_count,
            total_size=total_size,
            created_at=datetime.fromtimestamp(stat.st_ctime),
            modified_at=datetime.fromtimestamp(stat.st_mtime),
            is_hidden=dir_path.name.startswith('.')
        )
    
    def get_directory_contents(
        self,
        path: str,
        include_hidden: bool = False
    ) -> DirectoryContents:
        """
        Get contents of a directory.
        
        Args:
            path: Directory path
            include_hidden: Whether to include hidden files/directories
            
        Returns:
            DirectoryContents object
            
        Raises:
            ValueError: If path is not allowed or invalid
            PermissionError: If access is denied
        """
        if not self._is_path_allowed(path):
            raise ValueError(f"Access to path '{path}' is not allowed")
        
        dir_path = Path(path).resolve()
        
        if not dir_path.exists():
            raise ValueError(f"Path '{path}' does not exist")
        
        if not dir_path.is_dir():
            raise ValueError(f"Path '{path}' is not a directory")
        
        files: List[FileInfo] = []
        directories: List[DirectoryInfo] = []
        total_size = 0
        
        try:
            for item in sorted(dir_path.iterdir(), key=lambda x: x.name.lower()):
                # Skip hidden files if requested
                if not include_hidden and item.name.startswith('.'):
                    continue
                
                try:
                    if item.is_file():
                        file_info = self._get_file_info(item)
                        files.append(file_info)
                        total_size += file_info.size
                    elif item.is_dir():
                        dir_info = self._get_directory_info(item)
                        directories.append(dir_info)
                        total_size += dir_info.total_size
                except (PermissionError, OSError):
                    # Skip files/directories we can't access
                    continue
        except PermissionError as e:
            raise PermissionError(f"Permission denied accessing '{path}'") from e
        
        return DirectoryContents(
            path=str(dir_path),
            files=files,
            directories=directories,
            total_files=len(files),
            total_directories=len(directories),
            total_size=total_size
        )
    
    def get_file_info(self, path: str) -> FileInfo:
        """
        Get information about a specific file.
        
        Args:
            path: File path
            
        Returns:
            FileInfo object
            
        Raises:
            ValueError: If path is not allowed or invalid
        """
        if not self._is_path_allowed(path):
            raise ValueError(f"Access to path '{path}' is not allowed")
        
        file_path = Path(path).resolve()
        
        if not file_path.exists():
            raise ValueError(f"File '{path}' does not exist")
        
        if not file_path.is_file():
            raise ValueError(f"Path '{path}' is not a file")
        
        return self._get_file_info(file_path)
    
    def search_files(
        self,
        base_path: str,
        pattern: str,
        max_results: int = 100
    ) -> List[FileInfo]:
        """
        Search for files matching a pattern.
        
        Args:
            base_path: Base directory to search in
            pattern: Search pattern (simple wildcard matching)
            max_results: Maximum number of results to return
            
        Returns:
            List of matching FileInfo objects
            
        Raises:
            ValueError: If path is not allowed or invalid
        """
        if not self._is_path_allowed(base_path):
            raise ValueError(f"Access to path '{base_path}' is not allowed")
        
        dir_path = Path(base_path).resolve()
        
        if not dir_path.exists() or not dir_path.is_dir():
            raise ValueError(f"Invalid base path: {base_path}")
        
        results: List[FileInfo] = []
        pattern_lower = pattern.lower()
        
        try:
            for item in dir_path.rglob('*'):
                if len(results) >= max_results:
                    break
                
                if item.is_file() and pattern_lower in item.name.lower():
                    try:
                        results.append(self._get_file_info(item))
                    except (PermissionError, OSError):
                        continue
        except PermissionError:
            pass
        
        return results
