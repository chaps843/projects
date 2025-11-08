"""Core module containing configuration and database setup."""

from core.config import settings
from core.database import engine, get_session, create_db_and_tables

__all__ = ["settings", "engine", "get_session", "create_db_and_tables"]
