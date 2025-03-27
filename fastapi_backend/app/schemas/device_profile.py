from typing import Optional
from pydantic import BaseModel


class DeviceProfileBase(BaseModel):
    name: str
    width: int
    height: int
    is_default: bool = False
    user_id: Optional[int] = None


class DeviceProfileCreate(DeviceProfileBase):
    pass


class DeviceProfileUpdate(DeviceProfileBase):
    name: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    is_default: Optional[bool] = None
    user_id: Optional[int] = None


class DeviceProfileInDBBase(DeviceProfileBase):
    id: int

    class Config:
        orm_mode = True


class DeviceProfile(DeviceProfileInDBBase):
    pass