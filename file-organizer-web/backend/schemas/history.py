"""
Schemas for operation history.
"""

from typing import List, Optional, Dict
from datetime import datetime
from pydantic import BaseModel


class HistoryResponse(BaseModel):
    """Response with operation history."""
    
    id: int
    operation_type: str
    source_directory: str
    date_format: Optional[str]
    files_moved: int
    categories_created: int
    dry_run: bool
    created_at: datetime
    completed_at: Optional[datetime]
    status: str
    error_message: Optional[str]
    stats: Dict[str, int]
    
    class Config:
        from_attributes = True


class CategoryStats(BaseModel):
    """Statistics for a file category."""
    
    category: str
    count: int
    percentage: float


class HistoryStats(BaseModel):
    """Statistics about organization history."""
    
    total_operations: int
    total_files_moved: int
    successful_operations: int
    failed_operations: int
    operations_by_type: Dict[str, int]
    top_categories: List[CategoryStats]


class TimeSeriesPoint(BaseModel):
    """A point in time series data."""
    
    date: str
    value: int


class HistoryAnalytics(BaseModel):
    """Analytics data for organization history."""
    
    files_moved_over_time: List[TimeSeriesPoint]
    operations_over_time: List[TimeSeriesPoint]
    category_distribution: Dict[str, int]
    busiest_directories: List[Dict[str, any]]
