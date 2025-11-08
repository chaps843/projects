"""
Schemas for scheduled jobs.
"""

from typing import Optional, Dict
from datetime import datetime
from pydantic import BaseModel, Field


class ScheduleConfig(BaseModel):
    """Configuration for job scheduling."""
    
    # For cron-based scheduling
    cron_expression: Optional[str] = None
    
    # For interval-based scheduling
    interval_seconds: Optional[int] = None
    interval_minutes: Optional[int] = None
    interval_hours: Optional[int] = None
    interval_days: Optional[int] = None


class ScheduledJobCreate(BaseModel):
    """Request to create a scheduled job."""
    
    name: str
    description: Optional[str] = None
    operation_type: str = Field(..., pattern="^(by_type|by_date)$")
    source_directory: str
    date_format: Optional[str] = "%Y/%m"
    schedule_type: str = Field(..., pattern="^(cron|interval)$")
    schedule_config: ScheduleConfig
    enabled: bool = True


class ScheduledJobUpdate(BaseModel):
    """Request to update a scheduled job."""
    
    name: Optional[str] = None
    description: Optional[str] = None
    operation_type: Optional[str] = Field(None, pattern="^(by_type|by_date)$")
    source_directory: Optional[str] = None
    date_format: Optional[str] = None
    schedule_type: Optional[str] = Field(None, pattern="^(cron|interval)$")
    schedule_config: Optional[ScheduleConfig] = None
    enabled: Optional[bool] = None


class ScheduledJobResponse(BaseModel):
    """Response with scheduled job information."""
    
    id: int
    name: str
    description: Optional[str]
    operation_type: str
    source_directory: str
    date_format: Optional[str]
    schedule_type: str
    schedule_config: Dict
    enabled: bool
    last_run: Optional[datetime]
    next_run: Optional[datetime]
    run_count: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
