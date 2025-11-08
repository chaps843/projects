"""
Schemas for organization operations.
"""

from typing import List, Optional, Dict
from pydantic import BaseModel, Field


class OrganizeRequest(BaseModel):
    """Request to organize files."""
    
    source_directory: str
    operation_type: str = Field(..., pattern="^(by_type|by_date)$")
    date_format: Optional[str] = "%Y/%m"
    create_others: bool = True
    dry_run: bool = False


class FileMove(BaseModel):
    """A single file move operation."""
    
    source: str
    destination: str
    category: str
    file_name: str


class OrganizePreview(BaseModel):
    """Preview of organization operation."""
    
    total_files: int
    moves: List[FileMove]
    stats: Dict[str, int]  # category/date -> count
    categories_to_create: List[str]


class OrganizeResponse(BaseModel):
    """Response from organization operation."""
    
    operation_id: int
    success: bool
    files_moved: int
    categories_created: int
    stats: Dict[str, int]
    error: Optional[str] = None


class UndoRequest(BaseModel):
    """Request to undo an organization operation."""
    
    operation_id: int


class UndoResponse(BaseModel):
    """Response from undo operation."""
    
    success: bool
    files_restored: int
    error: Optional[str] = None
