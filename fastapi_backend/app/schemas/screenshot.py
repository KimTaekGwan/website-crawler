from typing import Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime


class ScreenshotBase(BaseModel):
    path: str
    thumbnail_path: str
    width: int
    height: int
    device_type: str
    version: int = 1
    metadata: Optional[Dict[str, Any]] = None
    page_id: int
    capture_id: int


class ScreenshotCreate(ScreenshotBase):
    pass


class ScreenshotUpdate(ScreenshotBase):
    path: Optional[str] = None
    thumbnail_path: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    device_type: Optional[str] = None
    version: Optional[int] = None
    metadata: Optional[Dict[str, Any]] = None
    page_id: Optional[int] = None
    capture_id: Optional[int] = None


class ScreenshotInDBBase(ScreenshotBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


class Screenshot(ScreenshotInDBBase):
    pass