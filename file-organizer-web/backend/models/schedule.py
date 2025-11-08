"""
Database models for scheduled jobs.
"""

from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field, Column, JSON


class ScheduledJob(SQLModel, table=True):
    """Model for scheduled organization jobs."""
    
    __tablename__ = "scheduled_jobs"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    description: Optional[str] = None
    operation_type: str  # "by_type", "by_date"
    source_directory: str
    date_format: Optional[str] = None
    schedule_type: str  # "cron", "interval"
    schedule_config: dict = Field(sa_column=Column(JSON))  # Cron expression or interval config
    enabled: bool = Field(default=True, index=True)
    last_run: Optional[datetime] = None
    next_run: Optional[datetime] = None
    run_count: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        arbitrary_types_allowed = True
