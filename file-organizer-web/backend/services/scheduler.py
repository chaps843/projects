"""
Scheduler service using APScheduler.
"""

from datetime import datetime
from typing import Optional
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
from sqlmodel import Session

from core.config import settings
from core.database import engine
from models.schedule import ScheduledJob
from models.organization import OrganizationHistory
from services.file_organizer import FileOrganizerService


class SchedulerService:
    """Service for managing scheduled organization jobs."""
    
    def __init__(self):
        """Initialize the scheduler."""
        self.scheduler: Optional[BackgroundScheduler] = None
        self.organizer = FileOrganizerService()
        
        if settings.SCHEDULER_ENABLED:
            self.scheduler = BackgroundScheduler(timezone=settings.SCHEDULER_TIMEZONE)
    
    def start(self):
        """Start the scheduler."""
        if self.scheduler and not self.scheduler.running:
            self.scheduler.start()
    
    def shutdown(self):
        """Shutdown the scheduler."""
        if self.scheduler and self.scheduler.running:
            self.scheduler.shutdown()
    
    def _execute_job(self, job_id: int):
        """
        Execute a scheduled job.
        
        Args:
            job_id: ID of the scheduled job
        """
        with Session(engine) as session:
            job = session.get(ScheduledJob, job_id)
            
            if not job or not job.enabled:
                return
            
            # Create history entry
            history = OrganizationHistory(
                operation_type=job.operation_type,
                source_directory=job.source_directory,
                date_format=job.date_format,
                status="pending"
            )
            session.add(history)
            session.commit()
            session.refresh(history)
            
            try:
                # Execute organization
                if job.operation_type == "by_type":
                    stats, move_log = self.organizer.organize_by_type(
                        job.source_directory,
                        create_others=True
                    )
                else:  # by_date
                    stats, move_log = self.organizer.organize_by_date(
                        job.source_directory,
                        job.date_format or "%Y/%m"
                    )
                
                # Update history
                history.status = "completed"
                history.completed_at = datetime.utcnow()
                history.files_moved = len(move_log)
                history.categories_created = len(stats)
                history.stats = stats
                history.move_log = move_log
                
                # Update job
                job.last_run = datetime.utcnow()
                job.run_count += 1
                
                session.add(history)
                session.add(job)
                session.commit()
                
            except Exception as e:
                # Update history with error
                history.status = "failed"
                history.completed_at = datetime.utcnow()
                history.error_message = str(e)
                session.add(history)
                session.commit()
    
    def add_job(self, job: ScheduledJob) -> str:
        """
        Add a scheduled job.
        
        Args:
            job: ScheduledJob model instance
            
        Returns:
            APScheduler job ID
            
        Raises:
            ValueError: If scheduler is not enabled or configuration is invalid
        """
        if not self.scheduler:
            raise ValueError("Scheduler is not enabled")
        
        # Create trigger based on schedule type
        if job.schedule_type == "cron":
            cron_expr = job.schedule_config.get("cron_expression")
            if not cron_expr:
                raise ValueError("Cron expression is required for cron schedule type")
            trigger = CronTrigger.from_crontab(cron_expr)
        
        elif job.schedule_type == "interval":
            kwargs = {}
            if "interval_seconds" in job.schedule_config:
                kwargs["seconds"] = job.schedule_config["interval_seconds"]
            if "interval_minutes" in job.schedule_config:
                kwargs["minutes"] = job.schedule_config["interval_minutes"]
            if "interval_hours" in job.schedule_config:
                kwargs["hours"] = job.schedule_config["interval_hours"]
            if "interval_days" in job.schedule_config:
                kwargs["days"] = job.schedule_config["interval_days"]
            
            if not kwargs:
                raise ValueError("At least one interval value is required")
            
            trigger = IntervalTrigger(**kwargs)
        
        else:
            raise ValueError(f"Invalid schedule type: {job.schedule_type}")
        
        # Add job to scheduler
        apscheduler_job = self.scheduler.add_job(
            self._execute_job,
            trigger=trigger,
            args=[job.id],
            id=f"job_{job.id}",
            replace_existing=True
        )
        
        return apscheduler_job.id
    
    def remove_job(self, job_id: int):
        """
        Remove a scheduled job.
        
        Args:
            job_id: ID of the scheduled job
        """
        if not self.scheduler:
            return
        
        try:
            self.scheduler.remove_job(f"job_{job_id}")
        except:
            pass
    
    def pause_job(self, job_id: int):
        """
        Pause a scheduled job.
        
        Args:
            job_id: ID of the scheduled job
        """
        if not self.scheduler:
            return
        
        try:
            self.scheduler.pause_job(f"job_{job_id}")
        except:
            pass
    
    def resume_job(self, job_id: int):
        """
        Resume a paused job.
        
        Args:
            job_id: ID of the scheduled job
        """
        if not self.scheduler:
            return
        
        try:
            self.scheduler.resume_job(f"job_{job_id}")
        except:
            pass
    
    def get_next_run_time(self, job_id: int) -> Optional[datetime]:
        """
        Get the next run time for a job.
        
        Args:
            job_id: ID of the scheduled job
            
        Returns:
            Next run time, or None if not scheduled
        """
        if not self.scheduler:
            return None
        
        try:
            job = self.scheduler.get_job(f"job_{job_id}")
            return job.next_run_time if job else None
        except:
            return None


# Global scheduler instance
scheduler_service = SchedulerService()
