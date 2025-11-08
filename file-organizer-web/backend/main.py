#!/usr/bin/env python3
"""
File Organizer Web API - Main application entry point.
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from core.config import settings
from core.database import create_db_and_tables
from api.v1.router import api_router
from services.scheduler import scheduler_service


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan handler.
    Runs on startup and shutdown.
    """
    # Startup
    logger.info("Starting File Organizer API...")
    
    # Create log directory
    os.makedirs(os.path.dirname(settings.LOG_FILE), exist_ok=True)
    
    # Configure logging
    logger.add(
        settings.LOG_FILE,
        rotation="500 MB",
        retention="10 days",
        level=settings.LOG_LEVEL
    )
    
    # Create database tables
    logger.info("Creating database tables...")
    create_db_and_tables()
    
    # Start scheduler
    if settings.SCHEDULER_ENABLED:
        logger.info("Starting scheduler...")
        scheduler_service.start()
    
    logger.info("Application startup complete")
    
    yield
    
    # Shutdown
    logger.info("Shutting down File Organizer API...")
    
    # Stop scheduler
    if settings.SCHEDULER_ENABLED and scheduler_service.scheduler:
        logger.info("Stopping scheduler...")
        scheduler_service.shutdown()
    
    logger.info("Application shutdown complete")


# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/")
def root():
    """Root endpoint."""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running"
    }


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "scheduler_enabled": settings.SCHEDULER_ENABLED,
        "scheduler_running": (
            scheduler_service.scheduler.running
            if scheduler_service.scheduler
            else False
        )
    }


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower()
    )
