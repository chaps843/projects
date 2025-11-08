"""
Scheduled jobs endpoints.
"""

from typing import List
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select

from core.database import get_session
from models.schedule import ScheduledJob
from schemas.schedule import ScheduledJobCreate, ScheduledJobUpdate, ScheduledJobResponse
from services.scheduler import scheduler_service


router = APIRouter(prefix="/schedule", tags=["schedule"])


@router.get("/", response_model=List[ScheduledJobResponse])
def list_scheduled_jobs(session: Session = Depends(get_session)):
    """
    List all scheduled jobs.
    
    Args:
        session: Database session
        
    Returns:
        List of scheduled jobs
    """
    jobs = session.exec(select(ScheduledJob)).all()
    return jobs


@router.get("/{job_id}", response_model=ScheduledJobResponse)
def get_scheduled_job(job_id: int, session: Session = Depends(get_session)):
    """
    Get a specific scheduled job.
    
    Args:
        job_id: Job ID
        session: Database session
        
    Returns:
        Scheduled job details
        
    Raises:
        HTTPException: If job not found
    """
    job = session.get(ScheduledJob, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.post("/", response_model=ScheduledJobResponse)
def create_scheduled_job(
    job_data: ScheduledJobCreate,
    session: Session = Depends(get_session)
):
    """
    Create a new scheduled job.
    
    Args:
        job_data: Job creation data
        session: Database session
        
    Returns:
        Created job details
        
    Raises:
        HTTPException: If creation fails
    """
    try:
        # Create job in database
        job = ScheduledJob(
            name=job_data.name,
            description=job_data.description,
            operation_type=job_data.operation_type,
            source_directory=job_data.source_directory,
            date_format=job_data.date_format,
            schedule_type=job_data.schedule_type,
            schedule_config=job_data.schedule_config.model_dump(exclude_none=True),
            enabled=job_data.enabled
        )
        session.add(job)
        session.commit()
        session.refresh(job)
        
        # Add to scheduler if enabled
        if job.enabled:
            try:
                scheduler_service.add_job(job)
                # Update next run time
                next_run = scheduler_service.get_next_run_time(job.id)
                if next_run:
                    job.next_run = next_run
                    session.add(job)
                    session.commit()
                    session.refresh(job)
            except Exception as e:
                # Remove job from database if scheduling fails
                session.delete(job)
                session.commit()
                raise HTTPException(
                    status_code=400,
                    detail=f"Error scheduling job: {str(e)}"
                )
        
        return job
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error creating job: {str(e)}"
        )


@router.put("/{job_id}", response_model=ScheduledJobResponse)
def update_scheduled_job(
    job_id: int,
    job_data: ScheduledJobUpdate,
    session: Session = Depends(get_session)
):
    """
    Update a scheduled job.
    
    Args:
        job_id: Job ID
        job_data: Job update data
        session: Database session
        
    Returns:
        Updated job details
        
    Raises:
        HTTPException: If job not found or update fails
    """
    job = session.get(ScheduledJob, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    try:
        # Update fields
        update_data = job_data.model_dump(exclude_unset=True)
        
        # Handle schedule_config separately
        if "schedule_config" in update_data and update_data["schedule_config"]:
            update_data["schedule_config"] = update_data["schedule_config"].model_dump(exclude_none=True)
        
        for key, value in update_data.items():
            setattr(job, key, value)
        
        job.updated_at = datetime.utcnow()
        
        # Remove from scheduler
        scheduler_service.remove_job(job.id)
        
        # Re-add if enabled
        if job.enabled:
            scheduler_service.add_job(job)
            next_run = scheduler_service.get_next_run_time(job.id)
            if next_run:
                job.next_run = next_run
        else:
            job.next_run = None
        
        session.add(job)
        session.commit()
        session.refresh(job)
        
        return job
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error updating job: {str(e)}"
        )


@router.delete("/{job_id}")
def delete_scheduled_job(job_id: int, session: Session = Depends(get_session)):
    """
    Delete a scheduled job.
    
    Args:
        job_id: Job ID
        session: Database session
        
    Returns:
        Success message
        
    Raises:
        HTTPException: If job not found
    """
    job = session.get(ScheduledJob, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Remove from scheduler
    scheduler_service.remove_job(job.id)
    
    # Delete from database
    session.delete(job)
    session.commit()
    
    return {"message": "Job deleted successfully"}


@router.post("/{job_id}/enable")
def enable_job(job_id: int, session: Session = Depends(get_session)):
    """
    Enable a scheduled job.
    
    Args:
        job_id: Job ID
        session: Database session
        
    Returns:
        Updated job details
        
    Raises:
        HTTPException: If job not found
    """
    job = session.get(ScheduledJob, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if not job.enabled:
        job.enabled = True
        job.updated_at = datetime.utcnow()
        
        try:
            scheduler_service.add_job(job)
            next_run = scheduler_service.get_next_run_time(job.id)
            if next_run:
                job.next_run = next_run
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Error enabling job: {str(e)}"
            )
        
        session.add(job)
        session.commit()
        session.refresh(job)
    
    return job


@router.post("/{job_id}/disable")
def disable_job(job_id: int, session: Session = Depends(get_session)):
    """
    Disable a scheduled job.
    
    Args:
        job_id: Job ID
        session: Database session
        
    Returns:
        Updated job details
        
    Raises:
        HTTPException: If job not found
    """
    job = session.get(ScheduledJob, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if job.enabled:
        job.enabled = False
        job.updated_at = datetime.utcnow()
        job.next_run = None
        
        scheduler_service.remove_job(job.id)
        
        session.add(job)
        session.commit()
        session.refresh(job)
    
    return job
