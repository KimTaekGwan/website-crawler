from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class DeviceProfile(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    width = Column(Integer, nullable=False)
    height = Column(Integer, nullable=False)
    is_default = Column(Boolean, default=False)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=True)
    
    # 관계 설정
    user = relationship("User", back_populates="device_profiles")