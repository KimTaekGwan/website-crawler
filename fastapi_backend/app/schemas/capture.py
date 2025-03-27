from typing import Optional, List, Any
from pydantic import BaseModel
from datetime import datetime


class CaptureBase(BaseModel):
    website_id: int
    device_types: List[str]
    capture_full_page: bool = True
    capture_dynamic_elements: bool = False


class CaptureCreate(CaptureBase):
    pass


class CaptureUpdate(BaseModel):
    status: Optional[str] = None
    progress: Optional[float] = None
    error: Optional[str] = None
    completed_at: Optional[datetime] = None


class CaptureInDBBase(CaptureBase):
    id: int
    status: str
    progress: float
    created_at: datetime
    completed_at: Optional[datetime] = None
    error: Optional[str] = None

    class Config:
        orm_mode = True


class Capture(CaptureInDBBase):
    pass


class WebsiteDetail(BaseModel):
    id: int
    name: str
    domain: str
    url: str


class PageDetail(BaseModel):
    id: int
    url: str
    title: Optional[str] = None


class CaptureWithDetails(Capture):
    website: Optional[WebsiteDetail] = None
    pages: Optional[List[PageDetail]] = []
    pageCount: Optional[int] = 0
    completedPageCount: Optional[int] = 0


class CaptureConfig(BaseModel):
    url: str
    deviceTypes: List[str]
    customSizes: Optional[List[dict]] = None
    captureFullPage: bool = True
    captureDynamicElements: bool = False
    initialTags: Optional[List[str]] = None