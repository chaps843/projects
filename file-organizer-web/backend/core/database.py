"""
Database configuration and session management using SQLModel.
"""

from typing import Generator
from sqlmodel import SQLModel, Session, create_engine
from core.config import settings


# Create database engine
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {},
)


def create_db_and_tables():
    """Create all database tables."""
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """Dependency to get database session."""
    with Session(engine) as session:
        yield session
