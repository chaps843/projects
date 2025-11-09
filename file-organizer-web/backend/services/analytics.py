"""
Analytics service for calculating statistics.
"""

from typing import List, Dict
from datetime import datetime, timedelta
from collections import defaultdict
from sqlmodel import Session, select

from models.organization import OrganizationHistory
from schemas.history import HistoryStats, CategoryStats, TimeSeriesPoint, HistoryAnalytics


class AnalyticsService:
    """Service for calculating analytics and statistics."""
    
    def get_stats(self, session: Session) -> HistoryStats:
        """
        Get overall statistics for organization history.
        
        Args:
            session: Database session
            
        Returns:
            HistoryStats object
        """
        # Get all operations
        operations = session.exec(select(OrganizationHistory)).all()
        
        total_operations = len(operations)
        total_files_moved = sum(op.files_moved for op in operations)
        successful = len([op for op in operations if op.status == "completed"])
        failed = len([op for op in operations if op.status == "failed"])
        
        # Count operations by type
        operations_by_type: Dict[str, int] = defaultdict(int)
        for op in operations:
            operations_by_type[op.operation_type] += 1
        
        # Aggregate category statistics
        category_totals: Dict[str, int] = defaultdict(int)
        for op in operations:
            if op.status == "completed" and op.stats:
                for category, count in op.stats.items():
                    category_totals[category] += count
        
        # Get top categories
        total_files = sum(category_totals.values()) or 1  # Avoid division by zero
        top_categories = [
            CategoryStats(
                category=category,
                count=count,
                percentage=(count / total_files) * 100
            )
            for category, count in sorted(
                category_totals.items(),
                key=lambda x: x[1],
                reverse=True
            )[:10]
        ]
        
        return HistoryStats(
            total_operations=total_operations,
            total_files_moved=total_files_moved,
            successful_operations=successful,
            failed_operations=failed,
            operations_by_type=dict(operations_by_type),
            top_categories=top_categories
        )
    
    def get_analytics(
        self,
        session: Session,
        days: int = 30
    ) -> HistoryAnalytics:
        """
        Get analytics data for visualization.
        
        Args:
            session: Database session
            days: Number of days to include in time series
            
        Returns:
            HistoryAnalytics object
        """
        # Calculate date range
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        # Get operations in date range
        statement = select(OrganizationHistory).where(
            OrganizationHistory.created_at >= start_date
        ).where(
            OrganizationHistory.status == "completed"
        )
        operations = session.exec(statement).all()
        
        # Build time series data
        files_by_date: Dict[str, int] = defaultdict(int)
        ops_by_date: Dict[str, int] = defaultdict(int)
        category_totals: Dict[str, int] = defaultdict(int)
        directory_stats: Dict[str, Dict] = defaultdict(lambda: {"count": 0, "files": 0})
        
        for op in operations:
            date_key = op.created_at.strftime("%Y-%m-%d")
            
            ops_by_date[date_key] += 1
            files_by_date[date_key] += op.files_moved
            
            # Aggregate categories
            if op.stats:
                for category, count in op.stats.items():
                    category_totals[category] += count
            
            # Track directory usage
            directory_stats[op.source_directory]["count"] += 1
            directory_stats[op.source_directory]["files"] += op.files_moved
        
        # Convert to time series
        files_time_series = [
            TimeSeriesPoint(date=date, value=count)
            for date, count in sorted(files_by_date.items())
        ]
        
        ops_time_series = [
            TimeSeriesPoint(date=date, value=count)
            for date, count in sorted(ops_by_date.items())
        ]
        
        # Get busiest directories
        busiest_dirs = [
            {
                "directory": directory,
                "operation_count": stats["count"],
                "files_moved": stats["files"]
            }
            for directory, stats in sorted(
                directory_stats.items(),
                key=lambda x: x[1]["files"],
                reverse=True
            )[:10]
        ]
        
        return HistoryAnalytics(
            files_moved_over_time=files_time_series,
            operations_over_time=ops_time_series,
            category_distribution=dict(category_totals),
            busiest_directories=busiest_dirs
        )
