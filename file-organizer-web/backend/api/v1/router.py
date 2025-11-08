"""
API v1 router combining all endpoints.
"""

from fastapi import APIRouter

from api.v1.endpoints import files, organize, preview, schedule, history


api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(files.router)
api_router.include_router(organize.router)
api_router.include_router(preview.router)
api_router.include_router(schedule.router)
api_router.include_router(history.router)
