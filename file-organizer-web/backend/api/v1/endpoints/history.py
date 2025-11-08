"""
Organization history and analytics endpoints.
"""

from typing import List
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlmodel import Session, select, desc

from core.database import get_session
from models.organization import OrganizationHistory
from schemas.history import HistoryResponse, HistoryStats, HistoryAnalytics
from services.analytics import AnalyticsService


router = APIRouter(prefix="/history", tags=["history"])
analytics = AnalyticsService()


@router.get("/", response_model=List[HistoryResponse])
def list_history(
    limit: int = Query(50, description="Maximum number of results", ge=1, le=500),
    offset: int = Query(0, description="Offset for pagination", ge=0),
    status: str = Query(None, description="Filter by status"),
    session: Session = Depends(get_session)
):
    """
    List organization history.
    
    Args:
        limit: Maximum number of results
        offset: Offset for pagination
        status: Optional status filter
        session: Database session
        
    Returns:
        List of operation history
    """
    statement = select(OrganizationHistory).order_by(desc(OrganizationHistory.created_at))
    
    if status:
        statement = statement.where(OrganizationHistory.status == status)
    
    statement = statement.offset(offset).limit(limit)
    
    operations = session.exec(statement).all()
    return operations


@router.get("/{operation_id}", response_model=HistoryResponse)
def get_operation(
    operation_id: int,
    session: Session = Depends(get_session)
):
    """
    Get details of a specific operation.
    
    Args:
        operation_id: Operation ID
        session: Database session
        
    Returns:
        Operation details
        
    Raises:
        HTTPException: If operation not found
    """
    operation = session.get(OrganizationHistory, operation_id)
    if not operation:
        raise HTTPException(status_code=404, detail="Operation not found")
    return operation


@router.get("/stats/summary", response_model=HistoryStats)
def get_stats_summary(session: Session = Depends(get_session)):
    """
    Get overall statistics.
    
    Args:
        session: Database session
        
    Returns:
        Statistics summary
    """
    try:
        return analytics.get_stats(session)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error calculating stats: {str(e)}"
        )


@router.get("/analytics/dashboard", response_model=HistoryAnalytics)
def get_analytics_dashboard(
    days: int = Query(30, description="Number of days for time series", ge=1, le=365),
    session: Session = Depends(get_session)
):
    """
    Get analytics data for dashboard.
    
    Args:
        days: Number of days to include
        session: Database session
        
    Returns:
        Analytics data
    """
    try:
        return analytics.get_analytics(session, days)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating analytics: {str(e)}"
        )


@router.delete("/{operation_id}")
def delete_operation(
    operation_id: int,
    session: Session = Depends(get_session)
):
    """
    Delete an operation from history.
    
    Args:
        operation_id: Operation ID
        session: Database session
        
    Returns:
        Success message
        
    Raises:
        HTTPException: If operation not found
    """
    operation = session.get(OrganizationHistory, operation_id)
    if not operation:
        raise HTTPException(status_code=404, detail="Operation not found")
    
    session.delete(operation)
    session.commit()
    
    return {"message": "Operation deleted successfully"}
