from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime

from app.schemas.tag import Tag
from app.schemas.screenshot import Screenshot


class PageBase(BaseModel):
    url: str
    title: Optional[str] = None
    website_id: int
    capture_id: int


class PageCreate(PageBase):
    pass


class PageUpdate(PageBase):
    url: Optional[str] = None
    title: Optional[str] = None
    website_id: Optional[int] = None
    capture_id: Optional[int] = None


class PageInDBBase(PageBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


class Page(PageInDBBase):
    pass


class PageWithDetails(Page):
    tags: Optional[List[Tag]] = []
    screenshots: Optional[List[Screenshot]] = []


class PageTagBase(BaseModel):
    page_id: int
    tag_id: int


class PageTagCreate(PageTagBase):
    pass


class PageTagInDBBase(PageTagBase):
    id: int

    class Config:
        orm_mode = True


class PageTag(PageTagInDBBase):
    pass