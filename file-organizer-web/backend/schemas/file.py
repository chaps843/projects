"""
Schemas for file and directory information.
"""

from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


class FileInfo(BaseModel):
    """Information about a file."""
    
    name: str
    path: str
    size: int
    extension: str
    mime_type: Optional[str] = None
    created_at: datetime
    modified_at: datetime
    is_hidden: bool = False
    category: Optional[str] = None


class DirectoryInfo(BaseModel):
    """Information about a directory."""
    
    name: str
    path: str
    file_count: int
    total_size: int
    created_at: datetime
    modified_at: datetime
    is_hidden: bool = False


class DirectoryContents(BaseModel):
    """Contents of a directory."""
    
    path: str
    files: List[FileInfo]
    directories: List[DirectoryInfo]
    total_files: int
    total_directories: int
    total_size: int


class FileSearchResult(BaseModel):
    """Search result for files."""
    
    files: List[FileInfo]
    total_count: int
    query: str
    search_path: str
