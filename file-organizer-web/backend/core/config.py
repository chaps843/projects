"""
Configuration management using pydantic-settings.
"""

from typing import List, Optional
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Application
    APP_NAME: str = "File Organizer API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    API_V1_PREFIX: str = "/api/v1"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    
    # Database
    DATABASE_URL: str = "sqlite:///./file_organizer.db"
    
    # File System
    ALLOWED_BASE_PATHS: str = ""
    MAX_PREVIEW_SIZE: int = 10485760  # 10MB
    THUMBNAIL_SIZE: int = 200
    
    # Scheduler
    SCHEDULER_ENABLED: bool = True
    SCHEDULER_TIMEZONE: str = "UTC"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "logs/app.log"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )
    
    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        """Parse CORS origins from string or list."""
        if isinstance(v, str):
            # Handle JSON string format
            import json
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                # Handle comma-separated format
                return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v
    
    def get_allowed_paths(self) -> List[str]:
        """Get list of allowed base paths for file operations."""
        if not self.ALLOWED_BASE_PATHS:
            return []
        return [path.strip() for path in self.ALLOWED_BASE_PATHS.split(",") if path.strip()]


# Global settings instance
settings = Settings()
