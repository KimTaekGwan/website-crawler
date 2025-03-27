from typing import Optional, List
from pydantic import BaseModel, HttpUrl
from datetime import datetime

from app.schemas.tag import Tag


class WebsiteBase(BaseModel):
    name: str
    url: HttpUrl
    domain: str


class WebsiteCreate(WebsiteBase):
    pass


class WebsiteUpdate(WebsiteBase):
    name: Optional[str] = None
    url: Optional[HttpUrl] = None
    domain: Optional[str] = None


class WebsiteInDBBase(WebsiteBase):
    id: int

    class Config:
        orm_mode = True


class Website(WebsiteInDBBase):
    pass


class WebsiteWithDetails(Website):
    tags: Optional[List[Tag]] = []
    captureCount: Optional[int] = 0
    pageCount: Optional[int] = 0
    latestCapture: Optional[dict] = None


class WebsiteTagBase(BaseModel):
    website_id: int
    tag_id: int


class WebsiteTagCreate(WebsiteTagBase):
    pass


class WebsiteTagInDBBase(WebsiteTagBase):
    id: int

    class Config:
        orm_mode = True


class WebsiteTag(WebsiteTagInDBBase):
    pass