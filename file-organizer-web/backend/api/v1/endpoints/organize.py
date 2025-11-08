"""
File organization endpoints.
"""

from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session

from core.database import get_session
from models.organization import OrganizationHistory
from schemas.organize import (
    OrganizeRequest,
    OrganizePreview,
    OrganizeResponse,
    UndoRequest,
    UndoResponse,
)
from services.file_organizer import FileOrganizerService


router = APIRouter(prefix="/organize", tags=["organize"])
organizer = FileOrganizerService()


@router.post("/preview", response_model=OrganizePreview)
def preview_organization(request: OrganizeRequest):
    """
    Preview file organization without executing it.
    
    Args:
        request: Organization request parameters
        
    Returns:
        Preview of planned file moves
        
    Raises:
        HTTPException: If preview fails
    """
    try:
        if request.operation_type == "by_type":
            return organizer.preview_organize_by_type(
                request.source_directory,
                request.create_others
            )
        else:  # by_date
            return organizer.preview_organize_by_date(
                request.source_directory,
                request.date_format or "%Y/%m"
            )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error previewing organization: {str(e)}")


@router.post("/execute", response_model=OrganizeResponse)
def execute_organization(
    request: OrganizeRequest,
    session: Session = Depends(get_session)
):
    """
    Execute file organization.
    
    Args:
        request: Organization request parameters
        session: Database session
        
    Returns:
        Organization result
        
    Raises:
        HTTPException: If organization fails
    """
    # Create history entry
    history = OrganizationHistory(
        operation_type=request.operation_type,
        source_directory=request.source_directory,
        date_format=request.date_format if request.operation_type == "by_date" else None,
        dry_run=request.dry_run,
        status="pending"
    )
    session.add(history)
    session.commit()
    session.refresh(history)
    
    try:
        # Execute organization if not dry run
        if not request.dry_run:
            if request.operation_type == "by_type":
                stats, move_log = organizer.organize_by_type(
                    request.source_directory,
                    request.create_others
                )
            else:  # by_date
                stats, move_log = organizer.organize_by_date(
                    request.source_directory,
                    request.date_format or "%Y/%m"
                )
            
            # Update history
            history.status = "completed"
            history.completed_at = datetime.utcnow()
            history.files_moved = len(move_log)
            history.categories_created = len(stats)
            history.stats = stats
            history.move_log = move_log
        else:
            # Get preview for dry run
            if request.operation_type == "by_type":
                preview = organizer.preview_organize_by_type(
                    request.source_directory,
                    request.create_others
                )
            else:
                preview = organizer.preview_organize_by_date(
                    request.source_directory,
                    request.date_format or "%Y/%m"
                )
            
            history.status = "completed"
            history.completed_at = datetime.utcnow()
            history.files_moved = 0
            history.categories_created = len(preview.categories_to_create)
            history.stats = preview.stats
        
        session.add(history)
        session.commit()
        session.refresh(history)
        
        return OrganizeResponse(
            operation_id=history.id,
            success=True,
            files_moved=history.files_moved,
            categories_created=history.categories_created,
            stats=history.stats
        )
        
    except Exception as e:
        # Update history with error
        history.status = "failed"
        history.completed_at = datetime.utcnow()
        history.error_message = str(e)
        session.add(history)
        session.commit()
        
        raise HTTPException(
            status_code=500,
            detail=f"Error executing organization: {str(e)}"
        )


@router.post("/undo", response_model=UndoResponse)
def undo_organization(
    request: UndoRequest,
    session: Session = Depends(get_session)
):
    """
    Undo a previous organization operation.
    
    Args:
        request: Undo request with operation ID
        session: Database session
        
    Returns:
        Undo result
        
    Raises:
        HTTPException: If undo fails
    """
    # Get operation history
    history = session.get(OrganizationHistory, request.operation_id)
    
    if not history:
        raise HTTPException(status_code=404, detail="Operation not found")
    
    if history.status != "completed":
        raise HTTPException(
            status_code=400,
            detail="Can only undo completed operations"
        )
    
    if not history.move_log:
        raise HTTPException(
            status_code=400,
            detail="No move log available for this operation"
        )
    
    try:
        # Execute undo
        restored = organizer.undo_organization(history.move_log)
        
        # Update history status
        history.status = "undone"
        session.add(history)
        session.commit()
        
        return UndoResponse(
            success=True,
            files_restored=restored
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error undoing organization: {str(e)}"
        )
