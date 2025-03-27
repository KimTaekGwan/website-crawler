from typing import Optional
from pydantic import BaseModel


class TagBase(BaseModel):
    name: str
    color: str
    description: Optional[str] = None


class TagCreate(TagBase):
    pass


class TagUpdate(TagBase):
    name: Optional[str] = None
    color: Optional[str] = None


class TagInDBBase(TagBase):
    id: int

    class Config:
        orm_mode = True


class Tag(TagInDBBase):
    pass