"""
Database models for organization history.
"""

from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field, Column, JSON


class OrganizationHistory(SQLModel, table=True):
    """Model for tracking file organization operations."""
    
    __tablename__ = "organization_history"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    operation_type: str = Field(index=True)  # "by_type", "by_date", "custom"
    source_directory: str
    date_format: Optional[str] = None
    files_moved: int = 0
    categories_created: int = 0
    dry_run: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    completed_at: Optional[datetime] = None
    status: str = Field(default="pending", index=True)  # pending, completed, failed, undone
    error_message: Optional[str] = None
    move_log: list = Field(default_factory=list, sa_column=Column(JSON))  # List of [source, dest] pairs
    stats: dict = Field(default_factory=dict, sa_column=Column(JSON))  # Category/date -> count mapping
    
    class Config:
        arbitrary_types_allowed = True
