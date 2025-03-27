from fastapi import APIRouter

from app.api.api_v1.endpoints import capture, url

api_router = APIRouter()
api_router.include_router(capture.router, prefix="/captures", tags=["captures"])
api_router.include_router(url.router, prefix="/url", tags=["url"])